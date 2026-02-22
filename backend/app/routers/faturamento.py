from __future__ import annotations

import csv
import io
from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import and_, case, func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_admin_user
from app.models.categoria import CategoriaServico
from app.models.empresa import Empresa
from app.models.faturamento import Faturamento
from app.models.ticket import Ticket
from app.models.usuario import Usuario
from app.schemas.faturamento import (
    FaturamentoCreate,
    FaturamentoListItem,
    FaturamentoResponse,
    FaturamentoResumo,
    FaturamentoUpdate,
)

router = APIRouter(prefix="/api/faturamento", tags=["faturamento"])


def _mes_atual() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m")


def _ensure_mes_referencia(mes_referencia: Optional[str]) -> str:
    if mes_referencia:
        return mes_referencia
    return _mes_atual()


@router.get("", response_model=List[FaturamentoListItem])
def listar_faturamento(
    mes_referencia: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}$"),
    empresa_id: Optional[UUID] = None,
    faturado: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    mes_ref = _ensure_mes_referencia(mes_referencia)

    q = (
        db.query(
            Faturamento.id,
            Faturamento.ticket_id,
            Faturamento.empresa_id,
            Ticket.numero.label("ticket_numero"),
            Ticket.titulo.label("ticket_titulo"),
            Ticket.descricao.label("ticket_descricao"),
            CategoriaServico.nome.label("categoria_nome"),
            Empresa.nome.label("empresa_nome"),
            Ticket.data_criacao.label("data_ticket"),
            Faturamento.valor,
            Faturamento.descricao,
            Faturamento.mes_referencia,
            Faturamento.faturado,
            Faturamento.data_faturacao,
            Faturamento.numero_nota_fiscal,
        )
        .join(Ticket, Ticket.id == Faturamento.ticket_id)
        .join(Empresa, Empresa.id == Faturamento.empresa_id)
        .outerjoin(CategoriaServico, CategoriaServico.id == Ticket.categoria_id)
        .filter(Faturamento.ativo == True, Faturamento.mes_referencia == mes_ref)
    )

    if empresa_id:
        q = q.filter(Faturamento.empresa_id == empresa_id)
    if faturado is not None:
        q = q.filter(Faturamento.faturado == faturado)

    rows = q.order_by(Ticket.data_criacao.desc()).offset(skip).limit(limit).all()
    return [FaturamentoListItem(**row._asdict()) for row in rows]


@router.get("/resumo", response_model=FaturamentoResumo)
def resumo_faturamento(
    mes_referencia: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}$"),
    empresa_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    mes_ref = _ensure_mes_referencia(mes_referencia)

    filtros = [Faturamento.ativo == True, Faturamento.mes_referencia == mes_ref]
    if empresa_id:
        filtros.append(Faturamento.empresa_id == empresa_id)

    resumo = db.query(
        func.count(Faturamento.id),
        func.coalesce(func.sum(case((Faturamento.faturado == False, Faturamento.valor), else_=0)), 0),
        func.coalesce(func.sum(case((Faturamento.faturado == True, Faturamento.valor), else_=0)), 0),
        func.coalesce(func.sum(Faturamento.valor), 0),
    ).filter(and_(*filtros)).one()

    return FaturamentoResumo(
        mes_referencia=mes_ref,
        total_registros=int(resumo[0] or 0),
        subtotal_pendente=Decimal(resumo[1] or 0),
        subtotal_faturado=Decimal(resumo[2] or 0),
        total_geral=Decimal(resumo[3] or 0),
    )


@router.post("", response_model=FaturamentoResponse, status_code=201)
def criar_faturamento(
    data: FaturamentoCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == data.ticket_id, Ticket.ativo == True).first()
    if not ticket:
        raise HTTPException(status_code=400, detail="Ticket não encontrado")
    if ticket.empresa_id != data.empresa_id:
        raise HTTPException(status_code=400, detail="Empresa do ticket não confere")

    empresa = db.query(Empresa).filter(Empresa.id == data.empresa_id, Empresa.ativo == True).first()
    if not empresa:
        raise HTTPException(status_code=400, detail="Empresa não encontrada")

    existente = db.query(Faturamento).filter(Faturamento.ticket_id == data.ticket_id, Faturamento.ativo == True).first()
    if existente:
        raise HTTPException(status_code=400, detail="Já existe faturamento para este ticket")

    faturamento = Faturamento(
        ticket_id=data.ticket_id,
        empresa_id=data.empresa_id,
        valor=data.valor,
        descricao=data.descricao,
        mes_referencia=data.mes_referencia,
        data_faturamento=datetime.now(timezone.utc),
        faturado=data.faturado,
        data_faturacao=datetime.now(timezone.utc) if data.faturado else None,
        numero_nota_fiscal=data.numero_nota_fiscal,
    )

    db.add(faturamento)
    db.commit()
    db.refresh(faturamento)
    return faturamento


@router.put("/{faturamento_id}", response_model=FaturamentoResponse)
def atualizar_faturamento(
    faturamento_id: UUID,
    data: FaturamentoUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    faturamento = db.query(Faturamento).filter(Faturamento.id == faturamento_id, Faturamento.ativo == True).first()
    if not faturamento:
        raise HTTPException(status_code=404, detail="Faturamento não encontrado")

    payload = data.model_dump(exclude_unset=True)
    faturado_inicial = faturamento.faturado

    for campo, valor in payload.items():
        setattr(faturamento, campo, valor)

    if "faturado" in payload:
        if payload["faturado"] and not faturado_inicial:
            faturamento.data_faturacao = datetime.now(timezone.utc)
        if not payload["faturado"]:
            faturamento.data_faturacao = None

    db.commit()
    db.refresh(faturamento)
    return faturamento


@router.patch("/{faturamento_id}/status", response_model=FaturamentoResponse)
def atualizar_status_faturamento(
    faturamento_id: UUID,
    faturado: bool,
    numero_nota_fiscal: Optional[str] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    faturamento = db.query(Faturamento).filter(Faturamento.id == faturamento_id, Faturamento.ativo == True).first()
    if not faturamento:
        raise HTTPException(status_code=404, detail="Faturamento não encontrado")

    faturamento.faturado = faturado
    faturamento.numero_nota_fiscal = numero_nota_fiscal
    faturamento.data_faturacao = datetime.now(timezone.utc) if faturado else None

    db.commit()
    db.refresh(faturamento)
    return faturamento


@router.delete("/{faturamento_id}", status_code=204)
def deletar_faturamento(
    faturamento_id: UUID,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    faturamento = db.query(Faturamento).filter(Faturamento.id == faturamento_id, Faturamento.ativo == True).first()
    if not faturamento:
        raise HTTPException(status_code=404, detail="Faturamento não encontrado")

    faturamento.ativo = False
    db.commit()


@router.get("/export/csv")
def exportar_csv(
    mes_referencia: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}$"),
    empresa_id: Optional[UUID] = None,
    faturado: Optional[bool] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    mes_ref = _ensure_mes_referencia(mes_referencia)

    q = (
        db.query(
            Ticket.data_criacao,
            Ticket.titulo,
            CategoriaServico.nome,
            Ticket.numero,
            Faturamento.valor,
            Faturamento.faturado,
            Empresa.nome,
            Faturamento.numero_nota_fiscal,
        )
        .join(Ticket, Ticket.id == Faturamento.ticket_id)
        .join(Empresa, Empresa.id == Faturamento.empresa_id)
        .outerjoin(CategoriaServico, CategoriaServico.id == Ticket.categoria_id)
        .filter(Faturamento.ativo == True, Faturamento.mes_referencia == mes_ref)
    )

    if empresa_id:
        q = q.filter(Faturamento.empresa_id == empresa_id)
    if faturado is not None:
        q = q.filter(Faturamento.faturado == faturado)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Data", "Solicitação", "Serviço", "Nº Chamado", "Valor", "Faturado", "Empresa", "NF"])

    for row in q.order_by(Ticket.data_criacao.desc()).all():
        writer.writerow([
            row[0].strftime("%Y-%m-%d %H:%M") if row[0] else "",
            row[1],
            row[2] or "",
            row[3],
            str(row[4]),
            "Sim" if row[5] else "Não",
            row[6],
            row[7] or "",
        ])

    output.seek(0)
    filename = f"faturamento-{mes_ref}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/export/json")
def exportar_json(
    mes_referencia: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}$"),
    empresa_id: Optional[UUID] = None,
    faturado: Optional[bool] = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    mes_ref = _ensure_mes_referencia(mes_referencia)

    q = (
        db.query(
            Faturamento,
            Ticket.numero,
            Ticket.titulo,
            Ticket.descricao,
            CategoriaServico.nome.label("categoria_nome"),
            Empresa.nome.label("empresa_nome"),
        )
        .join(Ticket, Ticket.id == Faturamento.ticket_id)
        .join(Empresa, Empresa.id == Faturamento.empresa_id)
        .outerjoin(CategoriaServico, CategoriaServico.id == Ticket.categoria_id)
        .filter(Faturamento.ativo == True, Faturamento.mes_referencia == mes_ref)
    )

    if empresa_id:
        q = q.filter(Faturamento.empresa_id == empresa_id)
    if faturado is not None:
        q = q.filter(Faturamento.faturado == faturado)

    data = []
    for faturamento, numero, titulo, descricao, categoria_nome, empresa_nome in q.all():
        data.append({
            "id": str(faturamento.id),
            "ticket_id": str(faturamento.ticket_id),
            "empresa_id": str(faturamento.empresa_id),
            "ticket_numero": numero,
            "ticket_titulo": titulo,
            "ticket_descricao": descricao,
            "categoria_nome": categoria_nome,
            "empresa_nome": empresa_nome,
            "valor": float(faturamento.valor),
            "descricao": faturamento.descricao,
            "mes_referencia": faturamento.mes_referencia,
            "faturado": faturamento.faturado,
            "data_faturacao": faturamento.data_faturacao.isoformat() if faturamento.data_faturacao else None,
            "numero_nota_fiscal": faturamento.numero_nota_fiscal,
        })

    return {
        "mes_referencia": mes_ref,
        "total": len(data),
        "items": data,
    }

import logging
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.ticket import Ticket
from app.models.empresa import Empresa
from app.models.contato import Contato
from app.models.categoria import CategoriaServico
from app.models.usuario import Usuario
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketClose, TicketResponse
from app.dependencies import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/tickets", tags=["tickets"])

STATUSES = {"aberto", "em_andamento", "resolvido", "fechado"}


def _gerar_numero(db: Session) -> str:
    data = datetime.now().strftime("%Y%m%d")
    prefix = f"TPT-{data}-"
    ultimo = (
        db.query(Ticket)
        .filter(Ticket.numero.startswith(prefix))
        .order_by(Ticket.numero.desc())
        .first()
    )
    seq = 1 if not ultimo else int(ultimo.numero.split("-")[-1]) + 1
    return f"{prefix}{seq:03d}"


@router.get("", response_model=List[TicketResponse])
def listar(
    status: Optional[str] = None,
    empresa_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    if status and status not in STATUSES:
        raise HTTPException(status_code=400, detail=f"Status inválido. Use: {', '.join(STATUSES)}")
    q = db.query(Ticket).filter(Ticket.ativo == True)
    if status:
        q = q.filter(Ticket.status == status)
    if empresa_id:
        q = q.filter(Ticket.empresa_id == empresa_id)
    return q.order_by(Ticket.data_criacao.desc()).offset(skip).limit(limit).all()


@router.post("", response_model=TicketResponse, status_code=201)
def criar(
    data: TicketCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    if not db.query(Empresa).filter(Empresa.id == data.empresa_id, Empresa.ativo == True).first():
        raise HTTPException(status_code=400, detail="Empresa não encontrada")
    if not db.query(Contato).filter(Contato.id == data.contato_id, Contato.ativo == True).first():
        raise HTTPException(status_code=400, detail="Contato não encontrado")
    if not db.query(CategoriaServico).filter(CategoriaServico.id == data.categoria_id, CategoriaServico.ativo == True).first():
        raise HTTPException(status_code=400, detail="Categoria não encontrada")

    ticket = Ticket(numero=_gerar_numero(db), **data.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    logger.info(f"Ticket criado: {ticket.numero}")
    return ticket


@router.get("/{ticket_id}", response_model=TicketResponse)
def obter(
    ticket_id: UUID,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.ativo == True).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket não encontrado")
    return ticket


@router.put("/{ticket_id}", response_model=TicketResponse)
def atualizar(
    ticket_id: UUID,
    data: TicketUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.ativo == True).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket não encontrado")
    if data.status and data.status not in STATUSES:
        raise HTTPException(status_code=400, detail="Status inválido")
    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(ticket, campo, valor)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.post("/{ticket_id}/fechar", response_model=TicketResponse)
def fechar(
    ticket_id: UUID,
    data: TicketClose,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.ativo == True).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket não encontrado")
    if ticket.status == "fechado":
        raise HTTPException(status_code=400, detail="Ticket já está fechado")

    ticket.status = "fechado"
    ticket.solucao_descricao = data.solucao_descricao
    ticket.tempo_gasto_horas = data.tempo_gasto_horas
    ticket.data_fechamento = datetime.utcnow()
    db.commit()
    db.refresh(ticket)
    logger.info(f"Ticket fechado: {ticket.numero}")
    return ticket


@router.patch("/{ticket_id}/status", response_model=TicketResponse)
def mudar_status(
    ticket_id: UUID,
    status: str,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    if status not in STATUSES:
        raise HTTPException(status_code=400, detail="Status inválido")
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.ativo == True).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket não encontrado")
    ticket.status = status
    if status == "fechado":
        ticket.data_fechamento = datetime.utcnow()
    db.commit()
    db.refresh(ticket)
    return ticket

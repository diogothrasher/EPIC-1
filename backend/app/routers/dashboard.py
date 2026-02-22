from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.faturamento import Faturamento
from app.models.ticket import Ticket
from app.models.usuario import Usuario
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/resumo")
def resumo(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    hoje = datetime.utcnow().date()
    inicio_hoje = datetime.combine(hoje, datetime.min.time())
    mes_atual = hoje.strftime("%Y-%m")
    ano_atual = hoje.strftime("%Y")

    abertos = db.query(func.count(Ticket.id)).filter(Ticket.status == "aberto", Ticket.ativo == True).scalar()
    em_andamento = db.query(func.count(Ticket.id)).filter(Ticket.status == "em_andamento", Ticket.ativo == True).scalar()
    fechados = db.query(func.count(Ticket.id)).filter(Ticket.status.in_(["fechado", "resolvido"]), Ticket.ativo == True).scalar()
    hoje_count = db.query(func.count(Ticket.id)).filter(Ticket.data_criacao >= inicio_hoje, Ticket.ativo == True).scalar()
    faturado_mes = (
        db.query(func.coalesce(func.sum(Faturamento.valor), 0))
        .filter(Faturamento.ativo == True, Faturamento.mes_referencia == mes_atual, Faturamento.faturado == True)
        .scalar()
    )
    faturado_ytd = (
        db.query(func.coalesce(func.sum(Faturamento.valor), 0))
        .filter(Faturamento.ativo == True, Faturamento.mes_referencia.like(f"{ano_atual}-%"), Faturamento.faturado == True)
        .scalar()
    )

    return {
        "abertos": abertos,
        "em_andamento": em_andamento,
        "fechados": fechados,
        "tickets_hoje": hoje_count,
        "faturado_mes": float(faturado_mes or 0),
        "faturado_ytd": float(faturado_ytd or 0),
    }

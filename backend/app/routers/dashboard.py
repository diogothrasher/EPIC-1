from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
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

    abertos = db.query(func.count(Ticket.id)).filter(Ticket.status == "aberto", Ticket.ativo == True).scalar()
    em_andamento = db.query(func.count(Ticket.id)).filter(Ticket.status == "em_andamento", Ticket.ativo == True).scalar()
    hoje_count = db.query(func.count(Ticket.id)).filter(Ticket.data_criacao >= inicio_hoje, Ticket.ativo == True).scalar()

    return {
        "abertos": abertos,
        "em_andamento": em_andamento,
        "tickets_hoje": hoje_count,
    }

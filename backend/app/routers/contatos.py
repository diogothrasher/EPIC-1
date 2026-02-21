import logging
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.contato import Contato
from app.models.empresa import Empresa
from app.models.usuario import Usuario
from app.schemas.contato import ContatoCreate, ContatoUpdate, ContatoResponse
from app.dependencies import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/contatos", tags=["contatos"])


@router.get("", response_model=List[ContatoResponse])
def listar(
    empresa_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    q = db.query(Contato).filter(Contato.ativo == True)
    if empresa_id:
        q = q.filter(Contato.empresa_id == empresa_id)
    return q.offset(skip).limit(limit).all()


@router.post("", response_model=ContatoResponse, status_code=201)
def criar(
    data: ContatoCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    empresa = db.query(Empresa).filter(Empresa.id == data.empresa_id, Empresa.ativo == True).first()
    if not empresa:
        raise HTTPException(status_code=400, detail="Empresa não encontrada")
    contato = Contato(**data.model_dump())
    db.add(contato)
    db.commit()
    db.refresh(contato)
    return contato


@router.get("/{contato_id}", response_model=ContatoResponse)
def obter(
    contato_id: UUID,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    contato = db.query(Contato).filter(Contato.id == contato_id, Contato.ativo == True).first()
    if not contato:
        raise HTTPException(status_code=404, detail="Contato não encontrado")
    return contato


@router.put("/{contato_id}", response_model=ContatoResponse)
def atualizar(
    contato_id: UUID,
    data: ContatoUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    contato = db.query(Contato).filter(Contato.id == contato_id, Contato.ativo == True).first()
    if not contato:
        raise HTTPException(status_code=404, detail="Contato não encontrado")
    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(contato, campo, valor)
    db.commit()
    db.refresh(contato)
    return contato


@router.delete("/{contato_id}", status_code=204)
def deletar(
    contato_id: UUID,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    contato = db.query(Contato).filter(Contato.id == contato_id, Contato.ativo == True).first()
    if not contato:
        raise HTTPException(status_code=404, detail="Contato não encontrado")
    contato.ativo = False
    db.commit()

import logging
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.empresa import Empresa
from app.models.usuario import Usuario
from app.schemas.empresa import EmpresaCreate, EmpresaUpdate, EmpresaResponse
from app.dependencies import get_current_user, get_admin_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/empresas", tags=["empresas"])


@router.get("", response_model=List[EmpresaResponse])
def listar(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=500),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return db.query(Empresa).filter(Empresa.ativo == True).offset(skip).limit(limit).all()


@router.post("", response_model=EmpresaResponse, status_code=201)
def criar(
    data: EmpresaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    if data.cnpj:
        exists = db.query(Empresa).filter(Empresa.cnpj == data.cnpj, Empresa.ativo == True).first()
        if exists:
            raise HTTPException(status_code=400, detail="CNPJ já cadastrado")
    empresa = Empresa(**data.model_dump())
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa


@router.get("/{empresa_id}", response_model=EmpresaResponse)
def obter(
    empresa_id: UUID,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id, Empresa.ativo == True).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa


@router.put("/{empresa_id}", response_model=EmpresaResponse)
def atualizar(
    empresa_id: UUID,
    data: EmpresaUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id, Empresa.ativo == True).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(empresa, campo, valor)
    db.commit()
    db.refresh(empresa)
    return empresa


@router.delete("/{empresa_id}", status_code=204)
def deletar(
    empresa_id: UUID,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id, Empresa.ativo == True).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    empresa.ativo = False
    db.commit()

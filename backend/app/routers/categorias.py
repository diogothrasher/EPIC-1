from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.categoria import CategoriaServico
from app.models.usuario import Usuario
from app.schemas.categoria import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from app.dependencies import get_current_user, get_admin_user

router = APIRouter(prefix="/api/categorias", tags=["categorias"])


@router.get("", response_model=List[CategoriaResponse])
def listar(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return db.query(CategoriaServico).filter(CategoriaServico.ativo == True).order_by(CategoriaServico.ordem).all()


@router.post("", response_model=CategoriaResponse, status_code=201)
def criar(
    data: CategoriaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    exists = db.query(CategoriaServico).filter(CategoriaServico.nome == data.nome).first()
    if exists:
        raise HTTPException(status_code=400, detail="Categoria já existe")
    cat = CategoriaServico(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/{cat_id}", response_model=CategoriaResponse)
def atualizar(
    cat_id: UUID,
    data: CategoriaUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    cat = db.query(CategoriaServico).filter(CategoriaServico.id == cat_id, CategoriaServico.ativo == True).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(cat, campo, valor)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{cat_id}", status_code=204)
def deletar(
    cat_id: UUID,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_user),
):
    cat = db.query(CategoriaServico).filter(CategoriaServico.id == cat_id, CategoriaServico.ativo == True).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    cat.ativo = False
    db.commit()

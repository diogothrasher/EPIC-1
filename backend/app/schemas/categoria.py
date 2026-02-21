from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CategoriaCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    cor_tag: str = "#3B82F6"
    icone: Optional[str] = None
    ordem: int = 0


class CategoriaUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    cor_tag: Optional[str] = None
    icone: Optional[str] = None
    ordem: Optional[int] = None


class CategoriaResponse(BaseModel):
    id: UUID
    nome: str
    descricao: Optional[str]
    cor_tag: str
    icone: Optional[str]
    ordem: int
    ativo: bool

    model_config = {"from_attributes": True}

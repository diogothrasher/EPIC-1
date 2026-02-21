from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class ContatoCreate(BaseModel):
    empresa_id: UUID
    nome: str
    email: Optional[str] = None
    telefone: Optional[str] = None
    cargo: Optional[str] = None
    departamento: Optional[str] = None
    principal: bool = False

    @field_validator("nome")
    @classmethod
    def nome_nao_vazio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Nome não pode ser vazio")
        return v.strip()


class ContatoUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    cargo: Optional[str] = None
    departamento: Optional[str] = None
    principal: Optional[bool] = None


class ContatoResponse(BaseModel):
    id: UUID
    empresa_id: UUID
    nome: str
    email: Optional[str]
    telefone: Optional[str]
    cargo: Optional[str]
    departamento: Optional[str]
    principal: bool
    ativo: bool
    data_criacao: datetime

    model_config = {"from_attributes": True}

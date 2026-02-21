from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class TicketCreate(BaseModel):
    empresa_id: UUID
    contato_id: UUID
    categoria_id: UUID
    titulo: str
    descricao: str

    @field_validator("titulo")
    @classmethod
    def titulo_min(cls, v: str) -> str:
        if len(v.strip()) < 5:
            raise ValueError("Título deve ter ao menos 5 caracteres")
        return v.strip()

    @field_validator("descricao")
    @classmethod
    def descricao_min(cls, v: str) -> str:
        if len(v.strip()) < 10:
            raise ValueError("Descrição deve ter ao menos 10 caracteres")
        return v.strip()


class TicketUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    categoria_id: Optional[UUID] = None
    status: Optional[str] = None
    contato_id: Optional[UUID] = None


class TicketClose(BaseModel):
    solucao_descricao: str
    tempo_gasto_horas: Optional[float] = None

    @field_validator("solucao_descricao")
    @classmethod
    def solucao_min(cls, v: str) -> str:
        if len(v.strip()) < 10:
            raise ValueError("Solução deve ter ao menos 10 caracteres")
        return v.strip()


class TicketResponse(BaseModel):
    id: UUID
    numero: str
    empresa_id: UUID
    contato_id: UUID
    categoria_id: UUID
    titulo: str
    descricao: str
    status: str
    solucao_descricao: Optional[str]
    tempo_gasto_horas: Optional[float]
    data_criacao: datetime
    data_atualizacao: datetime
    data_fechamento: Optional[datetime]
    ativo: bool

    model_config = {"from_attributes": True}

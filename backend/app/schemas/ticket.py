from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator, Field


class TicketCreate(BaseModel):
    empresa_id: UUID
    contato_id: UUID
    categoria_id: UUID
    titulo: str = Field(..., min_length=5, max_length=255, description="Título do ticket")
    descricao: str = Field(..., min_length=10, max_length=5000, description="Descrição do problema")

    @field_validator("titulo")
    @classmethod
    def titulo_nao_vazio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Título não pode ser vazio ou conter apenas espaços")
        return v.strip()

    @field_validator("descricao")
    @classmethod
    def descricao_nao_vazio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Descrição não pode ser vazia ou conter apenas espaços")
        return v.strip()


class TicketUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=5, max_length=255)
    descricao: Optional[str] = Field(None, min_length=10, max_length=5000)
    categoria_id: Optional[UUID] = None
    status: Optional[str] = Field(None, pattern="^(aberto|em_andamento|resolvido|fechado)$")
    contato_id: Optional[UUID] = None

    @field_validator("titulo")
    @classmethod
    def validate_titulo(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Título não pode ser vazio ou conter apenas espaços")
        return v.strip() if v else v

    @field_validator("descricao")
    @classmethod
    def validate_descricao(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Descrição não pode ser vazia ou conter apenas espaços")
        return v.strip() if v else v


class TicketClose(BaseModel):
    solucao_descricao: str = Field(..., min_length=10, max_length=5000, description="Descrição da solução")
    tempo_gasto_horas: Optional[float] = Field(None, gt=0, le=1000, description="Tempo gasto em horas")

    @field_validator("solucao_descricao")
    @classmethod
    def solucao_nao_vazio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Solução não pode ser vazia ou conter apenas espaços")
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

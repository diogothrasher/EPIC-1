from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator, EmailStr, Field


class ContatoCreate(BaseModel):
    empresa_id: UUID
    nome: str = Field(..., min_length=3, max_length=255, description="Nome do contato")
    email: Optional[EmailStr] = None
    telefone: Optional[str] = Field(None, pattern=r"^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{10,11}$", description="Telefone do contato")
    cargo: Optional[str] = Field(None, max_length=255, description="Cargo do contato")
    departamento: Optional[str] = Field(None, max_length=255, description="Departamento")
    principal: bool = False

    @field_validator("nome")
    @classmethod
    def nome_nao_vazio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Nome não pode ser vazio ou conter apenas espaços")
        return v.strip()

    @field_validator("cargo", "departamento")
    @classmethod
    def validate_text_fields(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            return None
        return v.strip() if v else v


class ContatoUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=3, max_length=255)
    email: Optional[EmailStr] = None
    telefone: Optional[str] = Field(None, pattern=r"^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{10,11}$")
    cargo: Optional[str] = Field(None, max_length=255)
    departamento: Optional[str] = Field(None, max_length=255)
    principal: Optional[bool] = None

    @field_validator("nome")
    @classmethod
    def validate_nome(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Nome não pode ser vazio ou conter apenas espaços")
        return v.strip() if v else v

    @field_validator("cargo", "departamento")
    @classmethod
    def validate_text_fields(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            return None
        return v.strip() if v else v


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

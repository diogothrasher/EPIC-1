from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator, EmailStr, Field


class EmpresaCreate(BaseModel):
    nome: str = Field(..., min_length=3, max_length=255, description="Nome da empresa")
    cnpj: Optional[str] = Field(None, pattern=r"^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$|^\d{14}$", description="CNPJ da empresa")
    telefone: Optional[str] = Field(None, pattern=r"^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{10,11}$", description="Telefone")
    email: Optional[EmailStr] = None
    endereco: Optional[str] = Field(None, max_length=500, description="Endereço completo")

    @field_validator("nome")
    @classmethod
    def nome_nao_vazio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Nome não pode ser vazio ou conter apenas espaços")
        return v.strip()

    @field_validator("cnpj")
    @classmethod
    def validate_cnpj(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        # Remove caracteres especiais para validação
        cnpj_clean = v.replace(".", "").replace("/", "").replace("-", "")
        if len(cnpj_clean) != 14 or not cnpj_clean.isdigit():
            raise ValueError("CNPJ inválido. Use formato XX.XXX.XXX/XXXX-XX ou 14 dígitos")
        return v.strip()


class EmpresaUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=3, max_length=255)
    cnpj: Optional[str] = Field(None, pattern=r"^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$|^\d{14}$")
    telefone: Optional[str] = Field(None, pattern=r"^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{10,11}$")
    email: Optional[EmailStr] = None
    endereco: Optional[str] = Field(None, max_length=500)
    contato_principal_id: Optional[UUID] = None

    @field_validator("nome")
    @classmethod
    def validate_nome(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Nome não pode ser vazio ou conter apenas espaços")
        return v.strip() if v else v


class EmpresaResponse(BaseModel):
    id: UUID
    nome: str
    cnpj: Optional[str]
    telefone: Optional[str]
    email: Optional[str]
    endereco: Optional[str]
    contato_principal_id: Optional[UUID]
    ativo: bool
    data_criacao: datetime

    model_config = {"from_attributes": True}

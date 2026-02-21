from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str


class UsuarioResponse(BaseModel):
    id: UUID
    email: str
    nome: str
    role: str
    ativo: bool
    data_criacao: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse

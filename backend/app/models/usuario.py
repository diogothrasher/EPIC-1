from sqlalchemy import Column, String, DateTime
from app.models.base import BaseModel


class Usuario(BaseModel):
    __tablename__ = "usuarios"

    email = Column(String(255), unique=True, nullable=False, index=True)
    senha_hash = Column(String(255), nullable=False)
    nome = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="tecnico")
    ultimo_acesso = Column(DateTime(timezone=True), nullable=True)

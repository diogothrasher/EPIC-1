from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Empresa(BaseModel):
    __tablename__ = "empresas"

    nome = Column(String(255), nullable=False)
    cnpj = Column(String(18), unique=True, nullable=True)
    telefone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    endereco = Column(Text, nullable=True)
    contato_principal_id = Column(UUID(as_uuid=True), nullable=True)

    contatos = relationship("Contato", back_populates="empresa", foreign_keys="Contato.empresa_id")
    tickets = relationship("Ticket", back_populates="empresa")
    faturamentos = relationship("Faturamento", back_populates="empresa")

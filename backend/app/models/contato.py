from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Contato(BaseModel):
    __tablename__ = "contatos"

    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empresas.id", ondelete="CASCADE"), nullable=False, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    telefone = Column(String(20), nullable=True)
    cargo = Column(String(100), nullable=True)
    departamento = Column(String(100), nullable=True)
    principal = Column(Boolean, default=False, index=True)

    empresa = relationship("Empresa", back_populates="contatos", foreign_keys=[empresa_id])
    tickets = relationship("Ticket", back_populates="contato")

from sqlalchemy import Column, String, Text, Numeric, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Faturamento(BaseModel):
    __tablename__ = "faturamento"

    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id", ondelete="RESTRICT"), nullable=False, unique=True, index=True)
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empresas.id", ondelete="RESTRICT"), nullable=False, index=True)

    valor = Column(Numeric(10, 2), nullable=False)
    descricao = Column(Text, nullable=True)

    mes_referencia = Column(String(7), nullable=False, index=True)  # YYYY-MM
    data_faturamento = Column(DateTime(timezone=True), nullable=True)

    faturado = Column(Boolean, default=False, nullable=False, index=True)
    data_faturacao = Column(DateTime(timezone=True), nullable=True)
    numero_nota_fiscal = Column(String(50), nullable=True)

    ticket = relationship("Ticket", back_populates="faturamento")
    empresa = relationship("Empresa", back_populates="faturamentos")

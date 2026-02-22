from sqlalchemy import Column, String, Text, ForeignKey, Numeric, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Ticket(BaseModel):
    __tablename__ = "tickets"
    __table_args__ = (
        CheckConstraint("status IN ('aberto', 'em_andamento', 'resolvido', 'fechado')", name="ck_tickets_status"),
    )

    numero = Column(String(20), unique=True, nullable=False, index=True)
    empresa_id = Column(UUID(as_uuid=True), ForeignKey("empresas.id", ondelete="RESTRICT"), nullable=False, index=True)
    contato_id = Column(UUID(as_uuid=True), ForeignKey("contatos.id", ondelete="RESTRICT"), nullable=False)
    categoria_id = Column(UUID(as_uuid=True), ForeignKey("categorias_servico.id", ondelete="RESTRICT"), nullable=False)

    titulo = Column(String(255), nullable=False)
    descricao = Column(Text, nullable=False)
    status = Column(String(20), default="aberto", nullable=False, index=True)
    solucao_descricao = Column(Text, nullable=True)
    tempo_gasto_horas = Column(Numeric(5, 2), nullable=True)
    data_fechamento = Column(DateTime(timezone=True), nullable=True)

    empresa = relationship("Empresa", back_populates="tickets")
    contato = relationship("Contato", back_populates="tickets")
    categoria = relationship("CategoriaServico", back_populates="tickets")
    faturamento = relationship("Faturamento", back_populates="ticket", uselist=False)

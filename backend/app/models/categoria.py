from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class CategoriaServico(BaseModel):
    __tablename__ = "categorias_servico"

    nome = Column(String(100), unique=True, nullable=False)
    descricao = Column(String(500), nullable=True)
    cor_tag = Column(String(7), default="#3B82F6")
    icone = Column(String(50), nullable=True)
    ordem = Column(Integer, default=0, index=True)

    tickets = relationship("Ticket", back_populates="categoria")

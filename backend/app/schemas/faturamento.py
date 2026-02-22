from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator


class FaturamentoCreate(BaseModel):
    ticket_id: UUID
    empresa_id: UUID
    valor: Decimal = Field(..., gt=0)
    descricao: Optional[str] = None
    mes_referencia: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    faturado: bool = False
    numero_nota_fiscal: Optional[str] = None

    @field_validator("descricao")
    @classmethod
    def sanitize_descricao(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        value = value.strip()
        return value or None


class FaturamentoUpdate(BaseModel):
    valor: Optional[Decimal] = Field(None, gt=0)
    descricao: Optional[str] = None
    mes_referencia: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    faturado: Optional[bool] = None
    numero_nota_fiscal: Optional[str] = None

    @field_validator("descricao")
    @classmethod
    def sanitize_descricao(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        value = value.strip()
        return value or None


class FaturamentoResponse(BaseModel):
    id: UUID
    ticket_id: UUID
    empresa_id: UUID
    valor: Decimal
    descricao: Optional[str]
    mes_referencia: str
    data_faturamento: Optional[datetime]
    faturado: bool
    data_faturacao: Optional[datetime]
    numero_nota_fiscal: Optional[str]
    data_criacao: datetime
    data_atualizacao: datetime
    ativo: bool

    model_config = {"from_attributes": True}


class FaturamentoListItem(BaseModel):
    id: UUID
    ticket_id: UUID
    empresa_id: UUID
    ticket_numero: str
    ticket_titulo: str
    ticket_descricao: str
    categoria_nome: Optional[str] = None
    empresa_nome: Optional[str] = None
    data_ticket: datetime
    valor: Decimal
    descricao: Optional[str]
    mes_referencia: str
    faturado: bool
    data_faturacao: Optional[datetime]
    numero_nota_fiscal: Optional[str]


class FaturamentoResumo(BaseModel):
    mes_referencia: str
    total_registros: int
    subtotal_pendente: Decimal
    subtotal_faturado: Decimal
    total_geral: Decimal

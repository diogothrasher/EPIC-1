"""create faturamento table

Revision ID: 007
Revises: 006
Create Date: 2026-02-22

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "007"
down_revision: Union[str, None] = "006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "faturamento",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("ticket_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("empresa_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("valor", sa.Numeric(10, 2), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=True),
        sa.Column("mes_referencia", sa.String(7), nullable=False),
        sa.Column("data_faturamento", sa.DateTime(timezone=True), nullable=True),
        sa.Column("faturado", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("data_faturacao", sa.DateTime(timezone=True), nullable=True),
        sa.Column("numero_nota_fiscal", sa.String(50), nullable=True),
        sa.Column("ativo", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("data_criacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("data_atualizacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["ticket_id"], ["tickets.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["empresa_id"], ["empresas.id"], ondelete="RESTRICT"),
        sa.UniqueConstraint("ticket_id", name="uq_faturamento_ticket_id"),
    )
    op.create_index("idx_faturamento_ticket_id", "faturamento", ["ticket_id"])
    op.create_index("idx_faturamento_empresa_id", "faturamento", ["empresa_id"])
    op.create_index("idx_faturamento_mes_referencia", "faturamento", ["mes_referencia"])
    op.create_index("idx_faturamento_faturado", "faturamento", ["faturado"])
    op.create_index("idx_faturamento_empresa_mes", "faturamento", ["empresa_id", "mes_referencia"])
    op.create_index("idx_faturamento_ativo", "faturamento", ["ativo"])


def downgrade() -> None:
    op.drop_table("faturamento")

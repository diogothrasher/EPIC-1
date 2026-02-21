"""create tickets table

Revision ID: 005
Revises: 004
Create Date: 2026-02-21

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "tickets",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("numero", sa.String(20), unique=True, nullable=False),
        sa.Column("empresa_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("contato_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("categoria_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("titulo", sa.String(255), nullable=False),
        sa.Column("descricao", sa.Text, nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="aberto"),
        sa.Column("solucao_descricao", sa.Text, nullable=True),
        sa.Column("tempo_gasto_horas", sa.Numeric(5, 2), nullable=True),
        sa.Column("data_fechamento", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ativo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("data_criacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("data_atualizacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["empresa_id"], ["empresas.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["contato_id"], ["contatos.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["categoria_id"], ["categorias_servico.id"], ondelete="RESTRICT"),
        sa.CheckConstraint("status IN ('aberto', 'em_andamento', 'resolvido', 'fechado')", name="ck_tickets_status"),
    )
    op.create_index("idx_tickets_numero", "tickets", ["numero"])
    op.create_index("idx_tickets_empresa_id", "tickets", ["empresa_id"])
    op.create_index("idx_tickets_status", "tickets", ["status"])
    op.create_index("idx_tickets_data_criacao", "tickets", ["data_criacao"])
    op.create_index("idx_tickets_empresa_status", "tickets", ["empresa_id", "status"])
    op.create_index("idx_tickets_ativo", "tickets", ["ativo"])


def downgrade() -> None:
    op.drop_table("tickets")

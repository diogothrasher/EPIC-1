"""create categorias_servico table

Revision ID: 004
Revises: 003
Create Date: 2026-02-21

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "categorias_servico",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("nome", sa.String(100), unique=True, nullable=False),
        sa.Column("descricao", sa.String(500), nullable=True),
        sa.Column("cor_tag", sa.String(7), nullable=False, server_default="#3B82F6"),
        sa.Column("icone", sa.String(50), nullable=True),
        sa.Column("ordem", sa.Integer, nullable=False, server_default="0"),
        sa.Column("ativo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("data_criacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("data_atualizacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_categorias_ativo", "categorias_servico", ["ativo"])
    op.create_index("idx_categorias_ordem", "categorias_servico", ["ordem"])


def downgrade() -> None:
    op.drop_table("categorias_servico")

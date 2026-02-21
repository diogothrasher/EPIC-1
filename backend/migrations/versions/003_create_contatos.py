"""create contatos table

Revision ID: 003
Revises: 002
Create Date: 2026-02-21

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "contatos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("empresa_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("nome", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("telefone", sa.String(20), nullable=True),
        sa.Column("cargo", sa.String(100), nullable=True),
        sa.Column("departamento", sa.String(100), nullable=True),
        sa.Column("principal", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("ativo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("data_criacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("data_atualizacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["empresa_id"], ["empresas.id"], ondelete="CASCADE"),
    )
    op.create_index("idx_contatos_empresa_id", "contatos", ["empresa_id"])
    op.create_index("idx_contatos_principal", "contatos", ["principal"])
    op.create_index("idx_contatos_ativo", "contatos", ["ativo"])

    op.create_foreign_key(
        "fk_empresas_contato_principal",
        "empresas", "contatos",
        ["contato_principal_id"], ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_empresas_contato_principal", "empresas", type_="foreignkey")
    op.drop_table("contatos")

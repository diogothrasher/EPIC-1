"""create usuarios table

Revision ID: 001
Revises:
Create Date: 2026-02-21

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "usuarios",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("senha_hash", sa.String(255), nullable=False),
        sa.Column("nome", sa.String(255), nullable=False),
        sa.Column("role", sa.String(20), nullable=False, server_default="tecnico"),
        sa.Column("ativo", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("ultimo_acesso", sa.DateTime(timezone=True), nullable=True),
        sa.Column("data_criacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("data_atualizacao", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint("role IN ('admin', 'tecnico')", name="ck_usuarios_role"),
    )
    op.create_index("idx_usuarios_email", "usuarios", ["email"])
    op.create_index("idx_usuarios_ativo", "usuarios", ["ativo"])


def downgrade() -> None:
    op.drop_table("usuarios")

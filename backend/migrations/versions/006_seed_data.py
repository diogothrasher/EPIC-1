"""seed initial data

Revision ID: 006
Revises: 005
Create Date: 2026-02-21

"""
from typing import Sequence, Union
from uuid import uuid4
from alembic import op
import sqlalchemy as sa

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

CATEGORIAS = [
    ("Hardware", "HardDrive", "#EF4444", 1),
    ("Software", "Code", "#8B5CF6", 2),
    ("Rede", "Wifi", "#3B82F6", 3),
    ("Manutenção Preventiva", "Settings", "#F59E0B", 4),
    ("Consultoria", "Users", "#10B981", 5),
    ("Instalação", "Package", "#6366F1", 6),
    ("Suporte Remoto", "Monitor", "#EC4899", 7),
    ("Outra", "MoreHorizontal", "#9CA3AF", 8),
]


def upgrade() -> None:
    conn = op.get_bind()

    for nome, icone, cor, ordem in CATEGORIAS:
        conn.execute(
            sa.text(
                "INSERT INTO categorias_servico (id, nome, icone, cor_tag, ordem, ativo, data_criacao, data_atualizacao) "
                "VALUES (:id, :nome, :icone, :cor, :ordem, true, now(), now())"
            ),
            {"id": str(uuid4()), "nome": nome, "icone": icone, "cor": cor, "ordem": ordem},
        )

    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    from app.security import hash_password
    from app.config import settings

    conn.execute(
        sa.text(
            "INSERT INTO usuarios (id, email, senha_hash, nome, role, ativo, data_criacao, data_atualizacao) "
            "VALUES (:id, :email, :senha_hash, :nome, 'admin', true, now(), now())"
        ),
        {
            "id": str(uuid4()),
            "email": settings.admin_email,
            "senha_hash": hash_password(settings.admin_password),
            "nome": "Administrador",
        },
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(sa.text("DELETE FROM categorias_servico"))
    conn.execute(sa.text("DELETE FROM usuarios WHERE role = 'admin'"))

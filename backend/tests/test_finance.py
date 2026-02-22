from uuid import uuid4
from datetime import datetime

import pytest


@pytest.fixture()
def setup_finance_data(db, client):
    from app.models.usuario import Usuario
    from app.models.empresa import Empresa
    from app.models.contato import Contato
    from app.models.categoria import CategoriaServico
    from app.models.ticket import Ticket
    from app.security import hash_password

    admin = Usuario(
        id=uuid4(),
        nome="Admin",
        email="finance-admin@example.com",
        senha_hash=hash_password("AdminPass123!"),
        role="admin",
        ativo=True,
    )
    empresa = Empresa(
        id=uuid4(),
        nome="Empresa Financeira",
        cnpj=None,
    )
    contato = Contato(
        id=uuid4(),
        empresa_id=empresa.id,
        nome="Contato Financeiro",
        email="contato@financeira.com",
        telefone="11999999999",
    )
    categoria = CategoriaServico(
        id=uuid4(),
        nome="Financeiro Categoria",
    )
    ticket = Ticket(
        id=uuid4(),
        numero="TPT-20260222-001",
        empresa_id=empresa.id,
        contato_id=contato.id,
        categoria_id=categoria.id,
        titulo="Fechamento mensal",
        descricao="Ticket para teste de faturamento",
        status="fechado",
        data_fechamento=datetime.utcnow(),
    )

    db.add_all([admin, empresa, contato, categoria, ticket])
    db.commit()

    login = client.post("/api/auth/login", json={"email": admin.email, "senha": "AdminPass123!"})
    token = login.json()["access_token"]
    client.headers = {"Authorization": f"Bearer {token}"}
    return client, ticket, empresa


def test_finance_create_and_resumo(setup_finance_data):
    client, ticket, empresa = setup_finance_data

    create = client.post(
        "/api/faturamento",
        json={
            "ticket_id": str(ticket.id),
            "empresa_id": str(empresa.id),
            "valor": 250.75,
            "descricao": "Serviço mensal",
            "mes_referencia": "2026-02",
            "faturado": False,
        },
    )
    assert create.status_code == 201, create.text

    listing = client.get("/api/faturamento", params={"mes_referencia": "2026-02"})
    assert listing.status_code == 200
    assert len(listing.json()) == 1
    assert listing.json()[0]["ticket_numero"] == "TPT-20260222-001"

    resumo = client.get("/api/faturamento/resumo", params={"mes_referencia": "2026-02"})
    assert resumo.status_code == 200
    data = resumo.json()
    assert data["total_registros"] == 1
    assert float(data["total_geral"]) == 250.75


def test_finance_forbidden_for_tecnico(db, client):
    from app.models.usuario import Usuario
    from app.security import hash_password

    tecnico = Usuario(
        id=uuid4(),
        nome="Tecnico",
        email="finance-tech@example.com",
        senha_hash=hash_password("TechPass123!"),
        role="tecnico",
        ativo=True,
    )
    db.add(tecnico)
    db.commit()

    login = client.post("/api/auth/login", json={"email": tecnico.email, "senha": "TechPass123!"})
    token = login.json()["access_token"]
    client.headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/faturamento")
    assert response.status_code == 403

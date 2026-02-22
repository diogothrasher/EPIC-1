"""
Integration tests for the complete e2e flow of Sistema de Gestão.

Tests cover:
- User creation and authentication
- Company creation and listing
- Contact creation and listing by company
- Category creation and listing
- Ticket CRUD operations
- Ticket status updates
- Soft delete behavior
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.base import Base
from app.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import uuid4

# Test database setup
TEST_DB_URL = "sqlite:///./test_integration.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """Create test client with database dependency override."""
    def override_get_db():
        try:
            yield db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


class TestHealthEndpoint:
    """Tests for health check endpoint."""

    def test_health_endpoint(self, client):
        """Test health endpoint returns 200."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


class TestAuthenticationFlow:
    """Tests for user creation and authentication."""

    def test_login_with_valid_credentials(self, db, client):
        """Test: Create usuario → Login → 200 token"""
        from app.models.usuario import Usuario
        from app.security import hash_password
        
        user_id = uuid4()
        usuario = Usuario(
            id=user_id,
            nome="Test User",
            email="testuser@example.com",
            senha_hash=hash_password("TestPass123!"),
            role="admin",
            ativo=True
        )
        db.add(usuario)
        db.commit()

        # Login with valid credentials
        response = client.post("/api/auth/login", json={
            "email": "testuser@example.com",
            "senha": "TestPass123!"
        })

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "usuario" in data
        assert data["usuario"]["email"] == "testuser@example.com"

    def test_login_with_invalid_credentials(self, db, client):
        """Test login with invalid credentials returns 401."""
        response = client.post("/api/auth/login", json={
            "email": "nonexistent@example.com",
            "senha": "wrongpassword"
        })
        assert response.status_code in [401, 403]


class TestEmpresasFlow:
    """Tests for company operations."""

    @pytest.fixture
    def authenticated_client_and_user(self, db, client):
        """Create authenticated client with token and user."""
        from app.models.usuario import Usuario
        from app.security import hash_password

        user_id = uuid4()
        usuario = Usuario(
            id=user_id,
            nome="Admin User",
            email="admin@example.com",
            senha_hash=hash_password("AdminPass123!"),
            role="admin",
            ativo=True
        )
        db.add(usuario)
        db.commit()

        # Login to get token
        response = client.post("/api/auth/login", json={
            "email": "admin@example.com",
            "senha": "AdminPass123!"
        })
        token = response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}
        return client, user_id

    def test_create_empresa_and_list(self, authenticated_client_and_user):
        """Test: Create empresa → List → 200"""
        client, user_id = authenticated_client_and_user

        # Create empresa
        response = client.post("/api/empresas", json={
            "nome": "Test Company",
            "cnpj": "12345678000190",
            "endereco": "Rua Test, 123",
            "telefone": "11999999999"
        })
        assert response.status_code == 201
        empresa_data = response.json()
        assert empresa_data["nome"] == "Test Company"
        empresa_id = empresa_data["id"]

        # List empresas
        response = client.get("/api/empresas")
        assert response.status_code == 200
        assert len(response.json()) > 0
        assert any(e["id"] == empresa_id for e in response.json())

    def test_duplicate_cnpj_returns_400(self, authenticated_client_and_user):
        """Test that duplicate CNPJ returns 400."""
        client, _ = authenticated_client_and_user

        # Create empresa
        response = client.post("/api/empresas", json={
            "nome": "Company 1",
            "cnpj": "12345678000190",
            "endereco": "Rua Test, 123"
        })
        assert response.status_code == 201

        # Try to create empresa with same CNPJ
        response = client.post("/api/empresas", json={
            "nome": "Company 2",
            "cnpj": "12345678000190",
            "endereco": "Rua Test, 456"
        })
        assert response.status_code == 400
        assert "já cadastrado" in response.json()["detail"]


class TestContatosFlow:
    """Tests for contact operations."""

    @pytest.fixture
    def setup_with_empresa(self, db, client):
        """Setup database with empresa and authenticated client."""
        from app.models.usuario import Usuario
        from app.models.empresa import Empresa
        from app.security import hash_password

        user_id = uuid4()
        empresa_id = uuid4()

        usuario = Usuario(
            id=user_id,
            nome="Admin User",
            email="admin@example.com",
            senha_hash=hash_password("AdminPass123!"),
            role="admin",
            ativo=True
        )

        empresa = Empresa(
            id=empresa_id,
            nome="Test Company",
            cnpj="12345678000190",
            endereco="Rua Test, 123"
        )

        db.add(usuario)
        db.add(empresa)
        db.commit()

        # Login
        response = client.post("/api/auth/login", json={
            "email": "admin@example.com",
            "senha": "AdminPass123!"
        })
        token = response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        return client, empresa_id

    def test_create_contato_and_list_by_empresa(self, setup_with_empresa):
        """Test: Create contato → List by empresa → 200"""
        client, empresa_id = setup_with_empresa

        # Create contato
        response = client.post("/api/contatos", json={
            "nome": "Contact Person",
            "email": "contact@example.com",
            "telefone": "11988888888",
            "cargo": "Manager",
            "empresa_id": str(empresa_id)
        })
        assert response.status_code == 201
        assert response.json()["nome"] == "Contact Person"

        # List contatos by empresa
        response = client.get(f"/api/contatos?empresa_id={empresa_id}")
        assert response.status_code == 200
        assert len(response.json()) > 0


class TestCategoriasFlow:
    """Tests for category operations."""

    @pytest.fixture
    def authenticated_client_and_user(self, db, client):
        """Create authenticated client."""
        from app.models.usuario import Usuario
        from app.security import hash_password

        user_id = uuid4()
        usuario = Usuario(
            id=user_id,
            nome="Admin User",
            email="admin@example.com",
            senha_hash=hash_password("AdminPass123!"),
            role="admin",
            ativo=True
        )
        db.add(usuario)
        db.commit()

        response = client.post("/api/auth/login", json={
            "email": "admin@example.com",
            "senha": "AdminPass123!"
        })
        token = response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}
        return client, user_id

    def test_create_categoria_and_list(self, authenticated_client_and_user):
        """Test: Create categoria → List → 200"""
        client, _ = authenticated_client_and_user

        # Create categoria
        response = client.post("/api/categorias", json={
            "nome": "Bug",
            "descricao": "Bug report category"
        })
        assert response.status_code == 201
        categoria_data = response.json()
        assert categoria_data["nome"] == "Bug"
        categoria_id = categoria_data["id"]

        # List categorias
        response = client.get("/api/categorias")
        assert response.status_code == 200
        assert len(response.json()) > 0
        assert any(c["id"] == categoria_id for c in response.json())


class TestTicketsFlow:
    """Tests for ticket operations and status management."""

    @pytest.fixture
    def setup_complete(self, db, client):
        """Setup with user, empresa, contato, categoria, and authenticated client."""
        from app.models.usuario import Usuario
        from app.models.empresa import Empresa
        from app.models.categoria import CategoriaServico
        from app.models.contato import Contato
        from app.security import hash_password

        user_id = uuid4()
        empresa_id = uuid4()
        categoria_id = uuid4()
        contato_id = uuid4()

        usuario = Usuario(
            id=user_id,
            nome="Admin User",
            email="admin@example.com",
            senha_hash=hash_password("AdminPass123!"),
            role="admin",
            ativo=True
        )

        empresa = Empresa(
            id=empresa_id,
            nome="Test Company",
            cnpj="12345678000190",
            endereco="Rua Test, 123"
        )

        categoria = CategoriaServico(
            id=categoria_id,
            nome="Bug",
            descricao="Bug report"
        )

        contato = Contato(
            id=contato_id,
            nome="John Doe",
            email="john@example.com",
            telefone="11999999999",
            cargo="Manager",
            empresa_id=empresa_id
        )

        db.add(usuario)
        db.add(empresa)
        db.add(categoria)
        db.add(contato)
        db.commit()

        response = client.post("/api/auth/login", json={
            "email": "admin@example.com",
            "senha": "AdminPass123!"
        })
        token = response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        return client, empresa_id, categoria_id, user_id, contato_id

    def test_create_ticket_and_list(self, setup_complete):
        """Test: Create ticket → List → 200"""
        client, empresa_id, categoria_id, user_id, contato_id = setup_complete

        # Create ticket
        response = client.post("/api/tickets", json={
            "titulo": "Test Ticket Description",
            "descricao": "This is a test description with enough length",
            "empresa_id": str(empresa_id),
            "categoria_id": str(categoria_id),
            "contato_id": str(contato_id)
        })
        assert response.status_code == 201
        ticket_data = response.json()
        assert ticket_data["titulo"] == "Test Ticket Description"
        ticket_id = ticket_data["id"]

        # List tickets
        response = client.get("/api/tickets")
        assert response.status_code == 200
        assert len(response.json()) > 0
        assert any(t["id"] == ticket_id for t in response.json())

    def test_update_ticket_status(self, setup_complete):
        """Test: Update ticket status → 200"""
        client, empresa_id, categoria_id, user_id, contato_id = setup_complete

        # Create ticket
        response = client.post("/api/tickets", json={
            "titulo": "Test Ticket Description",
            "descricao": "This is a test description with enough length",
            "empresa_id": str(empresa_id),
            "categoria_id": str(categoria_id),
            "contato_id": str(contato_id)
        })
        ticket_id = response.json()["id"]

        # Update status to em_andamento using PATCH /api/tickets/{id}/status
        response = client.patch(f"/api/tickets/{ticket_id}/status?status=em_andamento")
        assert response.status_code == 200
        assert response.json()["status"] == "em_andamento"

        # Update status to fechado
        response = client.patch(f"/api/tickets/{ticket_id}/status?status=fechado")
        assert response.status_code == 200
        assert response.json()["status"] == "fechado"

    def test_close_ticket(self, setup_complete):
        """Test: Close ticket → 200"""
        client, empresa_id, categoria_id, user_id, contato_id = setup_complete

        # Create ticket
        response = client.post("/api/tickets", json={
            "titulo": "Test Ticket Description",
            "descricao": "This is a test description with enough length",
            "empresa_id": str(empresa_id),
            "categoria_id": str(categoria_id),
            "contato_id": str(contato_id)
        })
        ticket_id = response.json()["id"]

        # Close ticket with solution
        response = client.post(f"/api/tickets/{ticket_id}/fechar", json={
            "solucao_descricao": "Fixed the issue by restarting the service with detail",
            "tempo_gasto_horas": 2.5
        })
        assert response.status_code == 200
        assert response.json()["status"] == "fechado"

    def test_delete_ticket_soft_delete(self, setup_complete):
        """Test: Delete ticket (soft) → 204 and no longer listed"""
        client, empresa_id, categoria_id, user_id, contato_id = setup_complete

        response = client.post("/api/tickets", json={
            "titulo": "Ticket to delete",
            "descricao": "This ticket should be soft deleted and hidden from list",
            "empresa_id": str(empresa_id),
            "categoria_id": str(categoria_id),
            "contato_id": str(contato_id)
        })
        assert response.status_code == 201
        ticket_id = response.json()["id"]

        response = client.delete(f"/api/tickets/{ticket_id}")
        assert response.status_code == 204

        response = client.get("/api/tickets")
        assert response.status_code == 200
        assert all(t["id"] != ticket_id for t in response.json())

    def test_delete_empresa_soft_delete_ticket_still_accessible(self, setup_complete):
        """Test: Delete empresa (soft) → ticket still accessible"""
        client, empresa_id, categoria_id, user_id, contato_id = setup_complete

        # Create ticket
        response = client.post("/api/tickets", json={
            "titulo": "Test Ticket Description",
            "descricao": "This is a test description with enough length",
            "empresa_id": str(empresa_id),
            "categoria_id": str(categoria_id),
            "contato_id": str(contato_id)
        })
        ticket_id = response.json()["id"]

        # Delete empresa (soft delete)
        response = client.delete(f"/api/empresas/{empresa_id}")
        assert response.status_code in [200, 204]

        # Ticket should still be accessible
        response = client.get(f"/api/tickets/{ticket_id}")
        assert response.status_code == 200
        assert response.json()["id"] == ticket_id


class TestUnauthorizedAccess:
    """Tests for authorization and authentication."""

    def test_access_without_token_returns_403(self, client):
        """Test that protected endpoints require token."""
        response = client.get("/api/empresas")
        assert response.status_code in [401, 403]

    def test_invalid_token_returns_401(self, client):
        """Test that invalid token is rejected."""
        client.headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/empresas")
        assert response.status_code in [401, 403]


class TestCompleteE2EFlow:
    """Complete end-to-end workflow test."""

    def test_complete_workflow(self, db, client):
        """Test complete workflow: user → login → empresa → contato → categoria → ticket."""
        from app.models.usuario import Usuario
        from app.models.empresa import Empresa
        from app.models.categoria import CategoriaServico
        from app.models.contato import Contato
        from app.security import hash_password

        # 1. Setup user
        user_id = uuid4()
        usuario = Usuario(
            id=user_id,
            nome="Admin User",
            email="admin@example.com",
            senha_hash=hash_password("AdminPass123!"),
            role="admin",
            ativo=True
        )
        db.add(usuario)
        db.commit()

        # 2. Login
        response = client.post("/api/auth/login", json={
            "email": "admin@example.com",
            "senha": "AdminPass123!"
        })
        assert response.status_code == 200
        token = response.json()["access_token"]
        client.headers = {"Authorization": f"Bearer {token}"}

        # 3. Create empresa
        response = client.post("/api/empresas", json={
            "nome": "Test Company",
            "cnpj": "12345678000190",
            "endereco": "Rua Test, 123"
        })
        assert response.status_code == 201
        empresa_id = response.json()["id"]

        # 4. List empresas
        response = client.get("/api/empresas")
        assert response.status_code == 200
        assert len(response.json()) > 0

        # 5. Create contato
        response = client.post("/api/contatos", json={
            "nome": "John Doe",
            "email": "john@example.com",
            "telefone": "11999999999",
            "cargo": "Manager",
            "empresa_id": str(empresa_id)
        })
        assert response.status_code == 201
        contato_id = response.json()["id"]

        # 6. List contatos
        response = client.get(f"/api/contatos?empresa_id={empresa_id}")
        assert response.status_code == 200
        assert len(response.json()) > 0

        # 7. Create categoria
        response = client.post("/api/categorias", json={
            "nome": "Bug",
            "descricao": "Bug report"
        })
        assert response.status_code == 201
        categoria_id = response.json()["id"]

        # 8. List categorias
        response = client.get("/api/categorias")
        assert response.status_code == 200
        assert len(response.json()) > 0

        # 9. Create ticket
        response = client.post("/api/tickets", json={
            "titulo": "Critical Bug Description",
            "descricao": "System crashes on login with specific error message",
            "empresa_id": str(empresa_id),
            "categoria_id": str(categoria_id),
            "contato_id": str(contato_id)
        })
        assert response.status_code == 201
        ticket_id = response.json()["id"]

        # 10. List tickets
        response = client.get("/api/tickets")
        assert response.status_code == 200
        assert len(response.json()) > 0

        # 11. Update ticket status to em_andamento
        response = client.patch(f"/api/tickets/{ticket_id}/status?status=em_andamento")
        assert response.status_code == 200
        assert response.json()["status"] == "em_andamento"

        # 12. Update ticket status to fechado
        response = client.patch(f"/api/tickets/{ticket_id}/status?status=fechado")
        assert response.status_code == 200
        assert response.json()["status"] == "fechado"

        # 13. Verify soft delete
        response = client.delete(f"/api/empresas/{empresa_id}")
        assert response.status_code in [200, 204]

        # Ticket should still be accessible
        response = client.get(f"/api/tickets/{ticket_id}")
        assert response.status_code == 200

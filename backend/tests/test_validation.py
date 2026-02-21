"""
Test validation for all Pydantic schemas
"""
import pytest
from uuid import UUID, uuid4
from pydantic import ValidationError

from app.schemas.empresa import EmpresaCreate, EmpresaUpdate
from app.schemas.contato import ContatoCreate, ContatoUpdate
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketClose
from app.schemas.usuario import UsuarioLogin


class TestEmpresaValidation:
    """Test EmpresaCreate and EmpresaUpdate validation"""

    def test_empresa_create_valid(self):
        """Test creating valid empresa"""
        data = {
            "nome": "Tech Company",
            "cnpj": "12.345.678/0001-99",
            "email": "contact@tech.com",
            "telefone": "(11) 98765-4321",
            "endereco": "Rua Principal, 123, São Paulo, SP"
        }
        empresa = EmpresaCreate(**data)
        assert empresa.nome == "Tech Company"
        assert empresa.email == "contact@tech.com"

    def test_empresa_create_nome_required(self):
        """Test nome is required"""
        with pytest.raises(ValidationError) as exc_info:
            EmpresaCreate(nome="", email="test@test.com")
        assert "at least 3 characters" in str(exc_info.value).lower() or "name should have" in str(exc_info.value).lower()

    def test_empresa_create_nome_min_length(self):
        """Test nome min length constraint"""
        with pytest.raises(ValidationError) as exc_info:
            EmpresaCreate(nome="AB", email="test@test.com")
        assert "at least 3 characters" in str(exc_info.value).lower()

    def test_empresa_create_email_invalid(self):
        """Test invalid email format"""
        with pytest.raises(ValidationError) as exc_info:
            EmpresaCreate(nome="Valid Company", email="invalid-email")
        assert "email" in str(exc_info.value).lower()

    def test_empresa_create_cnpj_valid_formats(self):
        """Test valid CNPJ formats"""
        # Formato com pontuação
        empresa1 = EmpresaCreate(nome="Company 1", cnpj="12.345.678/0001-99")
        assert empresa1.cnpj == "12.345.678/0001-99"

        # Formato sem pontuação
        empresa2 = EmpresaCreate(nome="Company 2", cnpj="12345678000199")
        assert empresa2.cnpj == "12345678000199"

    def test_empresa_create_telefone_invalid(self):
        """Test invalid telefone format"""
        with pytest.raises(ValidationError) as exc_info:
            EmpresaCreate(nome="Valid Company", telefone="invalid")
        assert "telefone" in str(exc_info.value).lower() or "pattern" in str(exc_info.value).lower()

    def test_empresa_update_nome_validator(self):
        """Test nome validator in update"""
        with pytest.raises(ValidationError):
            EmpresaUpdate(nome="  ")  # Just whitespace

    def test_empresa_create_endereco_max_length(self):
        """Test endereco max length constraint"""
        long_endereco = "A" * 600
        with pytest.raises(ValidationError) as exc_info:
            EmpresaCreate(nome="Valid Company", endereco=long_endereco)
        assert "at most 500 characters" in str(exc_info.value).lower() or "500" in str(exc_info.value)


class TestContatoValidation:
    """Test ContatoCreate and ContatoUpdate validation"""

    def test_contato_create_valid(self):
        """Test creating valid contato"""
        empresa_id = uuid4()
        data = {
            "empresa_id": empresa_id,
            "nome": "João Silva",
            "email": "joao@empresa.com",
            "telefone": "(11) 98765-4321",
            "cargo": "Gerente de TI",
            "departamento": "Tecnologia",
            "principal": True
        }
        contato = ContatoCreate(**data)
        assert contato.nome == "João Silva"
        assert contato.cargo == "Gerente de TI"

    def test_contato_create_nome_required(self):
        """Test nome is required"""
        empresa_id = uuid4()
        with pytest.raises(ValidationError) as exc_info:
            ContatoCreate(empresa_id=empresa_id, nome="", email="test@test.com")
        assert "at least 3 characters" in str(exc_info.value).lower()

    def test_contato_create_email_invalid(self):
        """Test invalid email format"""
        empresa_id = uuid4()
        with pytest.raises(ValidationError) as exc_info:
            ContatoCreate(empresa_id=empresa_id, nome="Valid Contact", email="invalid-email")
        assert "email" in str(exc_info.value).lower()

    def test_contato_create_telefone_invalid(self):
        """Test invalid telefone format"""
        empresa_id = uuid4()
        with pytest.raises(ValidationError) as exc_info:
            ContatoCreate(empresa_id=empresa_id, nome="Valid Contact", telefone="invalid")
        assert "telefone" in str(exc_info.value).lower() or "pattern" in str(exc_info.value).lower()

    def test_contato_create_whitespace_handling(self):
        """Test whitespace stripping in fields"""
        empresa_id = uuid4()
        contato = ContatoCreate(
            empresa_id=empresa_id,
            nome="  João Silva  ",
            cargo="  Gerente  "
        )
        assert contato.nome == "João Silva"
        assert contato.cargo == "Gerente"

    def test_contato_update_nome_validator(self):
        """Test nome validator in update"""
        with pytest.raises(ValidationError):
            ContatoUpdate(nome="  ")  # Just whitespace


class TestTicketValidation:
    """Test TicketCreate, TicketUpdate and TicketClose validation"""

    def test_ticket_create_valid(self):
        """Test creating valid ticket"""
        empresa_id = uuid4()
        contato_id = uuid4()
        categoria_id = uuid4()
        data = {
            "empresa_id": empresa_id,
            "contato_id": contato_id,
            "categoria_id": categoria_id,
            "titulo": "Sistema não conecta à rede",
            "descricao": "O computador da sala 101 não consegue se conectar à rede da empresa"
        }
        ticket = TicketCreate(**data)
        assert ticket.titulo == "Sistema não conecta à rede"

    def test_ticket_create_titulo_min_length(self):
        """Test titulo min length constraint"""
        empresa_id = uuid4()
        contato_id = uuid4()
        categoria_id = uuid4()
        with pytest.raises(ValidationError) as exc_info:
            TicketCreate(
                empresa_id=empresa_id,
                contato_id=contato_id,
                categoria_id=categoria_id,
                titulo="Erro",
                descricao="Description is long enough to pass validation"
            )
        assert "at least 5 characters" in str(exc_info.value).lower()

    def test_ticket_create_descricao_min_length(self):
        """Test descricao min length constraint"""
        empresa_id = uuid4()
        contato_id = uuid4()
        categoria_id = uuid4()
        with pytest.raises(ValidationError) as exc_info:
            TicketCreate(
                empresa_id=empresa_id,
                contato_id=contato_id,
                categoria_id=categoria_id,
                titulo="Valid Title",
                descricao="Short"
            )
        assert "at least 10 characters" in str(exc_info.value).lower()

    def test_ticket_update_status_enum(self):
        """Test status must be valid value"""
        with pytest.raises(ValidationError) as exc_info:
            TicketUpdate(status="invalid_status")
        assert "pattern" in str(exc_info.value).lower() or "status" in str(exc_info.value).lower()

    def test_ticket_update_status_valid_values(self):
        """Test valid status values"""
        for status in ["aberto", "em_andamento", "resolvido", "fechado"]:
            ticket = TicketUpdate(status=status)
            assert ticket.status == status

    def test_ticket_close_solucao_min_length(self):
        """Test solucao_descricao min length constraint"""
        with pytest.raises(ValidationError) as exc_info:
            TicketClose(solucao_descricao="Short")
        assert "at least 10 characters" in str(exc_info.value).lower()

    def test_ticket_close_tempo_gasto_positive(self):
        """Test tempo_gasto_horas must be positive"""
        with pytest.raises(ValidationError) as exc_info:
            TicketClose(
                solucao_descricao="This is a valid solution description",
                tempo_gasto_horas=-1
            )
        assert "greater than 0" in str(exc_info.value).lower()

    def test_ticket_close_valid(self):
        """Test creating valid ticket close"""
        close = TicketClose(
            solucao_descricao="Problema resolvido reinstalando drivers",
            tempo_gasto_horas=2.5
        )
        assert close.tempo_gasto_horas == 2.5


class TestUsuarioValidation:
    """Test UsuarioLogin validation"""

    def test_usuario_login_valid(self):
        """Test creating valid login"""
        login = UsuarioLogin(email="user@example.com", senha="password123")
        assert login.email == "user@example.com"
        assert login.senha == "password123"

    def test_usuario_login_email_required(self):
        """Test email is required"""
        with pytest.raises(ValidationError):
            UsuarioLogin(email="", senha="password123")

    def test_usuario_login_email_invalid(self):
        """Test invalid email format"""
        with pytest.raises(ValidationError) as exc_info:
            UsuarioLogin(email="invalid-email", senha="password123")
        assert "email" in str(exc_info.value).lower()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

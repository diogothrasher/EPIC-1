# Design Técnico - EPIC-1: MVP Tickets e Estrutura Base

**Versão:** 1.0
**Data:** 21 de Fevereiro de 2026
**Architect:** Aria (Visionary)
**Status:** ✅ Pronto para Implementação

---

## 1. ARQUITETURA DE SISTEMA - VISÃO GERAL

### 1.1 Stack Técnico Finalizado

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│  React 18 + TypeScript + Tailwind CSS (Dark Mode Nativa)       │
│  State: Zustand/React Query                                    │
│  HTTP Client: Axios com interceptadores                        │
│  UI Components: Headless UI + Tailwind                         │
└────────────────────┬────────────────────────────────────────────┘
                     │ REST API (JSON)
┌────────────────────▼────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                             │
│  FastAPI 0.100+                                                │
│  Python 3.10+                                                   │
│  ORM: SQLAlchemy 2.0                                           │
│  Auth: JWT (PyJWT + python-jose)                              │
│  Validation: Pydantic v2                                       │
│  Database Driver: psycopg[binary]                              │
│  Migrations: Alembic                                           │
│  Logging: Structured logging (stdlib)                          │
│  Testing: pytest + httpx                                       │
└────────────────────┬────────────────────────────────────────────┘
                     │ SQLAlchemy ORM
┌────────────────────▼────────────────────────────────────────────┐
│              DATABASE (PostgreSQL 15+)                          │
│  Tables: usuarios, empresas, contatos, tickets, etc            │
│  Migrations: Alembic versionado                                │
│  Indices: Otimizados para queries comuns                       │
│  Soft Deletes: Coluna 'ativo' em todas as tabelas             │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Fluxo de Requisição

```
1. User action (React)
   ↓
2. API call (axios + auth header)
   ↓
3. FastAPI middleware (auth, CORS, logging)
   ↓
4. Route handler (dependency injection)
   ↓
5. Service layer (business logic)
   ↓
6. Database query (SQLAlchemy)
   ↓
7. Response (Pydantic schema)
   ↓
8. Frontend (React Query cache + state update)
```

---

## 2. BANCO DE DADOS - MIGRAÇÕES ALEMBIC

### 2.1 Estrutura de Migrations

```
backend/migrations/
├── alembic.ini
├── env.py
├── script.py.template
└── versions/
    ├── 001_create_usuarios_table.py
    ├── 002_create_empresas_table.py
    ├── 003_create_contatos_table.py
    ├── 004_create_categorias_servico_table.py
    ├── 005_create_tickets_table.py
    ├── 006_create_indices.py
    └── 007_add_seed_data.py
```

### 2.2 Migration #001: Tabela `usuarios`

```python
# migration 001_create_usuarios_table.py
def upgrade():
    op.create_table(
        'usuarios',
        sa.Column('id', sa.UUID, primary_key=True, default=uuid4),
        sa.Column('email', sa.VARCHAR(255), unique=True, nullable=False, index=True),
        sa.Column('senha_hash', sa.VARCHAR(255), nullable=False),
        sa.Column('nome', sa.VARCHAR(255), nullable=False),
        sa.Column('role', sa.VARCHAR(20), nullable=False, default='tecnico'),
        sa.Column('ativo', sa.Boolean, nullable=False, default=True, index=True),
        sa.Column('data_criacao', sa.DateTime, default=datetime.utcnow),
        sa.Column('data_atualizacao', sa.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow),
        sa.Column('ultimo_acesso', sa.DateTime, nullable=True),
        sa.CheckConstraint("role IN ('admin', 'tecnico')"),
    )

def downgrade():
    op.drop_table('usuarios')
```

### 2.3 Migration #002: Tabela `empresas`

```python
def upgrade():
    op.create_table(
        'empresas',
        sa.Column('id', sa.UUID, primary_key=True, default=uuid4),
        sa.Column('nome', sa.VARCHAR(255), nullable=False),
        sa.Column('cnpj', sa.VARCHAR(18), unique=True, nullable=True),
        sa.Column('telefone', sa.VARCHAR(20), nullable=True),
        sa.Column('email', sa.VARCHAR(255), nullable=True),
        sa.Column('endereco', sa.TEXT, nullable=True),
        sa.Column('contato_principal_id', sa.UUID, nullable=True),
        sa.Column('ativo', sa.Boolean, nullable=False, default=True, index=True),
        sa.Column('data_criacao', sa.DateTime, default=datetime.utcnow),
        sa.Column('data_atualizacao', sa.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow),
        sa.Index('idx_empresas_nome', 'nome'),
        sa.Index('idx_empresas_ativo', 'ativo'),
    )
```

**Nota:** `contato_principal_id` será populado após criar contatos (migration #003)

### 2.4 Migration #003: Tabela `contatos`

```python
def upgrade():
    op.create_table(
        'contatos',
        sa.Column('id', sa.UUID, primary_key=True, default=uuid4),
        sa.Column('empresa_id', sa.UUID, nullable=False),
        sa.Column('nome', sa.VARCHAR(255), nullable=False),
        sa.Column('email', sa.VARCHAR(255), nullable=True),
        sa.Column('telefone', sa.VARCHAR(20), nullable=True),
        sa.Column('cargo', sa.VARCHAR(100), nullable=True),
        sa.Column('departamento', sa.VARCHAR(100), nullable=True),
        sa.Column('principal', sa.Boolean, nullable=False, default=False, index=True),
        sa.Column('ativo', sa.Boolean, nullable=False, default=True, index=True),
        sa.Column('data_criacao', sa.DateTime, default=datetime.utcnow),
        sa.Column('data_atualizacao', sa.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow),
        sa.ForeignKeyConstraint(['empresa_id'], ['empresas.id'], ondelete='CASCADE'),
    )

# Depois adicionar FK em empresas para contato_principal_id
def upgrade_2():
    op.add_column('empresas', sa.Column('contato_principal_id', sa.UUID, nullable=True))
    op.create_foreign_key(
        'fk_empresas_contato_principal',
        'empresas', 'contatos',
        ['contato_principal_id'], ['id'],
        ondelete='SET NULL'
    )
```

### 2.5 Migration #004: Tabela `categorias_servico`

```python
def upgrade():
    op.create_table(
        'categorias_servico',
        sa.Column('id', sa.UUID, primary_key=True, default=uuid4),
        sa.Column('nome', sa.VARCHAR(100), unique=True, nullable=False),
        sa.Column('descricao', sa.TEXT, nullable=True),
        sa.Column('cor_tag', sa.VARCHAR(7), nullable=False, default='#3B82F6'),
        sa.Column('icone', sa.VARCHAR(50), nullable=True),
        sa.Column('ordem', sa.Integer, nullable=False, default=0, index=True),
        sa.Column('ativo', sa.Boolean, nullable=False, default=True, index=True),
        sa.Column('data_criacao', sa.DateTime, default=datetime.utcnow),
    )
```

### 2.6 Migration #005: Tabela `tickets` (CORE)

```python
def upgrade():
    op.create_table(
        'tickets',
        sa.Column('id', sa.UUID, primary_key=True, default=uuid4),
        sa.Column('numero', sa.VARCHAR(20), unique=True, nullable=False),
        sa.Column('empresa_id', sa.UUID, nullable=False),
        sa.Column('contato_id', sa.UUID, nullable=False),
        sa.Column('categoria_id', sa.UUID, nullable=False),
        sa.Column('problema_id', sa.UUID, nullable=True),
        sa.Column('titulo', sa.VARCHAR(255), nullable=False),
        sa.Column('descricao', sa.TEXT, nullable=False),
        sa.Column('status', sa.VARCHAR(20), nullable=False, default='aberto'),
        sa.Column('solucao_descricao', sa.TEXT, nullable=True),
        sa.Column('tempo_gasto_horas', sa.Numeric(5,2), nullable=True),
        sa.Column('data_criacao', sa.DateTime, default=datetime.utcnow),
        sa.Column('data_atualizacao', sa.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow),
        sa.Column('data_fechamento', sa.DateTime, nullable=True),
        sa.Column('ativo', sa.Boolean, nullable=False, default=True),

        # Foreign Keys
        sa.ForeignKeyConstraint(['empresa_id'], ['empresas.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['contato_id'], ['contatos.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['categoria_id'], ['categorias_servico.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['problema_id'], ['problemas.id'], ondelete='SET NULL'),

        # Indices
        sa.Index('idx_tickets_numero', 'numero'),
        sa.Index('idx_tickets_empresa_id', 'empresa_id'),
        sa.Index('idx_tickets_status', 'status'),
        sa.Index('idx_tickets_data_criacao', 'data_criacao'),
        sa.Index('idx_tickets_empresa_status', 'empresa_id', 'status'),
    )
```

### 2.7 Migration #007: Seed Data

```python
def upgrade():
    # Inserir categorias padrão
    conn = op.get_bind()
    conn.execute("""
        INSERT INTO categorias_servico (nome, icone, ordem, ativo)
        VALUES
        ('Hardware', 'HardDrive', 1, true),
        ('Software', 'Code', 2, true),
        ('Rede', 'Wifi', 3, true),
        ('Manutenção Preventiva', 'Settings', 4, true),
        ('Consultoria', 'Users', 5, true),
        ('Instalação', 'Package', 6, true),
        ('Suporte Remoto', 'Monitor', 7, true),
        ('Outra', 'MoreHorizontal', 8, true);
    """)

    # Inserir usuário admin padrão (será gerado/customizado na primeira execução)
    # senha será gerada durante setup
```

---

## 3. BACKEND - MODELOS SQLALCHEMY

### 3.1 Estrutura de Arquivos

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py (FastAPI app)
│   ├── config.py (config settings)
│   ├── database.py (DB connection)
│   ├── security.py (JWT, password hashing)
│   ├── models/
│   │   ├── __init__.py
│   │   ├── usuario.py
│   │   ├── empresa.py
│   │   ├── contato.py
│   │   ├── categoria.py
│   │   ├── ticket.py
│   │   └── base.py (Base model)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── usuario.py
│   │   ├── empresa.py
│   │   ├── contato.py
│   │   ├── categoria.py
│   │   ├── ticket.py
│   │   └── common.py (Error, Pagination)
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── usuarios.py
│   │   ├── empresas.py
│   │   ├── contatos.py
│   │   ├── categorias.py
│   │   ├── tickets.py
│   │   └── health.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ticket_service.py
│   │   ├── usuario_service.py
│   │   └── auth_service.py
│   ├── dependencies.py (DI container)
│   └── utils.py
├── requirements.txt
├── Dockerfile
└── .dockerignore
```

### 3.2 Base Model

```python
# app/models/base.py
from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import Column, DateTime, UUID as SQLA_UUID, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class BaseModel(Base):
    """Base model com campos comuns"""
    __abstract__ = True

    id: UUID = Column(SQLA_UUID(as_uuid=True), primary_key=True, default=uuid4)
    ativo: bool = Column(Boolean, default=True, index=True)
    data_criacao: datetime = Column(DateTime(timezone=True), server_default=func.now())
    data_atualizacao: datetime = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
```

### 3.3 Model: Usuario

```python
# app/models/usuario.py
from sqlalchemy import Column, String, Enum as SQLEnum
from .base import BaseModel

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    email: str = Column(String(255), unique=True, nullable=False, index=True)
    senha_hash: str = Column(String(255), nullable=False)
    nome: str = Column(String(255), nullable=False)
    role: str = Column(
        SQLEnum('admin', 'tecnico', name='role_enum'),
        nullable=False,
        default='tecnico'
    )
    ultimo_acesso: Optional[datetime] = Column(DateTime(timezone=True), nullable=True)
```

### 3.4 Model: Empresa

```python
# app/models/empresa.py
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Empresa(BaseModel):
    __tablename__ = "empresas"

    nome: str = Column(String(255), nullable=False)
    cnpj: Optional[str] = Column(String(18), unique=True, nullable=True)
    telefone: Optional[str] = Column(String(20), nullable=True)
    email: Optional[str] = Column(String(255), nullable=True)
    endereco: Optional[str] = Column(String(500), nullable=True)
    contato_principal_id: Optional[UUID] = Column(SQLA_UUID, ForeignKey('contatos.id', ondelete='SET NULL'), nullable=True)

    # Relationships
    contatos = relationship('Contato', back_populates='empresa', cascade='all, delete-orphan')
    tickets = relationship('Ticket', back_populates='empresa', cascade='all, delete-orphan')
```

### 3.5 Model: Contato

```python
# app/models/contato.py
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Contato(BaseModel):
    __tablename__ = "contatos"

    empresa_id: UUID = Column(SQLA_UUID, ForeignKey('empresas.id', ondelete='CASCADE'), nullable=False, index=True)
    nome: str = Column(String(255), nullable=False)
    email: Optional[str] = Column(String(255), nullable=True)
    telefone: Optional[str] = Column(String(20), nullable=True)
    cargo: Optional[str] = Column(String(100), nullable=True)
    departamento: Optional[str] = Column(String(100), nullable=True)
    principal: bool = Column(Boolean, default=False, index=True)

    # Relationships
    empresa = relationship('Empresa', back_populates='contatos')
    tickets = relationship('Ticket', back_populates='contato')
```

### 3.6 Model: Categoria

```python
# app/models/categoria.py
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel

class CategoriaServico(BaseModel):
    __tablename__ = "categorias_servico"

    nome: str = Column(String(100), unique=True, nullable=False)
    descricao: Optional[str] = Column(String(500), nullable=True)
    cor_tag: str = Column(String(7), default='#3B82F6')
    icone: Optional[str] = Column(String(50), nullable=True)
    ordem: int = Column(Integer, default=0, index=True)

    # Relationships
    tickets = relationship('Ticket', back_populates='categoria')
```

### 3.7 Model: Ticket (CORE)

```python
# app/models/ticket.py
from sqlalchemy import Column, String, Text, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from .base import BaseModel

class Ticket(BaseModel):
    __tablename__ = "tickets"

    numero: str = Column(String(20), unique=True, nullable=False, index=True)
    empresa_id: UUID = Column(SQLA_UUID, ForeignKey('empresas.id', ondelete='RESTRICT'), nullable=False, index=True)
    contato_id: UUID = Column(SQLA_UUID, ForeignKey('contatos.id', ondelete='RESTRICT'), nullable=False)
    categoria_id: UUID = Column(SQLA_UUID, ForeignKey('categorias_servico.id', ondelete='RESTRICT'), nullable=False)
    problema_id: Optional[UUID] = Column(SQLA_UUID, ForeignKey('problemas.id', ondelete='SET NULL'), nullable=True)

    titulo: str = Column(String(255), nullable=False)
    descricao: str = Column(Text, nullable=False)
    status: str = Column(
        SQLEnum('aberto', 'em_andamento', 'resolvido', 'fechado', name='status_enum'),
        default='aberto',
        index=True
    )
    solucao_descricao: Optional[str] = Column(Text, nullable=True)
    tempo_gasto_horas: Optional[Numeric(5,2)] = Column(Numeric(5,2), nullable=True)
    data_fechamento: Optional[datetime] = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    empresa = relationship('Empresa', back_populates='tickets')
    contato = relationship('Contato', back_populates='tickets')
    categoria = relationship('CategoriaServico', back_populates='tickets')
```

---

## 4. BACKEND - SCHEMAS PYDANTIC

### 4.1 Schema: UsuarioLogin

```python
# app/schemas/usuario.py
from pydantic import BaseModel, EmailStr, Field

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str = Field(..., min_length=6)

class UsuarioResponse(BaseModel):
    id: UUID
    email: str
    nome: str
    role: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse
```

### 4.2 Schema: Empresa

```python
# app/schemas/empresa.py
from pydantic import BaseModel
from typing import Optional

class EmpresaCreate(BaseModel):
    nome: str = Field(..., min_length=1, max_length=255)
    cnpj: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None

class EmpresaUpdate(BaseModel):
    nome: Optional[str] = None
    cnpj: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None

class EmpresaResponse(BaseModel):
    id: UUID
    nome: str
    cnpj: Optional[str]
    telefone: Optional[str]
    email: Optional[str]
    contato_principal_id: Optional[UUID]
    ativo: bool
    data_criacao: datetime

    class Config:
        from_attributes = True
```

### 4.3 Schema: Contato

```python
# app/schemas/contato.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class ContatoCreate(BaseModel):
    empresa_id: UUID
    nome: str = Field(..., min_length=1)
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    cargo: Optional[str] = None
    departamento: Optional[str] = None
    principal: bool = False

class ContatoResponse(BaseModel):
    id: UUID
    empresa_id: UUID
    nome: str
    email: Optional[str]
    telefone: Optional[str]
    cargo: Optional[str]
    principal: bool
    ativo: bool

    class Config:
        from_attributes = True
```

### 4.4 Schema: Ticket

```python
# app/schemas/ticket.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    empresa_id: UUID
    contato_id: UUID
    categoria_id: UUID
    problema_id: Optional[UUID] = None
    titulo: str = Field(..., min_length=5, max_length=255)
    descricao: str = Field(..., min_length=10)

class TicketUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    categoria_id: Optional[UUID] = None
    status: Optional[str] = None  # 'aberto', 'em_andamento', 'resolvido', 'fechado'

class TicketClose(BaseModel):
    solucao_descricao: str = Field(..., min_length=10)
    tempo_gasto_horas: Optional[float] = None

class TicketResponse(BaseModel):
    id: UUID
    numero: str
    empresa_id: UUID
    contato_id: UUID
    categoria_id: UUID
    titulo: str
    descricao: str
    status: str
    solucao_descricao: Optional[str]
    tempo_gasto_horas: Optional[float]
    data_criacao: datetime
    data_atualizacao: datetime
    data_fechamento: Optional[datetime]

    class Config:
        from_attributes = True
```

---

## 5. BACKEND - ENDPOINTS FASTAPI

### 5.1 Endpoint: Authentication

```python
# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login(
    credenciais: UsuarioLogin,
    db: Session = Depends(get_db)
):
    """
    Login de usuário

    - email: Email do usuário
    - senha: Senha (será hasheada com bcrypt)

    Retorna JWT token + dados do usuário
    """
    usuario = db.query(Usuario).filter(Usuario.email == credenciais.email).first()

    if not usuario or not verificar_senha(credenciais.senha, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha inválidos"
        )

    token = criar_token_acesso(usuario.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": UsuarioResponse.from_orm(usuario)
    }

@router.get("/me", response_model=UsuarioResponse)
async def obter_usuario_atual(
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """Obter dados do usuário autenticado"""
    return usuario_atual
```

### 5.2 Endpoint: Empresas (CRUD)

```python
# app/routers/empresas.py
@router.get("/api/empresas", response_model=List[EmpresaResponse])
async def listar_empresas(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_atual)
):
    """
    Listar todas as empresas ativas

    - skip: Paginação (padrão 0)
    - limit: Quantidade por página (padrão 10, máx 100)
    """
    empresas = db.query(Empresa)\
        .filter(Empresa.ativo == True)\
        .offset(skip)\
        .limit(limit)\
        .all()

    return empresas

@router.post("/api/empresas", response_model=EmpresaResponse, status_code=201)
async def criar_empresa(
    empresa: EmpresaCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_admin)
):
    """
    Criar nova empresa (apenas Admin)
    """
    nova_empresa = Empresa(**empresa.dict())
    db.add(nova_empresa)
    db.commit()
    db.refresh(nova_empresa)
    return nova_empresa

@router.get("/api/empresas/{empresa_id}", response_model=EmpresaResponse)
async def obter_empresa(
    empresa_id: UUID,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_atual)
):
    """Obter detalhes de uma empresa"""
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa

@router.put("/api/empresas/{empresa_id}", response_model=EmpresaResponse)
async def atualizar_empresa(
    empresa_id: UUID,
    empresa_update: EmpresaUpdate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_admin)
):
    """Atualizar empresa (apenas Admin)"""
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")

    for campo, valor in empresa_update.dict(exclude_unset=True).items():
        setattr(empresa, campo, valor)

    db.commit()
    db.refresh(empresa)
    return empresa

@router.delete("/api/empresas/{empresa_id}", status_code=204)
async def deletar_empresa(
    empresa_id: UUID,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_admin)
):
    """Soft delete de empresa (apenas Admin)"""
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")

    empresa.ativo = False
    db.commit()
```

### 5.3 Endpoint: Tickets (CRUD)

```python
# app/routers/tickets.py

@router.post("/api/tickets", response_model=TicketResponse, status_code=201)
async def criar_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_atual)
):
    """
    Criar novo ticket

    - Gera número único: TPT-YYYYMMDD-XXX
    - Apenas usuários autenticados
    """
    # Validar que empresa e contato existem
    empresa = db.query(Empresa).filter(Empresa.id == ticket.empresa_id).first()
    contato = db.query(Contato).filter(Contato.id == ticket.contato_id).first()
    categoria = db.query(CategoriaServico).filter(CategoriaServico.id == ticket.categoria_id).first()

    if not empresa or not contato or not categoria:
        raise HTTPException(status_code=400, detail="Empresa, contato ou categoria inválidos")

    # Gerar número do ticket
    numero = gerar_numero_ticket(db)

    novo_ticket = Ticket(
        numero=numero,
        **ticket.dict()
    )

    db.add(novo_ticket)
    db.commit()
    db.refresh(novo_ticket)

    return novo_ticket

@router.get("/api/tickets", response_model=List[TicketResponse])
async def listar_tickets(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    empresa_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_atual)
):
    """
    Listar tickets

    - Filtro por status: 'aberto', 'em_andamento', 'resolvido', 'fechado'
    - Filtro por empresa
    - Técnicos veem apenas tickets (não precisam filtrar por empresa)
    - Admin vê todos

    Retorna paginado (skip/limit)
    """
    query = db.query(Ticket).filter(Ticket.ativo == True)

    if status:
        query = query.filter(Ticket.status == status)

    if empresa_id:
        query = query.filter(Ticket.empresa_id == empresa_id)

    # Técnico vê apenas tickets (não restringe por empresa)
    # Admin vê todos

    tickets = query\
        .order_by(Ticket.data_criacao.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

    return tickets

@router.get("/api/tickets/{ticket_id}", response_model=TicketResponse)
async def obter_ticket(
    ticket_id: UUID,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_atual)
):
    """Obter detalhes completo de um ticket"""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket não encontrado")
    return ticket

@router.put("/api/tickets/{ticket_id}", response_model=TicketResponse)
async def atualizar_ticket(
    ticket_id: UUID,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_atual)
):
    """Atualizar ticket"""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket não encontrado")

    for campo, valor in ticket_update.dict(exclude_unset=True).items():
        setattr(ticket, campo, valor)

    db.commit()
    db.refresh(ticket)
    return ticket

@router.post("/api/tickets/{ticket_id}/fechar", response_model=TicketResponse)
async def fechar_ticket(
    ticket_id: UUID,
    fechamento: TicketClose,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obter_usuario_atual)
):
    """Fechar ticket com solução"""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket não encontrado")

    ticket.status = 'fechado'
    ticket.solucao_descricao = fechamento.solucao_descricao
    ticket.tempo_gasto_horas = fechamento.tempo_gasto_horas
    ticket.data_fechamento = datetime.utcnow()

    db.commit()
    db.refresh(ticket)
    return ticket
```

### 5.4 Documentação OpenAPI

```
FastAPI gera automaticamente:
- /docs → Swagger UI interativo
- /redoc → ReDoc documentation
- /openapi.json → Schema OpenAPI
```

---

## 6. FRONTEND - ESTRUTURA REACT + TYPESCRIPT

### 6.1 Arquitetura de Diretórios

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── EmpresasPage.tsx
│   │   ├── ContatosPage.tsx
│   │   ├── TicketsPage.tsx
│   │   ├── TicketDetailPage.tsx
│   │   ├── CategoriasPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DarkModeToggle.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorAlert.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── EmpresaForm.tsx
│   │   │   ├── ContatoForm.tsx
│   │   │   ├── CategoriaForm.tsx
│   │   │   └── TicketForm.tsx
│   │   ├── tables/
│   │   │   ├── EmpresasTable.tsx
│   │   │   ├── ContatosTable.tsx
│   │   │   └── TicketsTable.tsx
│   │   ├── dashboard/
│   │   │   ├── TicketSummaryCards.tsx
│   │   │   ├── TicketTableInline.tsx
│   │   │   ├── TicketModalExpanded.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── TimeElapsed.tsx
│   │   │   └── ActionMenu.tsx
│   │   └── modals/
│   │       ├── TicketModal.tsx
│   │       └── FormModal.tsx
│   ├── api/
│   │   ├── client.ts (Axios instance)
│   │   ├── auth.ts
│   │   ├── empresas.ts
│   │   ├── contatos.ts
│   │   ├── categorias.ts
│   │   ├── tickets.ts
│   │   └── types.ts (API response types)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── types/
│   │   ├── index.ts (Global types)
│   │   ├── models.ts (Data models)
│   │   └── api.ts (API response types)
│   ├── utils/
│   │   ├── formatters.ts (dates, currency, etc)
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── darkmode.css
│   │   └── tailwind.config.js
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── Dockerfile
└── .dockerignore
```

### 6.2 Tipos TypeScript Globais

```typescript
// src/types/index.ts
export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'tecnico';
  ativo: boolean;
  data_criacao: string;
}

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  contato_principal_id?: string;
  ativo: boolean;
  data_criacao: string;
}

export interface Contato {
  id: string;
  empresa_id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cargo?: string;
  departamento?: string;
  principal: boolean;
  ativo: boolean;
}

export interface CategoriaServico {
  id: string;
  nome: string;
  descricao?: string;
  cor_tag: string;
  icone?: string;
  ordem: number;
  ativo: boolean;
}

export interface Ticket {
  id: string;
  numero: string;
  empresa_id: string;
  contato_id: string;
  categoria_id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  solucao_descricao?: string;
  tempo_gasto_horas?: number;
  data_criacao: string;
  data_atualizacao: string;
  data_fechamento?: string;
}
```

### 6.3 Configuração Tailwind Dark Mode

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1F2937',      // cinza escuro (fundo)
          card: '#374151',    // cinza mais claro (cards)
          border: '#4B5563',  // cinza para bordas
          text: '#F3F4F6',    // branco off (texto)
        }
      }
    }
  },
  plugins: []
}

// Aplicação em HTML/CSS:
// <html class="dark">
//   <!-- toda a aplicação fica em dark mode -->
// </html>
```

### 6.4 Autenticação Context

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useState, useCallback } from 'react';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = useCallback(async (email: string, senha: string) => {
    const response = await apiClient.post('/auth/login', { email, senha });
    setToken(response.data.access_token);
    setUsuario(response.data.usuario);
    localStorage.setItem('token', response.data.access_token);
    // Atualizar header do axios com token
  }, []);

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 6.5 Componente: Dashboard

```typescript
// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { TicketSummaryCards } from '@/components/dashboard/TicketSummaryCards';
import { TicketTableInline } from '@/components/dashboard/TicketTableInline';
import { TicketModalExpanded } from '@/components/dashboard/TicketModalExpanded';

export const DashboardPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'aberto' | 'em_andamento' | null>(null);

  const handleVerTodos = (status: 'aberto' | 'em_andamento') => {
    setSelectedStatus(status);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-bg dark text-dark-text p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <TicketSummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <TicketTableInline
          status="aberto"
          onVerTodos={() => handleVerTodos('aberto')}
        />
        <TicketTableInline
          status="em_andamento"
          onVerTodos={() => handleVerTodos('em_andamento')}
        />
      </div>

      {modalOpen && selectedStatus && (
        <TicketModalExpanded
          initialStatus={selectedStatus}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
```

---

## 7. SEGURANÇA - IMPLEMENTAÇÃO

### 7.1 JWT Authentication

```python
# app/security.py
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

SECRET_KEY = "seu-secret-key-muitoforte"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 horas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def criar_token_acesso(usuario_id: UUID) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(usuario_id), "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def extrair_usuario_do_token(token: str) -> UUID:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id: str = payload.get("sub")
        if usuario_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return UUID(usuario_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
```

### 7.2 Dependências de Autenticação

```python
# app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials

security = HTTPBearer()

async def obter_usuario_atual(
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Usuario:
    """Extrai token do header e retorna usuário autenticado"""
    usuario_id = extrair_usuario_do_token(credentials.credentials)
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario or not usuario.ativo:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    # Atualizar último acesso
    usuario.ultimo_acesso = datetime.utcnow()
    db.commit()

    return usuario

async def obter_usuario_admin(
    usuario: Usuario = Depends(obter_usuario_atual)
) -> Usuario:
    """Verifica se usuário é admin"""
    if usuario.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem acessar"
        )
    return usuario

async def obter_usuario_tecnico(
    usuario: Usuario = Depends(obter_usuario_atual)
) -> Usuario:
    """Verifica se usuário é técnico ou admin"""
    if usuario.role not in ['admin', 'tecnico']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado"
        )
    return usuario
```

### 7.3 CORS Configuration

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # URLs frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 8. ERRORHANDLING E VALIDAÇÃO

### 8.1 Custom Exception Handler

```python
# app/main.py
from fastapi.exception_handlers import request_exception_handler
from fastapi.responses import JSONResponse

class APIException(Exception):
    def __init__(self, status_code: int, message: str, detail: str = None):
        self.status_code = status_code
        self.message = message
        self.detail = detail or message

@app.exception_handler(APIException)
async def api_exception_handler(request: Request, exc: APIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message, "detail": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Erro interno do servidor", "detail": str(exc)}
    )
```

### 8.2 Input Validation (Pydantic)

```python
# Pydantic valida automaticamente:
class TicketCreate(BaseModel):
    titulo: str = Field(..., min_length=5, max_length=255)
    descricao: str = Field(..., min_length=10)
    empresa_id: UUID  # Valida se é UUID válido
    categoria_id: UUID

    class Config:
        json_schema_extra = {
            "example": {
                "titulo": "Erro no sistema",
                "descricao": "O sistema está retornando erro 500",
                "empresa_id": "123e4567-e89b-12d3-a456-426614174000",
                "categoria_id": "987f6543-e89b-12d3-a456-426614174000"
            }
        }

# FastAPI retorna erro 422 se validação falhar:
# {"detail": [{"loc": ["body", "titulo"], "msg": "ensure this value has at least 5 characters", ...}]}
```

---

## 9. DOCKER COMPOSE

### 9.1 docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: diogo
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: gestao_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://diogo:${DB_PASSWORD}@postgres:5432/gestao_db
      SECRET_KEY: ${SECRET_KEY}
      ENVIRONMENT: ${ENVIRONMENT:-development}
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    networks:
      - app-network
    volumes:
      - ./backend:/app

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://localhost:8000
    command: npm run dev
    networks:
      - app-network
    volumes:
      - ./frontend:/app

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### 9.2 Backend Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 9.3 Frontend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
```

---

## 10. PERFORMANCE E OTIMIZAÇÕES

### 10.1 Database Indexes (EPIC-1 Critical)

| Índice | Tabela | Campos | Propósito |
|--------|--------|--------|-----------|
| idx_usuarios_email | usuarios | email | Login rápido |
| idx_empresas_ativo | empresas | ativo | Listar empresas ativas |
| idx_contatos_empresa_id | contatos | empresa_id | Buscar contatos por empresa |
| idx_tickets_empresa_status | tickets | empresa_id, status | Query dashboard (Abertos/Em And. por empresa) |
| idx_tickets_data_criacao | tickets | data_criacao DESC | Ordenação de tickets |

### 10.2 Frontend Otimizações

- **Lazy loading:** Componentes carregam sob demanda
- **Debounce:** Filtros com debounce 300ms
- **Virtual scrolling:** Tabelas com >100 linhas
- **Memoization:** React.memo para componentes puros
- **Code splitting:** Webpack chunking automático

### 10.3 Backend Otimizações

- **Query optimization:** Usar select() ao invés de trazer tudo
- **Caching:** Redis para dados imutáveis (futuro)
- **Pagination:** Sempre limitar resultados
- **Compression:** gzip na response (FastAPI automático)

---

## 11. LOGGING E MONITORING

### 11.1 Logging Estruturado

```python
# app/config.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Uso:
logger.info(f"Ticket criado: {ticket.numero}")
logger.error(f"Erro ao criar ticket: {str(e)}")
```

### 11.2 Health Check Endpoint

```python
# app/routers/health.py
@router.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow()}
```

---

## 12. TESTING STRATEGY

### 12.1 Test Structure

```
backend/tests/
├── conftest.py (fixtures)
├── test_auth.py
├── test_empresas.py
├── test_contatos.py
├── test_categorias.py
├── test_tickets.py
└── integration/
    └── test_full_flow.py
```

### 12.2 Unit Test Example

```python
# backend/tests/test_tickets.py
import pytest
from sqlalchemy.orm import Session

def test_criar_ticket(db: Session, usuario: Usuario):
    """Test: Criar novo ticket com dados válidos"""
    ticket_data = {
        "empresa_id": "...",
        "contato_id": "...",
        "categoria_id": "...",
        "titulo": "Erro no sistema",
        "descricao": "O sistema está retornando erro 500"
    }

    response = client.post(
        "/api/tickets",
        json=ticket_data,
        headers={"Authorization": f"Bearer {usuario_token}"}
    )

    assert response.status_code == 201
    assert "numero" in response.json()
    assert response.json()["status"] == "aberto"
```

---

## 13. CRONOGRAMA DE IMPLEMENTAÇÃO

### Semana 1
- ✅ Dia 1-2: Setup Docker + BD + Migrations
- ✅ Dia 2-3: Models + Schemas
- ✅ Dia 3-4: Auth endpoints
- ✅ Dia 4-5: CRUD Empresas + Contatos

### Semana 2
- ✅ Dia 1-2: CRUD Tickets
- ✅ Dia 2-3: Frontend setup + Login page
- ✅ Dia 3-4: Dashboard + Tabelas inline
- ✅ Dia 4-5: Integração completa + Testes

---

## 14. HANDOFF PARA @SM

Próxima etapa:
1. @sm cria **10 User Stories** do EPIC-1
2. Cada story tem: **AC claros**, **estimation (pontos)**, **dependencies**
3. @dev começa a implementar story by story
4. @qa testa cada story com acceptance criteria

---

**DESIGN TÉCNICO COMPLETO - PRONTO PARA IMPLEMENTAÇÃO**


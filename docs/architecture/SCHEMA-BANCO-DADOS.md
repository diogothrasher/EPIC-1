# Arquitetura de Dados - Schema do Banco de Dados

**Versão:** 1.0
**BD:** PostgreSQL 15+
**ORM:** SQLAlchemy
**Migrations:** Alembic

---

## Tabelas e Relacionamentos

### 1. TABELA: `usuarios`
**Descrição:** Usuários do sistema (Admin + Técnicos)

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'tecnico', -- 'admin' ou 'tecnico'
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acesso TIMESTAMP NULL,

  CONSTRAINT ck_role CHECK (role IN ('admin', 'tecnico'))
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);
```

**Campos:**
- `id`: UUID único por usuário
- `email`: Email único (login)
- `senha_hash`: Bcrypt hash da senha
- `nome`: Nome do técnico/admin
- `role`: Nível de acesso ('admin' ou 'tecnico')
- `ativo`: Soft delete (desativa sem apagar)
- Timestamps para auditoria

---

### 2. TABELA: `empresas`
**Descrição:** Empresas para as quais presta serviço

```sql
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NULL, -- pode ser null se for pessoa física
  telefone VARCHAR(20) NULL,
  email VARCHAR(255) NULL,
  endereco TEXT NULL,
  contato_principal_id UUID NULL, -- referência para contato principal
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (contato_principal_id) REFERENCES contatos(id) ON DELETE SET NULL
);

CREATE INDEX idx_empresas_nome ON empresas(nome);
CREATE INDEX idx_empresas_cnpj ON empresas(cnpj);
CREATE INDEX idx_empresas_ativo ON empresas(ativo);
```

**Campos:**
- `id`: UUID único
- `nome`: Nome da empresa (Frutty, Farmácia Vida, etc)
- `cnpj`: CNPJ (pode ser null)
- `contato_principal_id`: Quem é o principal contact
- `ativo`: Soft delete

---

### 3. TABELA: `contatos`
**Descrição:** Pessoas de contato em cada empresa

```sql
CREATE TABLE contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  telefone VARCHAR(20) NULL,
  cargo VARCHAR(100) NULL, -- ex: "Gerente de TI"
  departamento VARCHAR(100) NULL, -- ex: "TI", "Operacional"
  principal BOOLEAN DEFAULT false, -- marcado como principal
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

CREATE INDEX idx_contatos_empresa_id ON contatos(empresa_id);
CREATE INDEX idx_contatos_principal ON contatos(principal);
CREATE INDEX idx_contatos_ativo ON contatos(ativo);
```

**Campos:**
- `id`: UUID único
- `empresa_id`: Qual empresa este contato pertence (OBRIGATÓRIO)
- `principal`: Boolean se é contato principal
- `ativo`: Soft delete

---

### 4. TABELA: `categorias_servico`
**Descrição:** Tipos de serviço oferecido (Hardware, Software, Rede, etc)

```sql
CREATE TABLE categorias_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT NULL,
  cor_tag VARCHAR(7) DEFAULT '#3B82F6', -- cor em hex para visual (azul padrão)
  icone VARCHAR(50) NULL, -- ex: "HardDrive", "Code", "Wifi"
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (nome)
);

CREATE INDEX idx_categorias_ativo ON categorias_servico(ativo);
CREATE INDEX idx_categorias_ordem ON categorias_servico(ordem);
```

**Dados Iniciais:**
```
- Hardware
- Software
- Rede
- Manutenção Preventiva
- Consultoria
- Instalação
- Suporte Remoto
```

---

### 5. TABELA: `problemas`
**Descrição:** Biblioteca de problemas recorrentes (para reutilização)

```sql
CREATE TABLE problemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  categoria_id UUID NOT NULL,
  frequencia_uso INT DEFAULT 0, -- contador de quantas vezes foi usado
  solucao_padrao TEXT NULL, -- solução comum para este problema
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (categoria_id) REFERENCES categorias_servico(id) ON DELETE RESTRICT
);

CREATE INDEX idx_problemas_categoria_id ON problemas(categoria_id);
CREATE INDEX idx_problemas_ativo ON problemas(ativo);
CREATE INDEX idx_problemas_frequencia ON problemas(frequencia_uso DESC);
```

**Campos:**
- `frequencia_uso`: Contador incrementado cada vez que é vinculado a um ticket
- `solucao_padrao`: Descrição padrão de como resolver

---

### 6. TABELA: `tickets` (CORE)
**Descrição:** Tickets de suporte/manutenção (substitui HESK)

```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(20) UNIQUE NOT NULL, -- ex: "TPT-20260221-001" (auto-gerado)
  empresa_id UUID NOT NULL,
  contato_id UUID NOT NULL, -- quem abriu o ticket
  categoria_id UUID NOT NULL,
  problema_id UUID NULL, -- problema recorrente vinculado (opcional)

  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'aberto', -- 'aberto', 'em_andamento', 'resolvido', 'fechado'
  solucao_descricao TEXT NULL, -- descrição da solução ao fechar

  tempo_gasto_horas DECIMAL(5,2) NULL, -- tempo gasto (opcional)

  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_fechamento TIMESTAMP NULL,

  ativo BOOLEAN DEFAULT true,

  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE RESTRICT,
  FOREIGN KEY (contato_id) REFERENCES contatos(id) ON DELETE RESTRICT,
  FOREIGN KEY (categoria_id) REFERENCES categorias_servico(id) ON DELETE RESTRICT,
  FOREIGN KEY (problema_id) REFERENCES problemas(id) ON DELETE SET NULL,

  CONSTRAINT ck_status CHECK (status IN ('aberto', 'em_andamento', 'resolvido', 'fechado'))
);

CREATE INDEX idx_tickets_numero ON tickets(numero);
CREATE INDEX idx_tickets_empresa_id ON tickets(empresa_id);
CREATE INDEX idx_tickets_contato_id ON tickets(contato_id);
CREATE INDEX idx_tickets_categoria_id ON tickets(categoria_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_data_criacao ON tickets(data_criacao DESC);
CREATE INDEX idx_tickets_ativo ON tickets(ativo);
CREATE INDEX idx_tickets_empresa_status ON tickets(empresa_id, status); -- composite para queries comuns
```

**Geração de Número:**
```
Formato: TPT-YYYYMMDD-XXX
Exemplo: TPT-20260221-001
Gerado automaticamente na aplicação
```

---

### 7. TABELA: `anotacoes_ticket`
**Descrição:** Anotações/Comentários durante atendimento de um ticket

```sql
CREATE TABLE anotacoes_ticket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  usuario_id UUID NOT NULL,
  conteudo TEXT NOT NULL,
  privada BOOLEAN DEFAULT false, -- se é privada ou visível

  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE INDEX idx_anotacoes_ticket_id ON anotacoes_ticket(ticket_id);
CREATE INDEX idx_anotacoes_data_criacao ON anotacoes_ticket(data_criacao DESC);
```

---

### 8. TABELA: `historico_ticket`
**Descrição:** Auditoria de todas as alterações em um ticket

```sql
CREATE TABLE historico_ticket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  usuario_id UUID NOT NULL,

  campo_alterado VARCHAR(100) NOT NULL, -- ex: 'status', 'categoria', 'titulo'
  valor_antigo TEXT NULL,
  valor_novo TEXT NOT NULL,

  data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE INDEX idx_historico_ticket_id ON historico_ticket(ticket_id);
CREATE INDEX idx_historico_data ON historico_ticket(data_alteracao DESC);
CREATE INDEX idx_historico_usuario ON historico_ticket(usuario_id);
```

**Exemplo de Registro:**
```
campo_alterado: 'status'
valor_antigo: 'aberto'
valor_novo: 'em_andamento'
```

---

### 9. TABELA: `faturamento` (CORE)
**Descrição:** Registros de faturamento associados a tickets

```sql
CREATE TABLE faturamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL UNIQUE, -- cada ticket tem no máximo um faturamento
  empresa_id UUID NOT NULL,

  valor DECIMAL(10,2) NOT NULL, -- valor cobrado
  descricao TEXT NULL, -- descrição do serviço para NF

  mes_referencia VARCHAR(7) NOT NULL, -- ex: '2026-02' (YYYY-MM)
  data_faturamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  faturado BOOLEAN DEFAULT false, -- se foi incluído em NF
  data_faturacao TIMESTAMP NULL, -- quando foi faturado
  numero_nota_fiscal VARCHAR(50) NULL, -- número da NF gerada

  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE RESTRICT,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE RESTRICT
);

CREATE INDEX idx_faturamento_ticket_id ON faturamento(ticket_id);
CREATE INDEX idx_faturamento_empresa_id ON faturamento(empresa_id);
CREATE INDEX idx_faturamento_mes_referencia ON faturamento(mes_referencia);
CREATE INDEX idx_faturamento_faturado ON faturamento(faturado);
CREATE INDEX idx_faturamento_empresa_mes ON faturamento(empresa_id, mes_referencia); -- composite para queries de relatório
```

---

### 10. TABELA: `auditoria_sistema`
**Descrição:** Log geral de operações críticas do sistema

```sql
CREATE TABLE auditoria_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL,

  acao VARCHAR(100) NOT NULL, -- ex: 'ticket_criado', 'usuario_deletado', 'faturamento_exportado'
  entidade VARCHAR(50) NOT NULL, -- ex: 'ticket', 'usuario', 'empresa'
  entidade_id VARCHAR(50) NOT NULL,

  detalhes JSONB NULL, -- detalhes adicionais em JSON

  ip_address VARCHAR(45) NULL, -- IPv4 ou IPv6
  user_agent VARCHAR(500) NULL,

  data_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE INDEX idx_auditoria_usuario_id ON auditoria_sistema(usuario_id);
CREATE INDEX idx_auditoria_data ON auditoria_sistema(data_evento DESC);
CREATE INDEX idx_auditoria_acao ON auditoria_sistema(acao);
```

---

## Relacionamentos Resumidos

```
                    ┌─────────────────┐
                    │    usuarios     │
                    │   (Admin/Tec)   │
                    └─────────────────┘
                            │
                    ┌───────┴───────┐
                    │               │
            ┌───────▼────────┐      │
            │  anotacoes_    │      │
            │    ticket      │      │
            └────────────────┘      │
                                    │
                    ┌───────────────┤
                    │               │
            ┌───────▼────────┐      │
            │   empresas     │      │
            └────────────────┘      │
                    │               │
            ┌───────▼────────┐      │
            │   contatos     │      │
            └────────────────┘      │
                    │               │
            ┌───────▼─────────────┐ │
            │     tickets         │ │
            │ (CORE - contatos)   │ │
            └─────────────────────┘ │
                    │               │
            ┌───────┼───────┐       │
            │       │       │       │
    ┌───────▼──┐    │   ┌───▼──────▼───┐
    │problemas │    │   │ faturamento  │
    └──────────┘    │   │ (CORE)       │
                    │   └──────────────┘
            ┌───────▼──────────┐
            │ categorias_      │
            │   servico        │
            └──────────────────┘

            ┌────────────────────┐
            │  historico_ticket  │ (auditoria de tickets)
            └────────────────────┘

            ┌────────────────────┐
            │ auditoria_sistema  │ (auditoria geral)
            └────────────────────┘
```

---

## Índices Implementados

### Para Performance de Queries Comuns:

```sql
-- Listagem de tickets por empresa com status
CREATE INDEX idx_tickets_empresa_status ON tickets(empresa_id, status);

-- Faturamento por mês e empresa
CREATE INDEX idx_faturamento_empresa_mes ON faturamento(empresa_id, mes_referencia);

-- Anotações ordenadas por data
CREATE INDEX idx_anotacoes_data_criacao ON anotacoes_ticket(data_criacao DESC);

-- Histórico ordenado por data
CREATE INDEX idx_historico_data ON historico_ticket(data_alteracao DESC);

-- Problemas mais usados
CREATE INDEX idx_problemas_frequencia ON problemas(frequencia_uso DESC);
```

---

## Constraints de Integridade

| Constraint | Tabela | Descrição |
|-----------|--------|-----------|
| PK | Todas | UUID único em cada tabela |
| FK | contatos → empresas | Contato sempre vinculado a empresa |
| FK | tickets → empresas | Ticket sempre vinculado a empresa |
| FK | tickets → contatos | Ticket sempre tem quem abriu |
| FK | tickets → categorias | Ticket sempre tem categoria |
| FK | faturamento → tickets | Faturamento vinculado a ticket |
| FK | anotacoes → tickets | Anotação vinculada a ticket |
| FK | historico → tickets | Histórico vinculado a ticket |
| UNIQUE | usuarios.email | Email único por usuário |
| UNIQUE | empresas.cnpj | CNPJ único (pode ser null) |
| UNIQUE | tickets.numero | Número de ticket é único |
| UNIQUE | faturamento.ticket_id | Cada ticket tem no máximo 1 faturamento |
| CHECK | usuarios.role | Apenas 'admin' ou 'tecnico' |
| CHECK | tickets.status | Apenas status válidos |

---

## Soft Deletes

Várias tabelas implementam soft delete (coluna `ativo`):
- `usuarios`
- `empresas`
- `contatos`
- `categorias_servico`
- `problemas`
- `tickets`

**Padrão:**
```python
# No ORM, sempre filtrar: where(Tabela.ativo == true)
usuarios = db.query(Usuario).filter(Usuario.ativo == True).all()
```

---

## Sequence de Geração de Número de Ticket

**Número único:** `TPT-YYYYMMDD-XXX`

**Geração na aplicação:**
```python
from datetime import datetime

def gerar_numero_ticket():
    data_atual = datetime.now().strftime("%Y%m%d")
    # Buscar último número do dia
    ultimo_ticket = db.query(Ticket)\
        .filter(Ticket.numero.startswith(f"TPT-{data_atual}")) \
        .order_by(Ticket.numero.desc()) \
        .first()

    if ultimo_ticket:
        numero_seq = int(ultimo_ticket.numero.split('-')[-1]) + 1
    else:
        numero_seq = 1

    return f"TPT-{data_atual}-{numero_seq:03d}"
```

---

## Dados Iniciais (Seed)

### Categorias Padrão:
```
1. Hardware
2. Software
3. Rede
4. Manutenção Preventiva
5. Consultoria
6. Instalação
7. Suporte Remoto
8. Outra
```

### Usuário Admin Inicial:
```
email: diogo@admin.local
nome: Diogo (Admin)
role: admin
senha: será definida na primeira execução
```

---

## Migrations com Alembic

**Estrutura:**
```
backend/migrations/
├── versions/
│   ├── 001_create_usuarios.py
│   ├── 002_create_empresas.py
│   ├── 003_create_tickets.py
│   ├── 004_add_indexes.py
│   └── ...
├── env.py
├── script.py.template
└── alembic.ini
```

**Comando para rodar:**
```bash
alembic upgrade head
```

---

## Considerações de Segurança

1. **Senhas:** Sempre hasheadas com bcrypt (nunca plaintext)
2. **Auditoria:** Todas as alterações críticas ficam em `historico_ticket` e `auditoria_sistema`
3. **Soft Deletes:** Nada é realmente deletado, preserva histórico
4. **Índices:** Pensados para performance de segurança (não deixar queries lentass)
5. **Constraints:** Integridade referencial garante consistência

---

**SCHEMA FINALIZADO - PRONTO PARA IMPLEMENTAÇÃO**


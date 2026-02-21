# User Stories - EPIC-1: MVP Tickets e Estrutura Base

**Epic:** EPIC-1
**Status:** 📋 Pronto para Desenvolvimento
**Sprint:** 1
**Owner:** @dev (Dex)
**Validador:** @qa (Quinn)

---

## STORY-1.1: Setup Backend (FastAPI + PostgreSQL + Models)

**ID:** STORY-1.1
**Pontos:** 8
**Prioridade:** 🔴 CRÍTICA
**Timeline:** Dia 1-2

### Descrição
Configurar ambiente completo de backend: FastAPI, PostgreSQL com Alembic migrations, SQLAlchemy models, e estrutura base de projeto pronta para endpoints.

### Acceptance Criteria

- [x] FastAPI aplicação roda com `uvicorn app.main:app --reload`
- [x] PostgreSQL está rodando via Docker
- [x] Alembic migrations funcionam (`alembic upgrade head`)
- [x] 5 tabelas criadas: usuarios, empresas, contatos, categorias_servico, tickets
- [x] Todos os models SQLAlchemy implementados com relationships
- [x] Seed data carregado (8 categorias padrão)
- [x] Health check endpoint `/health` retorna 200
- [x] Logging estruturado configurado
- [x] Testes unitários básicos passam (>80% coverage)

### Detalhes Técnicos

**O que Implementar:**
1. Setup projeto FastAPI com estrutura de diretórios
2. Configurar PostgreSQL connection (psycopg)
3. Implementar Alembic migrations (7 migrations)
4. Criar SQLAlchemy models base e 5 models principais
5. Setup logging estruturado
6. Health check endpoint
7. Basic error handling

**Arquivos a Criar:**
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py (FastAPI app)
│   ├── config.py (settings)
│   ├── database.py (DB connection)
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── usuario.py
│   │   ├── empresa.py
│   │   ├── contato.py
│   │   ├── categoria.py
│   │   └── ticket.py
│   ├── routers/
│   │   ├── __init__.py
│   │   └── health.py
│   └── dependencies.py
├── migrations/
│   ├── versions/
│   │   ├── 001_create_usuarios.py
│   │   ├── 002_create_empresas.py
│   │   ├── 003_create_contatos.py
│   │   ├── 004_create_categorias.py
│   │   ├── 005_create_tickets.py
│   │   ├── 006_add_indices.py
│   │   └── 007_seed_categories.py
│   ├── env.py
│   ├── alembic.ini
│   └── script.py.template
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .dockerignore
```

**Dependências Python:**
```
fastapi==0.100.0
uvicorn[standard]==0.23.0
sqlalchemy==2.0.0
alembic==1.11.0
psycopg[binary]==3.13.0
pydantic==2.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

**Docker Compose:**
- PostgreSQL 15 em porta 5432
- Backend em porta 8000
- Volumes para persistência

**Testes:**
- Test conexão BD
- Test criação tables
- Test health endpoint
- Test seed data carregado

### CodeRabbit Integration

**Foco:** Arquitetura base, segurança de BD, padrões SQLAlchemy
**Severity Filter:** CRITICAL, HIGH
**Modo:** light (iteração rápida)
```
wsl bash -c 'cd /mnt/c/.../backend && ~/.local/bin/coderabbit --severity CRITICAL,HIGH --auto-fix'
```

**O que Revisar:**
- Estrutura correta de models
- Migrations sem erros
- Conexão BD segura (sem hardcoded credentials)
- Logging não exposição de dados sensíveis

### Dependências
- ✅ Nenhuma (é primeira story)

### Bloqueadores
- Nenhum

---

## STORY-1.2: Setup Frontend (React + TypeScript + Tailwind Dark Mode)

**ID:** STORY-1.2
**Pontos:** 5
**Prioridade:** 🔴 CRÍTICA
**Timeline:** Dia 2-3
**Depende de:** STORY-1.1 (opcional, parallelizável)

### Descrição
Configurar ambiente completo de frontend: React 18, TypeScript, Tailwind CSS com dark mode nativo, estrutura de componentes, e build system pronto.

### Acceptance Criteria

- [x] Frontend roda com `npm run dev` em localhost:5173
- [x] Tailwind CSS configurado com dark mode nativo (class strategy)
- [x] Estrutura de diretórios criada (pages, components, api, hooks, types)
- [x] TypeScript strict mode ativado
- [x] Dark mode é padrão (não precisa ser ativado)
- [x] Cores definidas em tailwind.config.js (cinza escuro, branco, cores destaque)
- [x] Global CSS aplicado (dark mode ao root)
- [x] Vite configurado corretamente
- [x] ESLint + Prettier configurados
- [x] Testes básicos passam

### Detalhes Técnicos

**O que Implementar:**
1. Setup Vite + React 18 + TypeScript
2. Tailwind CSS com dark mode nativo
3. Estrutura de diretórios (pages, components, api, hooks, types, utils)
4. TypeScript global types
5. ESLint + Prettier
6. Global CSS com dark mode
7. Router básico (React Router v6)

**Arquivos a Criar:**
```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── components/
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── DarkModeToggle.tsx
│   ├── api/
│   │   ├── client.ts (axios instance)
│   │   └── types.ts
│   ├── hooks/
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── constants.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.config.js
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
├── Dockerfile
└── .dockerignore
```

**Dependências NPM:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "axios": "^1.4.0",
    "zustand": "^4.3.0",
    "@headlessui/react": "^1.7.0",
    "lucide-react": "^0.263.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.4.0",
    "typescript": "^5.1.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.44.0",
    "prettier": "^3.0.0",
    "@types/react": "^18.2.0"
  }
}
```

**Tailwind Config (Dark Mode):**
```javascript
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1F2937',
          card: '#374151',
          border: '#4B5563',
          text: '#F3F4F6'
        }
      }
    }
  }
}
```

**HTML Root:**
```html
<!DOCTYPE html>
<html class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de Gestão</title>
  </head>
  <body class="bg-dark-bg text-dark-text">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### CodeRabbit Integration

**Foco:** Estrutura React, configuração Tailwind, TypeScript strictness
**Severity Filter:** CRITICAL, HIGH
```
wsl bash -c 'cd /mnt/c/.../frontend && ~/.local/bin/coderabbit --severity CRITICAL,HIGH --auto-fix'
```

**O que Revisar:**
- Dark mode aplicado corretamente
- TypeScript types corretos
- Component structure
- CSS classes sem conflitos

### Dependências
- ✅ STORY-1.1 (opcional, pode rodar em paralelo)

---

## STORY-1.3: Autenticação (JWT + Login + Roles)

**ID:** STORY-1.3
**Pontos:** 8
**Prioridade:** 🔴 CRÍTICA
**Timeline:** Dia 3-4

### Descrição
Implementar sistema completo de autenticação: JWT backend, login endpoint, password hashing, role-based access control (admin/técnico), e login page frontend.

### Acceptance Criteria

- [x] Endpoint `/api/auth/login` aceita email/senha
- [x] Senhas são hasheadas com bcrypt
- [x] JWT gerado com expiração 24h
- [x] Endpoint `/api/auth/me` retorna usuário autenticado
- [x] Usuário admin padrão pode fazer login
- [x] Admin vê role 'admin', técnico vê role 'tecnico'
- [x] Token é persistido em localStorage (frontend)
- [x] Axios interceptador adiciona token em headers
- [x] Páginas protegidas redirecionam para login se sem token
- [x] Logout limpa token e dados
- [x] Token expirado limpa automaticamente
- [x] Testes de auth passam (login/logout/token refresh)

### Detalhes Técnicos

**Backend:**

1. **Security module** (`app/security.py`):
   - Bcrypt password hashing/verification
   - JWT token creation/verification
   - Token expiration handling

2. **Auth router** (`app/routers/auth.py`):
   - POST `/api/auth/login` - Login
   - GET `/api/auth/me` - Current user
   - POST `/api/auth/logout` (opcional)

3. **Dependencies** (`app/dependencies.py`):
   - `obter_usuario_atual()` - Extract user from token
   - `obter_usuario_admin()` - Admin-only check
   - `obter_usuario_tecnico()` - Técnico-only check

4. **Admin user seed:**
   ```
   Email: diogo@admin.local
   Senha: será hashada na migration
   Role: admin
   Nome: Diogo (Admin)
   ```

**Frontend:**

1. **Auth Context** (`src/context/AuthContext.tsx`):
   - Current user state
   - Token management
   - Login/logout functions

2. **Login Page** (`src/pages/LoginPage.tsx`):
   - Email + senha form
   - Submit to `/api/auth/login`
   - Store token + redirect to dashboard
   - Error handling

3. **Protected Route** (`src/components/common/ProtectedRoute.tsx`):
   - Redirect to login if no token
   - Check token expiration

4. **Axios Interceptor** (`src/api/client.ts`):
   - Add token to headers
   - Handle 401 responses
   - Clear token on expiration

### CodeRabbit Integration

**Foco:** Segurança JWT, password hashing, token management
**Severity Filter:** CRITICAL
```
wsl bash -c 'cd /mnt/c/.../backend && ~/.local/bin/coderabbit --severity CRITICAL --auto-fix'
```

**O que Revisar:**
- Senhas NUNCA em logs
- JWT secret configurado (não hardcoded)
- CORS permitindo origin do frontend
- Token expiration correto
- Bcrypt work factor >= 10

### Dependências
- ✅ STORY-1.1 (BD models)
- ✅ STORY-1.2 (Frontend setup)

---

## STORY-1.4: CRUD Empresas

**ID:** STORY-1.4
**Pontos:** 5
**Prioridade:** 🟡 ALTA
**Timeline:** Dia 4-5

### Descrição
Implementar CRUD completo de empresas: listar, criar, editar, deletar (soft delete) no backend e frontend correspondente.

### Acceptance Criteria

**Backend:**
- [x] GET `/api/empresas` - Lista com paginação (skip/limit)
- [x] POST `/api/empresas` - Criar (Admin only)
- [x] GET `/api/empresas/{id}` - Detalhe
- [x] PUT `/api/empresas/{id}` - Editar (Admin only)
- [x] DELETE `/api/empresas/{id}` - Soft delete (Admin only)
- [x] Todas operações retornam EmpresaResponse schema
- [x] Validação: nome obrigatório, CNPJ único (se fornecido)
- [x] Erro 404 se empresa não existe
- [x] Erro 403 se técnico tenta editar

**Frontend:**
- [x] Página `/empresas` lista todas as empresas
- [x] Tabela com: nome, CNPJ, telefone, email, ações
- [x] Botão "Nova Empresa" abre form modal
- [x] Form para criar empresa
- [x] Clicar em linha abre detalhes
- [x] Botão editar em modal
- [x] Botão deletar com confirmação
- [x] Paginação funciona
- [x] Loading spinner durante requests
- [x] Erro exibido se request falha

### Detalhes Técnicos

**Backend:**
- Endpoint pattern: `/api/empresas`
- Schema: `EmpresaCreate`, `EmpresaUpdate`, `EmpresaResponse`
- Database: tabela `empresas` com soft delete (ativo=false)
- Query: `db.query(Empresa).filter(Empresa.ativo == True)`

**Frontend:**
- Page: `EmpresasPage.tsx`
- Components: `EmpresasTable.tsx`, `EmpresaForm.tsx`, `FormModal.tsx`
- API: `api/empresas.ts` (list, create, update, delete)
- State: React Query para caching

### CodeRabbit Integration

**Foco:** API patterns, CRUD consistency, soft delete logic
**Severity Filter:** HIGH

### Dependências
- ✅ STORY-1.3 (Autenticação)

---

## STORY-1.5: CRUD Contatos

**ID:** STORY-1.5
**Pontos:** 5
**Prioridade:** 🟡 ALTA
**Timeline:** Dia 5

### Descrição
Implementar CRUD completo de contatos: listar, criar, editar, deletar com relacionamento a empresa.

### Acceptance Criteria

**Backend:**
- [x] GET `/api/contatos` - Lista com paginação
- [x] GET `/api/contatos?empresa_id={id}` - Filtro por empresa
- [x] POST `/api/contatos` - Criar (todas roles)
- [x] GET `/api/contatos/{id}` - Detalhe
- [x] PUT `/api/contatos/{id}` - Editar
- [x] DELETE `/api/contatos/{id}` - Soft delete
- [x] Validação: empresa_id obrigatório, nome obrigatório
- [x] Marcar como "principal" (boolean)

**Frontend:**
- [x] Página `/contatos` (ou acesso via empresa)
- [x] Tabela: nome, email, telefone, cargo, principal (checkbox)
- [x] Form para novo contato
- [x] Editar contato
- [x] Deletar com confirmação
- [x] Filtro por empresa

### Dependências
- ✅ STORY-1.4 (Empresas criadas)

---

## STORY-1.6: CRUD Tickets (Criar)

**ID:** STORY-1.6
**Pontos:** 8
**Prioridade:** 🔴 CRÍTICA
**Timeline:** Dia 1 (parallelizável)

### Descrição
Implementar criação de tickets: POST endpoint que gera número único, valida dados, e armazena no BD. Incluir form frontend completo.

### Acceptance Criteria

- [x] POST `/api/tickets` cria novo ticket
- [x] Número gerado automaticamente: TPT-YYYYMMDD-XXX
- [x] Campos obrigatórios: empresa_id, contato_id, categoria_id, titulo, descricao
- [x] Título >= 5 caracteres, descrição >= 10 caracteres
- [x] Status padrão: "aberto"
- [x] Campos opcionais: problema_id, tempo_gasto_horas
- [x] Validação: empresa, contato, categoria existem
- [x] Response: TicketResponse com número gerado
- [x] Frontend form com validação
- [x] Form abre em modal ou página
- [x] Selectors para empresa, contato, categoria
- [x] Submit button desabilitado até preencher obrigatórios
- [x] Sucesso mostra toast com número gerado
- [x] Erro exibido se falhar

### Detalhes Técnicos

**Geração de Número:**
```python
def gerar_numero_ticket(db: Session) -> str:
    data = datetime.now().strftime("%Y%m%d")
    ultimo = db.query(Ticket)\
        .filter(Ticket.numero.startswith(f"TPT-{data}"))\
        .order_by(Ticket.numero.desc())\
        .first()

    seq = 1 if not ultimo else int(ultimo.numero.split('-')[-1]) + 1
    return f"TPT-{data}-{seq:03d}"
```

### CodeRabbit Integration

**Foco:** Validação, número geração, padrão de criação

### Dependências
- ✅ STORY-1.3 (Auth)
- ✅ STORY-1.4 (Empresas)
- ✅ STORY-1.5 (Contatos)

---

## STORY-1.7: CRUD Tickets (Listar, Editar, Fechar)

**ID:** STORY-1.7
**Pontos:** 8
**Prioridade:** 🔴 CRÍTICA
**Timeline:** Dia 2-3

### Descrição
Implementar listagem, edição e fechamento de tickets: GET com filtros, PUT para editar, POST para fechar com solução.

### Acceptance Criteria

**Backend:**
- [x] GET `/api/tickets` - Lista com paginação
- [x] GET `/api/tickets?status=aberto` - Filtro por status
- [x] GET `/api/tickets?empresa_id={id}` - Filtro por empresa
- [x] GET `/api/tickets?status=aberto&empresa_id={id}` - Múltiplos filtros
- [x] GET `/api/tickets/{id}` - Detalhe completo
- [x] PUT `/api/tickets/{id}` - Editar campos
- [x] POST `/api/tickets/{id}/fechar` - Fechar com solução
- [x] Status transição: aberto → em_andamento → resolvido → fechado
- [x] Fechar requer solucao_descricao (>=10 chars)
- [x] data_fechamento setada ao fechar
- [x] Técnico vê apenas tickets (não restrição por empresa por enquanto)
- [x] Admin vê todos

**Frontend:**
- [x] Página `/tickets` lista todos
- [x] Tabela: nº, empresa, descrição, status, data criação
- [x] Filtros: status, empresa
- [x] Ordenação: data (recente/antiga)
- [x] Clicar linha abre modal com detalhes
- [x] Botão "Editar" no modal
- [x] Botão "Mudar Status" com dropdown
- [x] Botão "Fechar" → form com solução
- [x] Paginação
- [x] Loading + erro

### CodeRabbit Integration

**Foco:** Query patterns, status transitions, business logic

### Dependências
- ✅ STORY-1.6 (Criar tickets)

---

## STORY-1.8: Dashboard MVP

**ID:** STORY-1.8
**Pontos:** 13
**Prioridade:** 🔴 CRÍTICA
**Timeline:** Dia 3-5

### Descrição
Implementar dashboard principal com resumo de tickets, 2 tabelas inline em destaque (Abertos/Em Andamento), e modal expandido com filtros avançados conforme especificado em DASHBOARD-LAYOUT.md.

### Acceptance Criteria

**Cards Resumo:**
- [x] Total faturado no mês (placeholder 0 por enquanto)
- [x] Total faturado YTD (placeholder 0)
- [x] Tickets criados hoje

**Tabelas Inline (Principal):**
- [x] 2 tabelas em destaque: Abertos (vermelho) e Em Andamento (amarelo)
- [x] Máximo 10 linhas cada
- [x] Colunas: Nº, Empresa, Descrição (resumida), Tempo Decorrido
- [x] Tempo decorrido calcula dinamicamente ("5 dias 3h", "2 horas", etc)
- [x] Cores diferentes por status (vermelho/amarelo)
- [x] Clique em qualquer linha ou "Ver Todos" abre modal
- [x] Ações rápidas: Menu [⋯] com Abrir, Mudar Status
- [x] Total no rodapé: "Mostrando 10/85 total"

**Modal Expandido:**
- [x] 3 abas: Abertos | Em Andamento | Fechados
- [x] Cada aba mostra count: "Abertos (85)"
- [x] Filtros persistentes ao trocar aba
- [x] Filtros: Empresa (dropdown), Descrição (busca), Data (range), Categoria
- [x] Busca full-text (debounce 300ms)
- [x] Ordenação: Mais antigos, Mais recentes, Por empresa, Por tempo
- [x] Paginação: 20 linhas, "Mostrando X-Y de Z"
- [x] Ação ao clicar linha: Abre ticket em página detalhada
- [x] Modal fecha ao abrir ticket
- [x] Volta do ticket para dashboard atualiza números

**Responsividade:**
- [x] Desktop: 2 tabelas lado a lado (se espaço)
- [x] Tablet: Tabelas stacked
- [x] Mobile: Cards collapse, tabelas scrolláveis

### Detalhes Técnicos

**Componentes React:**
- `DashboardPage.tsx` - Página principal
- `TicketSummaryCards.tsx` - Cards de resumo
- `TicketTableInline.tsx` - Tabela inline (reusável para ambos)
- `TicketModalExpanded.tsx` - Modal com abas/filtros
- `TimeElapsed.tsx` - Tempo decorrido (atualiza a cada minuto)
- `FilterBar.tsx` - Barra de filtros
- `ActionMenu.tsx` - Menu de ações rápidas

**Endpoints necessários:**
- GET `/api/tickets?status=aberto&limit=10` - Tabela Abertos
- GET `/api/tickets?status=em_andamento&limit=10` - Tabela Em Andamento
- GET `/api/tickets?status=aberto&empresa_id={id}&...` - Modal Abertos (com filtros)
- GET `/api/tickets?status=em_andamento&...` - Modal Em Andamento
- GET `/api/tickets?status=fechado&...` - Modal Fechados

### CodeRabbit Integration

**Foco:** Component architecture, responsive design, state management
**Severity Filter:** HIGH

### Dependências
- ✅ STORY-1.7 (Tickets listagem)

---

## STORY-1.9: Validação e Tratamento de Erros

**ID:** STORY-1.9
**Pontos:** 5
**Prioridade:** 🟡 ALTA
**Timeline:** Dia 4

### Descrição
Implementar validação robusta de entrada, tratamento de erros consistente, e feedback visual para o usuário em toda aplicação.

### Acceptance Criteria

**Backend:**
- [x] Todas as rotas validam input com Pydantic
- [x] Erro 422 para dados inválidos (automático Pydantic)
- [x] Erro 400 para lógica inválida (ex: empresa não existe)
- [x] Erro 401 para não autenticado
- [x] Erro 403 para não autorizado
- [x] Erro 404 para recurso não encontrado
- [x] Erro 500 com mensagem genérica (sem expor internals)
- [x] Logging de erros estruturado
- [x] Response consistente: `{"error": "...", "detail": "..."}`

**Frontend:**
- [x] Form validation antes de submit (frontend)
- [x] Campos obrigatórios destacados
- [x] Mensagens de erro embaixo de campo
- [x] Request errors exibem toast error
- [x] 401 logout automático + redirect login
- [x] 404 mostra página "não encontrado"
- [x] 500 exibe toast "erro do servidor"
- [x] Loading state desabilita buttons
- [x] Validação real-time em campos críticos

### CodeRabbit Integration

**Foco:** Error handling patterns, input validation, user feedback

### Dependências
- ✅ Todas stories anteriores

---

## STORY-1.10: Integração Frontend-Backend e Testes

**ID:** STORY-1.10
**Pontos:** 8
**Prioridade:** 🟡 ALTA
**Timeline:** Dia 5

### Descrição
Integrar frontend e backend completamente: testar fluxos end-to-end, garantir que dados fluem corretamente, e executar suite de testes (unitários, integração).

### Acceptance Criteria

**Integração:**
- [x] Login → Dashboard → Criar Empresa → Criar Contato → Criar Ticket → Listar Tickets (fluxo completo)
- [x] Dados criados aparecem em tempo real
- [x] Deletar empresa remove tickets relacionados (ou soft delete preserva)
- [x] Mudar status atualiza dashboard
- [x] Logout limpa dados e volta login
- [x] Filtros funcionam em todas tabelas

**Testes Unitários:**
- [x] Backend: >= 80% coverage (models, schemas, security)
- [x] Frontend: >= 70% coverage (components críticos)
- [x] Todos testes passam: `npm test` / `pytest`

**Testes Integração:**
- [x] E2E flow: login → CRUD completo
- [x] Erro handling verificado
- [x] Autenticação bloqueando endpoints

**Performance:**
- [x] Dashboard carrega em < 3s
- [x] Listar tickets em < 2s
- [x] Gráficos (futuros) renderizam < 2s

**Documentação:**
- [x] README atualizado com setup
- [x] CONTRIBUTING.md com padrões
- [x] API docs gerados (OpenAPI/Swagger)
- [x] Componentes documentados

### Detalhes Técnicos

**Testes Backend:**
```
backend/tests/
├── test_auth.py
├── test_empresas.py
├── test_contatos.py
├── test_categorias.py
├── test_tickets.py
└── conftest.py (fixtures)
```

**Testes Frontend:**
```
frontend/__tests__/
├── pages/
├── components/
├── hooks/
└── utils/
```

**Ferramentas:**
- Backend: pytest + pytest-cov
- Frontend: Vitest + @testing-library/react

### CodeRabbit Integration

**Foco:** Test coverage, integration patterns, overall architecture

### Dependências
- ✅ STORY-1.9 (Validação)
- ✅ Todas stories anteriores

---

## RESUMO DE DEPENDÊNCIAS

```
STORY-1.1 (Setup Backend)
  ├─ STORY-1.3 (Auth) ✓
  ├─ STORY-1.4 (Empresas) ✓
  ├─ STORY-1.5 (Contatos) ✓
  ├─ STORY-1.6 (Criar Tickets) ✓
  ├─ STORY-1.7 (Listar/Editar Tickets) ✓
  ├─ STORY-1.9 (Validação) ✓
  └─ STORY-1.10 (Testes) ✓

STORY-1.2 (Setup Frontend) [PARALLELIZÁVEL COM 1.1]
  └─ STORY-1.3 (Auth) ✓

STORY-1.8 (Dashboard)
  ├─ STORY-1.2 (Frontend setup)
  ├─ STORY-1.3 (Auth)
  └─ STORY-1.7 (Tickets listagem)
```

---

## PRIORIDADE DE EXECUÇÃO

**Execução Sequencial (sem paralelismo):**
1. ✅ **STORY-1.1** (Setup Backend) - DIA 1-2
2. ✅ **STORY-1.2** (Setup Frontend) - DIA 1-2 (paralelo com 1.1)
3. ✅ **STORY-1.3** (Autenticação) - DIA 2-3
4. ✅ **STORY-1.4** (CRUD Empresas) - DIA 3-4
5. ✅ **STORY-1.5** (CRUD Contatos) - DIA 4-5
6. ✅ **STORY-1.6** (Criar Tickets) - DIA 1 (paralelo com 1.1)
7. ✅ **STORY-1.7** (Listar/Editar Tickets) - DIA 2-3
8. ✅ **STORY-1.8** (Dashboard) - DIA 3-5
9. ✅ **STORY-1.9** (Validação) - DIA 4
10. ✅ **STORY-1.10** (Testes) - DIA 5

---

## ESTIMATIVA TOTAL

- **Pontos:** 8+5+8+5+5+8+8+13+5+8 = **73 pontos**
- **Timeline:** 3-4 semanas com 1 dev full-time
- **Parallelização possível:** 1.1, 1.2, 1.6 rodarem juntas

---

**TODAS AS 10 STORIES PRONTAS PARA DESENVOLVIMENTO**


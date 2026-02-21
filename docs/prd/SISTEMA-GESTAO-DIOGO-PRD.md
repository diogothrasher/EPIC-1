# PRD: Sistema de Gestão de Trabalho e Financeiro para Técnico de Suporte

**Versão:** 1.0
**Data:** 2026-02-21
**Produto Manager:** Morgan (PM)
**Status:** Estruturando Épicos

---

## 1. VISÃO DO PRODUTO

### Objetivo Principal
Criar uma **plataforma unificada de gestão de tickets, trabalho e faturamento** que substitua completamente o HESK e centralize todas as operações de suporte técnico e gestão financeira em um único sistema web moderno e intuitivo.

### Problema que Resolve
Atualmente, o fluxo de trabalho envolve múltiplas ferramentas:
- **HESK** para gestão de tickets (desacoplado)
- **Planilha manual** para faturamento e registro de serviços
- **Falta de consolidação** de dados entre sistemas

Isto causa:
- ❌ Retrabalho de dados
- ❌ Risco de inconsistência
- ❌ Processo manual e propenso a erros
- ❌ Falta de visibilidade consolidada

### Benefício Esperado
✅ **Sistema único** que consolida tickets, serviços, contatos e faturamento
✅ **Reduz 80%** do tempo de processamento mensal de faturamento
✅ **Aumenta rastreabilidade** com histórico completo de todas as operações
✅ **Prepara para escala** permitindo adicionar novos técnicos conforme necessário

---

## 2. ESCOPO DO PRODUTO

### Dentro do Escopo (IN)
- ✅ Gestão completa de tickets (substitui HESK)
- ✅ Cadastro de empresas (Frutty, Farmácia Vida, futuros)
- ✅ Gestão de contatos por empresa
- ✅ Categorias de serviços reutilizáveis
- ✅ Biblioteca de problemas recorrentes
- ✅ Faturamento consolidado por mês/período
- ✅ Exportação de dados (CSV, JSON, pronto para NF)
- ✅ Relatórios e gráficos
- ✅ Dashboard com métricas principais
- ✅ Autenticação multi-nível (Admin + Técnico)
- ✅ Interface dark mode responsiva
- ✅ Anotações/comentários em tickets

### Fora do Escopo (OUT)
- ❌ Integração direta com HESK (será migração manual depois)
- ❌ Emissão de notas fiscais (apenas gera dados para NF)
- ❌ Integração com APIs externas (bancos, sistemas contábeis)
- ❌ Mobile app nativo (web responsivo é suficiente)
- ❌ Backup/Restauração automática (será manual no início)
- ❌ Notificações por email/SMS

### Fora do Escopo Inicial (Fase 5+)
- 🔮 Integração com HESK (Fase 3)
- 🔮 Agendamento de manutenção preventiva
- 🔮 Integração com sistemas contábeis
- 🔮 Alertas de SLA
- 🔮 Fila de priorização automática

---

## 3. REQUISITOS FUNCIONAIS POR MÓDULO

### 3.1 Gestão de Tickets (SUBSTITUI HESK)

**Criação de Tickets:**
- FR-TKT-001: Criar novo ticket com título, descrição, empresa e contato
- FR-TKT-002: Sistema auto-gera número de ticket único (TPT-20260221-001, etc)
- FR-TKT-003: Permitir vincular problema recorrente ao ticket
- FR-TKT-004: Permitir atribuir valor cobrado no momento da criação ou após
- FR-TKT-005: Registrar data/hora exata de criação (timestamp)

**Visualização e Listagem:**
- FR-TKT-006: Listar todos os tickets com paginação
- FR-TKT-007: Filtrar por: empresa, status, data, categoria, contato
- FR-TKT-008: Buscar por número de ticket ou palavras-chave na descrição
- FR-TKT-009: Visualizar tempo decorrido desde abertura (dias/horas)
- FR-TKT-010: Ordenar por: data de criação, atualização, status

**Edição e Fluxo:**
- FR-TKT-011: Editar descrição, categoria, contato, empresa
- FR-TKT-012: Registrar status: Aberto, Em Andamento, Resolvido, Fechado
- FR-TKT-013: Transitionar status com histórico de mudanças
- FR-TKT-014: Adicionar anotações/comentários privados durante atendimento
- FR-TKT-015: Registrar solução ao fechar (descrição do que foi feito)

**Histórico e Auditoria:**
- FR-TKT-016: Manter histórico de todas as alterações do ticket
- FR-TKT-017: Mostrar quem mudou o quê e quando
- FR-TKT-018: Permitir visualizar versões anteriores do ticket

### 3.2 Gestão de Empresas

**CRUD Básico:**
- FR-EMP-001: Criar nova empresa (nome, CNPJ, telefone, email)
- FR-EMP-002: Listar empresas ativas
- FR-EMP-003: Editar dados da empresa
- FR-EMP-004: Desativar empresa (soft delete)

**Relacionamentos:**
- FR-EMP-005: Designar contato principal da empresa
- FR-EMP-006: Visualizar todos os tickets da empresa
- FR-EMP-007: Visualizar total faturado por empresa

### 3.3 Gestão de Contatos

**CRUD por Empresa:**
- FR-CNT-001: Criar contato vinculado a empresa (nome, tel, email, cargo)
- FR-CNT-002: Listar contatos por empresa
- FR-CNT-003: Editar dados do contato
- FR-CNT-004: Marcar como "principal" ou "responsável"
- FR-CNT-005: Desativar contato (soft delete)

**Rastreabilidade:**
- FR-CNT-006: Mostrar histórico de tickets abertos por contato
- FR-CNT-007: Visualizar total de tickets por contato

### 3.4 Categorias de Serviço

**Gestão:**
- FR-CAT-001: Criar categoria (Hardware, Software, Rede, Manutenção, etc)
- FR-CAT-002: Editar categoria
- FR-CAT-003: Listar categorias com ícone/cor para visual
- FR-CAT-004: Definir ordem de exibição
- FR-CAT-005: Desativar categoria

### 3.5 Biblioteca de Problemas

**Gestão:**
- FR-PRB-001: Criar problema recorrente com título, descrição, categoria
- FR-PRB-002: Vincular problema a categorias
- FR-PRB-003: Registrar frequência de uso
- FR-PRB-004: Editar problema
- FR-PRB-005: Desativar problema

**Reutilização:**
- FR-PRB-006: Vincular problema existente ao criar/editar ticket
- FR-PRB-007: Mostrar histórico de uso (quantas vezes foi aplicado)

### 3.6 Faturamento e Gestão Financeira

**Registro de Valores:**
- FR-FIN-001: Permitir registrar valor cobrado ao fechar ticket
- FR-FIN-002: Permitir editar valor depois de registrado
- FR-FIN-003: Associar valor a período (mês/ano)
- FR-FIN-004: Permitir marcar ticket como "faturado" ou "pendente"

**Aba de Faturamento do Mês:**
- FR-FIN-005: Mostrar todos os tickets de um mês específico
- FR-FIN-006: Colunas: Data, Solicitação, Serviço, Nº Chamado, Valor
- FR-FIN-007: Calcular subtotal automaticamente
- FR-FIN-008: Mostrar total geral do período
- FR-FIN-009: Filtrar por empresa
- FR-FIN-010: Filtrar por status (faturado/pendente)

**Exportação:**
- FR-FIN-011: Exportar como CSV (pronto para Excel)
- FR-FIN-012: Exportar como tabela formatada para PDF/print
- FR-FIN-013: Exportar como JSON (para integração futura)

**Histórico:**
- FR-FIN-014: Consultar faturamento de meses anteriores
- FR-FIN-015: Comparar totais mês a mês

### 3.7 Relatórios e Gráficos

**Dashboard Principal:**
- FR-REP-001: **Resumo cards:** total faturado mês, total YTD, tickets hoje
- FR-REP-002: **2 Tabelas Inline em Destaque (Principal do Dashboard):**
  * **Tabela 1:** Tickets Abertos (cores: vermelho/alert)
  * **Tabela 2:** Tickets Em Andamento (cores: amarelo/warning)
  * Cada tabela mostra: Nº Chamado, Empresa, Descrição resumida, Tempo Decorrido, Status
  * **Ao clicar** em qualquer tabela → abre MODAL expandido com:
    - Lista completa de todos os tickets do status selecionado
    - **3 abas:** Abertos | Em Andamento | Fechados
    - Filtros avançados: por Empresa, Nome/Descrição, Data (range), Categoria
    - Ações rápidas: Clicar para abrir ticket completo, mudar status direto
    - Ordenação: Mais antigos, Mais recentes
    - Busca full-text na descrição

**Especificações das Tabelas Inline:**
- FR-REP-003: Mostrar tempo decorrido desde abertura (ex: "Aberto há 5 dias, 3 horas")
- FR-REP-004: Cores diferentes por status:
  * Abertos → Vermelho/Alert (#EF4444)
  * Em Andamento → Amarelo/Warning (#FBBF24)
  * Resolvidos → Verde/Success (#22C55E)
  * Fechados → Cinza/Muted (#9CA3AF)
- FR-REP-005: Máximo 10 linhas por tabela (scroll ou paginação)
- FR-REP-006: Ações rápidas por linha: [Abrir] [Mudar Status] [...mais]

**Modal Expandido de Tickets:**
- FR-REP-007: Mostrar todos os tickets com filtros avançados
- FR-REP-008: 3 abas: Abertos | Em Andamento | Fechados (cada uma com próprio filtro)
- FR-REP-009: Filtros: Empresa, Busca por nome/descrição, Data (desde/até), Categoria, Ordenação
- FR-REP-010: Busca é persistente ao trocar de aba
- FR-REP-011: Resultados com paginação (ex: 20 por página)
- FR-REP-012: Ação rápida: clicar linha para abrir ticket completo em nova página

**Gráficos de Análise:**
- FR-REP-013: Quantidade de tickets por mês (gráfico linha/coluna)
- FR-REP-014: Distribuição por tipo de serviço (gráfico pizza)
- FR-REP-015: Total faturado por mês (gráfico barras)
- FR-REP-016: Tickets por empresa (comparativo)
- FR-REP-017: Tempo médio de resolução

**Relatórios Tabulares:**
- FR-REP-018: Histórico de faturamento (tabela com totais por mês)
- FR-REP-019: Tickets por status e período
- FR-REP-020: Performance por empresa

### 3.8 Gestão de Usuários e Autenticação

**Níveis de Acesso:**
- FR-AUTH-001: Dois níveis: Admin (você), Técnico (outros)
- FR-AUTH-002: Admin: acesso total (todas as funcionalidades)
- FR-AUTH-003: Técnico: acesso limitado a tickets e suporte
- FR-AUTH-004: Autenticação via JWT (email + senha)

**Controle de Acesso:**
- FR-AUTH-005: Técnico NÃO pode: acessar financeiro, editar empresas, criar usuários
- FR-AUTH-006: Técnico PODE: criar/editar/visualizar tickets, buscar contatos
- FR-AUTH-007: Auditoria: log de quem fez o quê e quando

---

## 4. REQUISITOS NÃO-FUNCIONAIS

### 4.1 Performance
- **NFR-PER-001:** Carregamento de listagem de tickets < 2s (até 10k registros)
- **NFR-PER-002:** Busca por palavras-chave < 1s (com índices no BD)
- **NFR-PER-003:** Gráficos renderizam em < 3s
- **NFR-PER-004:** Exportação CSV < 5s (até 10k registros)

### 4.2 Escalabilidade
- **NFR-ESC-001:** Suportar até 100k tickets no primeiro ano
- **NFR-ESC-002:** Preparado para adicionar 5-10 técnicos simultaneamente
- **NFR-ESC-003:** API pronta para integração futura (HESK, sistemas contábeis)

### 4.3 Segurança
- **NFR-SEG-001:** Senhas hasheadas com bcrypt
- **NFR-SEG-002:** JWT com expiração de 24h
- **NFR-SEG-003:** CORS configurado para seu domínio
- **NFR-SEG-004:** Validação de entrada em todos os endpoints
- **NFR-SEG-005:** Sem armazenar dados sensíveis em logs
- **NFR-SEG-006:** Backup automático de BD (manual no início)

### 4.4 Usabilidade
- **NFR-USA-001:** Interface dark mode nativa (não tema sobreposto)
- **NFR-USA-002:** Cores contrastantes para acessibilidade (WCAG AA mínimo)
- **NFR-USA-003:** Responsivo: desktop, tablet, mobile
- **NFR-USA-004:** Feedback visual claro para ações (toasts, alerts)
- **NFR-USA-005:** Atalhos de teclado para operações frequentes

### 4.5 Confiabilidade
- **NFR-CONF-001:** Uptime mínimo de 99.9% em produção
- **NFR-CONF-002:** Sem perda de dados em caso de crash
- **NFR-CONF-003:** Recuperação automática de conexão com BD

### 4.6 Manutenibilidade
- **NFR-MANU-001:** Código TypeScript com tipos completos
- **NFR-MANU-002:** Testes unitários para lógica crítica (>70% cobertura)
- **NFR-MANU-002:** Documentação de arquitetura e fluxos
- **NFR-MANU-004:** Logs estruturados para debug

---

## 5. ARQUITETURA TÉCNICA (VISÃO DE ALTO NÍVEL)

### 5.1 Stack Recomendado
```
Frontend:  React 18 + TypeScript + Tailwind CSS (dark mode)
Backend:   FastAPI (Python) + SQLAlchemy ORM
BD:        PostgreSQL 15+
DevOps:    Docker + Docker Compose
Auth:      JWT (simples, sem OAuth inicialmente)
Gráficos:  Recharts (React wrapper para Chart.js)
Exports:   python-pptx (CSV nativo via Pandas)
```

### 5.2 Estrutura de Diretórios
```
projeto/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   │   ├── empresa.py
│   │   │   ├── contato.py
│   │   │   ├── ticket.py
│   │   │   ├── categoria.py
│   │   │   ├── problema.py
│   │   │   ├── faturamento.py
│   │   │   ├── usuario.py
│   │   │   └── anotacao.py
│   │   ├── schemas/
│   │   │   ├── empresa.py
│   │   │   ├── contato.py
│   │   │   ├── ticket.py
│   │   │   └── ... (um por modelo)
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── empresas.py
│   │   │   ├── contatos.py
│   │   │   ├── tickets.py
│   │   │   ├── categorias.py
│   │   │   ├── problemas.py
│   │   │   ├── faturamento.py
│   │   │   └── relatorios.py
│   │   ├── database.py
│   │   ├── config.py
│   │   ├── security.py
│   │   └── utils.py
│   ├── migrations/
│   │   └── alembic scripts
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Tickets.tsx
│   │   │   ├── Faturamento.tsx
│   │   │   ├── Relatorios.tsx
│   │   │   ├── Empresas.tsx
│   │   │   ├── Contatos.tsx
│   │   │   ├── Configuracoes.tsx
│   │   │   └── Login.tsx
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── DarkModeToggle.tsx
│   │   │   ├── tickets/
│   │   │   │   ├── TicketForm.tsx
│   │   │   │   ├── TicketList.tsx
│   │   │   │   └── TicketDetail.tsx
│   │   │   ├── faturamento/
│   │   │   │   ├── FaturamentoMes.tsx
│   │   │   │   └── ExportButtons.tsx
│   │   │   ├── charts/
│   │   │   │   ├── TicketsChart.tsx
│   │   │   │   ├── FaturamentoChart.tsx
│   │   │   │   └── DistribuicaoChart.tsx
│   │   │   └── forms/
│   │   │       ├── EmpresaForm.tsx
│   │   │       └── ContatoForm.tsx
│   │   ├── api/
│   │   │   ├── client.ts (configuração axios)
│   │   │   ├── tickets.ts
│   │   │   ├── empresas.ts
│   │   │   ├── contatos.ts
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useFetch.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── types/
│   │   │   ├── index.ts (tipos globais)
│   │   │   ├── api.ts
│   │   │   └── models.ts
│   │   ├── styles/
│   │   │   └── globals.css (Tailwind + custom dark mode)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── .dockerignore
└── README.md
```

### 5.3 Fluxo de Autenticação
```
1. Usuário faz login (email + senha)
2. Backend valida e retorna JWT (24h expiração)
3. Frontend armazena JWT em localStorage
4. Cada request leva token no header: Authorization: Bearer <token>
5. Backend valida JWT e verifica role (admin/tecnico)
6. Response com dados filtrados por role
```

### 5.4 Padrões de Código
- **Backend:** FastAPI com dependency injection, type hints completos
- **Frontend:** React com hooks, TypeScript strict mode, componentes funcionais
- **BD:** Migrations com Alembic, schema versionado
- **API:** RESTful, status codes corretos, mensagens de erro consistentes

---

## 6. MAPA DE FASES DE IMPLEMENTAÇÃO

### **Fase 1: MVP - Tickets e Estrutura Básica** [SPRINT 1]
**Objetivo:** Ter sistema funcional para substituar HESK

- ✅ Setup completo (Docker, BD, estrutura)
- ✅ Models de: Empresa, Contato, Ticket, Categoria
- ✅ CRUD de Empresas e Contatos
- ✅ CRUD de Tickets (criar, listar, editar, fechar)
- ✅ Autenticação JWT (Admin + Técnico)
- ✅ UI básica: Login, Dashboard, Listagem de Tickets, Novo Ticket
- ✅ Dark mode implementado
- ✅ Validação de entrada

**Aceitação:** Sistema substitui 100% HESK para registro e gestão de tickets

---

### **Fase 2: Faturamento e Financeiro** [SPRINT 2]
**Objetivo:** Consolidar faturamento, substituir planilha manual

- ✅ Model de Faturamento
- ✅ Registrar valor ao fechar ticket
- ✅ Aba "Faturamento do Mês"
- ✅ Listagem com: Data, Solicitação, Serviço, Nº Chamado, Valor
- ✅ Cálculo automático de subtotais
- ✅ Exportar CSV (pronto para Excel/NF)
- ✅ Filtros por empresa e período
- ✅ Histórico de faturamento (meses anteriores)

**Aceitação:** Gera relatório de faturamento pronto para nota fiscal, sem reformatação manual

---

### **Fase 3: Relatórios e Gráficos** [SPRINT 3]
**Objetivo:** Visibilidade de KPIs e métricas

- ✅ Dashboard com widgets principais
- ✅ Gráficos: tickets por mês, distribuição por serviço, faturamento mensal
- ✅ Comparativo por empresa
- ✅ Tempo médio de resolução
- ✅ Tickets por status (abertos, atrasados)
- ✅ Relatório tabular de faturamento YTD

**Aceitação:** Dashboard fornece visibilidade completa de operações e financeiro

---

### **Fase 4: Recursos Avançados** [SPRINT 4+]
**Objetivo:** Escalabilidade e funcionalidades evoluídas

- ✅ Biblioteca de Problemas Recorrentes
- ✅ Anotações/Comentários em Tickets
- ✅ Histórico completo de alterações
- ✅ Templates de descrição reutilizáveis
- ✅ Filtros avançados e busca full-text
- ✅ Backup/Restauração manual
- ✅ Gerenciamento de múltiplos técnicos (roles)

**Aceitação:** Sistema preparado para adicionar técnicos, com funcionalidades extras

---

### **Fase 5: Migração HESK (FUTURO)**
**Objetivo:** Importar dados históricos do HESK

- ✅ Ferramenta de importação (lê BD HESK)
- ✅ Validação de dados
- ✅ Mapeamento de categorias
- ✅ Geração de relatório de migração
- ✅ Zeração de dados de teste

**Nota:** Será desenvolvida após Fase 4, não é bloqueante para MVP

---

## 7. CRITÉRIOS DE SUCESSO

### Métrica 1: Funcionalidade
- ✅ Substituir 100% das operações do HESK
- ✅ Zero perda de dados durante faturamento
- ✅ Gerar relatório de faturamento em < 1 minuto

### Métrica 2: Usabilidade
- ✅ Interface intuitiva (nova ticket em < 30 segundos)
- ✅ Dark mode confortável para uso prolongado
- ✅ Responsivo em desktop, tablet e mobile

### Métrica 3: Performance
- ✅ Carregamento das páginas < 3s
- ✅ Listagens com paginação eficiente
- ✅ Gráficos renderizam de forma suave

### Métrica 4: Confiabilidade
- ✅ Sistema robusto (sem crashes em uso normal)
- ✅ BD protegido contra falhas
- ✅ Logs claros para debug

### Métrica 5: Escalabilidade
- ✅ Pronto para adicionar novos técnicos
- ✅ Suporta até 100k tickets
- ✅ Arquitetura escalável para novas empresas

---

## 8. DECISÕES ARQUITETURAIS

| Decisão | Opção | Razão |
|---------|-------|-------|
| **BD** | PostgreSQL | Relações complexas, índices para performance, confiável |
| **Auth** | JWT | Simples, stateless, escalável, sem overhead de sessão |
| **API** | FastAPI | Type hints, validação automática, documentação OpenAPI, performance |
| **Frontend** | React + Tailwind | Ecossistema maduro, dark mode nativo, componentes ricos |
| **Gráficos** | Recharts | Leve, integra bem com React, suficiente para MVPs |
| **Deploy** | Docker Compose | Fácil de manter, reproduzível, pronto para produção |

---

## 9. RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|--------|-----------|
| Perda de dados durante migração | Média | Alto | Não migrar HESK na Fase 1, fazer depois com validação completa |
| Performance com muitos registros | Baixa | Alto | Índices no BD desde o início, paginação obrigatória |
| Autenticação comprometida | Baixa | Crítico | JWT com expiração, senhas hasheadas, HTTPS em produção |
| Técnico acessa dados que não deveria | Média | Médio | Validação de role em toda API, testes de segurança |
| Interface confusa para técnicos | Média | Médio | Design bem pensado, testes com usuários, documentação |

---

## 10. PRÓXIMAS ETAPAS

1. ✅ **Validação desta PRD** - Você confirma se está alinhado
2. ✅ **Criação dos Épicos formais** - Quebra em EPIC-001, EPIC-002, etc
3. ✅ **Design técnico** - @architect detalha arquitetura, migrations, endpoints
4. ✅ **Stories para cada epic** - @sm cria user stories com critérios de aceitação
5. ✅ **Desenvolvimento** - @dev implementa sprint a sprint
6. ✅ **QA e validação** - @qa testa cada feature
7. ✅ **Deploy** - @devops faz push para produção

---

**PRD FINALIZADO - PRONTO PARA VALIDAÇÃO E CRIAÇÃO DE ÉPICOS**


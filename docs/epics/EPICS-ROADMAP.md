# Épicos - Sistema de Gestão de Trabalho e Financeiro

**Status:** Estruturando
**Última Atualização:** 2026-02-21

---

## ROADMAP EXECUTIVO

```
EPIC-1 [MVP Tickets]              SPRINT 1       [ ======== ]
           ↓
EPIC-2 [Faturamento]              SPRINT 2       [    ======== ]
           ↓
EPIC-3 [Relatórios & Gráficos]    SPRINT 3       [       ======== ]
           ↓
EPIC-4 [Recursos Avançados]       SPRINT 4+      [            ======== ]
```

---

## EPIC-1: MVP - TICKETS E ESTRUTURA BASE

**ID:** EPIC-1
**Status:** Planejado
**Prioridade:** CRÍTICA
**Sprint:** 1
**Owner:** @dev (Dex)
**Validador:** @qa (Quinn)

### Objetivo
Ter sistema funcional que **substitua 100% do HESK** para gestão de tickets e operações básicas.

### Escopo IN
- ✅ Setup completo (Docker, PostgreSQL, estrutura)
- ✅ Autenticação JWT (Admin + Técnico)
- ✅ CRUD de Empresas
- ✅ CRUD de Contatos
- ✅ CRUD de Tickets (criar, listar, editar, fechar)
- ✅ Dashboard com resumo básico
- ✅ Dark mode em toda interface
- ✅ Categorias de Serviço
- ✅ Validação de entrada e regras de negócio

### Escopo OUT
- ❌ Faturamento (vai para EPIC-2)
- ❌ Gráficos e relatórios (vai para EPIC-3)
- ❌ Problemas recorrentes (vai para EPIC-4)
- ❌ Migração HESK (vai para Fase 5 futura)

### Requisitos Técnicos
- Backend: FastAPI com SQLAlchemy, PostgreSQL, JWT
- Frontend: React 18 + TypeScript + Tailwind dark mode
- API: RESTful, type-safe, documentação automática
- BD: Migrations com Alembic, schema versionado
- DevOps: Docker Compose, pronto para dev/prod

### Critério de Aceitação
1. ✅ Sistema roda com `docker-compose up`
2. ✅ Pode-se criar empresa, contato e ticket sem HESK
3. ✅ Dashboard mostra resumo de tickets (abertos, hoje, atrasados)
4. ✅ Autenticação funciona (admin vê tudo, técnico vê só tickets)
5. ✅ Todos os CRUD funcionam completamente
6. ✅ Interface é dark mode nativa (não tema)
7. ✅ Sem erros ou crashes em uso normal
8. ✅ Logs estruturados para debug

### Breakdown em Stories
```
EPIC-1 will be broken down into:
- STORY-1.1: Setup Backend (FastAPI + DB + Models)
- STORY-1.2: Setup Frontend (React + Tailwind + Dark Mode)
- STORY-1.3: Autenticação (JWT + Login + Roles)
- STORY-1.4: CRUD Empresas
- STORY-1.5: CRUD Contatos
- STORY-1.6: CRUD Tickets (Criar)
- STORY-1.7: CRUD Tickets (Listar, Editar, Fechar)
- STORY-1.8: Dashboard MVP
- STORY-1.9: Validação e Tratamento de Erros
- STORY-1.10: Integração Frontend-Backend e Testes
```

### Dependências
- Nenhuma (é o épico inicial)

### Timeline
- **Estimativa:** 3-4 semanas
- **Início:** Imediato
- **Fim planejado:** Fim de Semana 1 ou Início de Semana 2

---

## EPIC-2: FATURAMENTO E GESTÃO FINANCEIRA

**ID:** EPIC-2
**Status:** Aguardando EPIC-1
**Prioridade:** ALTA
**Sprint:** 2
**Owner:** @dev (Dex)
**Validador:** @qa (Quinn)

### Objetivo
Centralizar faturamento e substituir completamente a **planilha manual mensal**.

### Escopo IN
- ✅ Model de Faturamento (valores, datas, status)
- ✅ Registrar valor cobrado ao fechar ticket
- ✅ Editar valor depois de registrado
- ✅ Aba "Faturamento do Mês"
- ✅ Listagem com: Data, Solicitação, Serviço, Nº Chamado, Valor
- ✅ Subtotal automático
- ✅ Filtro por empresa
- ✅ Filtro por período (mês/ano)
- ✅ Marcar como "faturado"
- ✅ Exportar CSV (pronto para NF)
- ✅ Exportar JSON (futura integração)
- ✅ Histórico de faturamento (meses anteriores)

### Escopo OUT
- ❌ Integração com sistema de NF (data futura)
- ❌ Integração com sistema contábil (data futura)
- ❌ Cálculo de impostos (manual por enquanto)

### Requisitos Técnicos
- API: endpoints para faturamento, filtros, exports
- BD: migrations para tabela de faturamento, índices
- Frontend: componentes de tabela, filtros, botões de export
- Exportação: CSV via Pandas, JSON nativo

### Critério de Aceitação
1. ✅ Pode registrar valor ao fechar ticket
2. ✅ Pode editar valor depois
3. ✅ Aba mostra todos os tickets de um mês com valores
4. ✅ Calcula subtotal e total automaticamente
5. ✅ Exporta CSV idêntico ao que você faz em planilha
6. ✅ Filtra por empresa e período
7. ✅ Mostra histórico de meses anteriores
8. ✅ Status "faturado" pode ser marcado e filtrado

### Breakdown em Stories
```
- STORY-2.1: Model e API de Faturamento
- STORY-2.2: Registrar Valor no Ticket
- STORY-2.3: Interface Faturamento do Mês
- STORY-2.4: Filtros e Buscas
- STORY-2.5: Cálculo de Totais
- STORY-2.6: Exportar CSV e JSON
- STORY-2.7: Histórico de Faturamento
- STORY-2.8: Testes e Validação
```

### Dependências
- ✅ **Bloqueado por:** EPIC-1 (precisa de tickets funcional)

### Timeline
- **Estimativa:** 2-3 semanas
- **Início:** Após EPIC-1 completo
- **Fim planejado:** Fim de Semana 2 ou Início de Semana 3

---

## EPIC-3: RELATÓRIOS E GRÁFICOS

**ID:** EPIC-3
**Status:** Aguardando EPIC-2
**Prioridade:** ALTA
**Sprint:** 3
**Owner:** @dev (Dex)
**Validador:** @qa (Quinn)

### Objetivo
Fornecer visibilidade completa de KPIs, métricas e desempenho operacional.

### Escopo IN
- ✅ Dashboard com widgets principais
- ✅ Resumo: tickets abertos, tickets hoje, tickets atrasados
- ✅ Total faturado no mês
- ✅ Total faturado YTD (year-to-date)
- ✅ Últimos 5 tickets
- ✅ Gráfico: quantidade de tickets por mês (linha/coluna)
- ✅ Gráfico: distribuição por tipo de serviço (pizza)
- ✅ Gráfico: total faturado por mês (barras)
- ✅ Gráfico: tickets por empresa (comparativo)
- ✅ Gráfico: tempo médio de resolução
- ✅ Relatório tabular: histórico de faturamento
- ✅ Relatório tabular: tickets por status

### Escopo OUT
- ❌ Alertas/notificações de SLA (futuro)
- ❌ Previsão de faturamento (futuro)
- ❌ Dashboards customizáveis (futuro)

### Requisitos Técnicos
- Backend: endpoints de agregação, cálculos de KPIs
- Frontend: Recharts para gráficos, componentes de dashboard
- BD: índices para queries de relatório (performance)
- API: filtros por período, empresa, categoria

### Critério de Aceitação
1. ✅ Dashboard carrega em < 3s
2. ✅ Todos os 5 gráficos funcionam e mostram dados corretos
3. ✅ Filtros funcionam (período, empresa)
4. ✅ Números são precisos (validated com SQL direto)
5. ✅ Gráficos são legíveis em dark mode
6. ✅ Relatórios tabulares exportam corretamente

### Breakdown em Stories
```
- STORY-3.1: Dashboard MVP (widgets básicos)
- STORY-3.2: Gráficos de Tickets (linha, coluna)
- STORY-3.3: Gráfico de Faturamento (barras, pizza)
- STORY-3.4: Gráficos de Performance (tempo, comparativo)
- STORY-3.5: Relatórios Tabulares
- STORY-3.6: Filtros e Períodos
- STORY-3.7: Performance e Otimizações
- STORY-3.8: Testes e Validação
```

### Dependências
- ✅ **Bloqueado por:** EPIC-2 (precisa de faturamento com dados)

### Timeline
- **Estimativa:** 2-3 semanas
- **Início:** Após EPIC-2 completo
- **Fim planejado:** Fim de Semana 3 ou Início de Semana 4

---

## EPIC-4: RECURSOS AVANÇADOS

**ID:** EPIC-4
**Status:** Aguardando EPIC-3
**Prioridade:** MÉDIA
**Sprint:** 4+
**Owner:** @dev (Dex)
**Validador:** @qa (Quinn)

### Objetivo
Adicionar funcionalidades evoluídas e preparar para escala com múltiplos técnicos.

### Escopo IN
- ✅ Biblioteca de Problemas Recorrentes
- ✅ Vincular problema ao ticket
- ✅ Histórico de uso de problemas
- ✅ Anotações/Comentários em tickets
- ✅ Histórico completo de alterações (audit trail)
- ✅ Templates de descrição reutilizáveis
- ✅ Filtros avançados (AND/OR)
- ✅ Busca full-text em descrições
- ✅ Gestão de múltiplos técnicos com permissões
- ✅ Backup/Restauração manual de dados
- ✅ Logs de auditoria (quem fez o quê e quando)

### Escopo OUT
- ❌ Integração com HESK (vai para Fase 5)
- ❌ Agendamento de manutenção preventiva (futuro)
- ❌ Notificações automáticas (futuro)

### Requisitos Técnicos
- Backend: API para problemas, anotações, audit trail
- Frontend: componentes para gerenciar problemas, comentários
- BD: tabelas para problemas, anotações, audit log
- Busca: índices full-text no PostgreSQL

### Critério de Aceitação
1. ✅ Pode criar e reutilizar problemas
2. ✅ Anotações aparecem cronologicamente no ticket
3. ✅ Histórico mostra todas as mudanças com autor e timestamp
4. ✅ Busca full-text funciona em descrições
5. ✅ Múltiplos técnicos podem ter permissões diferentes
6. ✅ Pode fazer backup/restaurar dados
7. ✅ Audit log mostra todas as operações críticas

### Breakdown em Stories
```
- STORY-4.1: Model e API de Problemas
- STORY-4.2: Interface de Problemas
- STORY-4.3: Anotações e Comentários
- STORY-4.4: Histórico de Alterações (Audit Trail)
- STORY-4.5: Busca Full-Text
- STORY-4.6: Templates de Descrição
- STORY-4.7: Gestão de Múltiplos Técnicos
- STORY-4.8: Backup/Restauração
- STORY-4.9: Testes e Validação
```

### Dependências
- ✅ **Bloqueado por:** EPIC-3 (deve haver base sólida)

### Timeline
- **Estimativa:** 3-4 semanas
- **Início:** Após EPIC-3 completo
- **Fim planejado:** Fim de Semana 4 ou Semana 5

---

## ROADMAP FUTURO (FORA DO ESCOPO INICIAL)

### EPIC-5: Migração do HESK [FUTURO - Fase 5]
- Importar dados históricos do HESK
- Validação e mapeamento de categorias
- Relatório de migração
- Zeração de dados de teste
- **Estimativa:** 2 semanas
- **Pré-requisito:** EPIC-4 completo

### EPIC-6: Integrações Avançadas [FUTURO]
- Integração com HESK via API
- Integração com sistema contábil
- Notificações por email
- Agendamento de manutenção

---

## RESUMO DE DEPENDÊNCIAS

```
EPIC-1 (MVP Tickets)
   ↓
EPIC-2 (Faturamento)
   ↓
EPIC-3 (Relatórios)
   ↓
EPIC-4 (Recursos Avançados)
   ↓
EPIC-5 (Migração HESK - FUTURO)
```

**Visão:** Cada épico é independente funcionalidade-wise, mas aproveita a base do anterior. Não há paralelismo inicial, mas há possibilidade de parallelizar EPIC-1 e 2 se necessário.

---

## PROCESSO DE TRABALHO

### Para cada épico:
1. ✅ **Planejamento:** Detalhar escopo, requisitos, dependências
2. ✅ **Design:** @architect faz design técnico, migrations, endpoints
3. ✅ **Criação de Stories:** @sm cria user stories com AC claros
4. ✅ **Desenvolvimento:** @dev implementa story por story
5. ✅ **QA:** @qa testa cada feature com AC
6. ✅ **Validação:** Você valida funcionalidade
7. ✅ **Deploy:** @devops faz push para produção

### Checkpoints:
- **Fim de EPIC-1:** Sistema substitui HESK ✅
- **Fim de EPIC-2:** Planilha manual aposentada ✅
- **Fim de EPIC-3:** Dashboard e relatórios funcionais ✅
- **Fim de EPIC-4:** Sistema pronto para escalar ✅

---

**ROADMAP FINALIZADO - PRONTO PARA INICIAR EPIC-1**


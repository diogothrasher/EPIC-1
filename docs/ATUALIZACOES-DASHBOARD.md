# Atualizações - Especificação Dashboard

**Data:** 21 de Fevereiro de 2026
**Status:** ✅ Incorporadas ao PRD e Documentação

---

## O QUE FOI ALTERADO

### ✅ PRD Atualizado
Seção 3.7 (Relatórios e Gráficos) foi expandida e detalhada com:

**Antes:**
```
FR-REP-001: Resumo em cards: tickets abertos, tickets hoje, tickets atrasados
FR-REP-004: Últimos 5 tickets atendidos
```

**Agora:**
```
FR-REP-002: 2 TABELAS INLINE EM DESTAQUE (Abertos + Em Andamento)
  - Cada tabela mostra Nº, Empresa, Descrição, Tempo Decorrido
  - Cores diferentes (Vermelho/Amarelo)
  - Ao clicar → MODAL EXPANDIDO abre

FR-REP-003: Modal com 3 ABAS (Abertos | Em Andamento | Fechados)
  - Filtros avançados: Empresa, Busca, Data, Categoria
  - Paginação 20 linhas
  - Ações rápidas: Abrir, Mudar Status
```

---

## LAYOUT DO DASHBOARD (VISUAL)

### Dashboard Principal:
```
┌─ Resumo Cards (Faturado Mês, Faturado YTD, Tickets Hoje)
│
├─ 🔴 TABELA: Tickets Abertos (10/85 total)
│   └─ Clique: Abre Modal
│
├─ 🟡 TABELA: Tickets Em Andamento (10/42 total)
│   └─ Clique: Abre Modal
│
├─ Gráficos (4 gráficos de análise)
│
└─ Relatórios (Histórico de faturamento)

Modal Expandido (ao clicar):
├─ Abas: [🔴 Abertos (85)] [🟡 Em And. (42)] [🟢 Fechados (234)]
├─ Filtros: Empresa, Descrição, Data, Categoria, Ordenação
├─ Tabela: 20 linhas por página (paginação)
├─ Ações: Abrir, Mudar Status, Menu (⋯)
└─ Busca: Persistente ao trocar de aba
```

---

## ESPECIFICAÇÕES DETALHADAS

### Tabelas Inline

| Aspecto | Especificação |
|---------|--------------|
| **Visibilidade** | Destaque máximo no dashboard (primeiro elemento após cards) |
| **Linhas** | Máximo 10 linhas, com scroll ou link "Ver Todos" |
| **Colunas** | Nº, Empresa, Descrição (resumida), Tempo Decorrido, Ações |
| **Cores** | Vermelho (#EF4444) para Abertos, Amarelo (#FBBF24) para Em And. |
| **Tempo Decorrido** | Humano: "5 dias 3h", "2 horas", "23 minutos" (atualiza dinamicamente) |
| **Interação** | Clique em qualquer lugar da linha abre modal/ticket |
| **Ações Rápidas** | Menu [⋯] com: Abrir, Mudar Status, Editar, Histórico |

### Modal Expandido

| Aspecto | Especificação |
|---------|--------------|
| **Abas** | 3 abas: Abertos, Em Andamento, Fechados (cada uma tem seus filtros) |
| **Filtros** | Empresa (dropdown), Descrição (busca), Data (range), Categoria (dropdown) |
| **Busca** | Full-text, time real (debounce 300ms), persistente entre abas |
| **Ordenação** | Mais antigos, Mais recentes, Por empresa, Por tempo crescente/decrescente |
| **Paginação** | 20 linhas por página, total no rodapé "Mostrando X-Y de Z" |
| **Clic na Linha** | Abre página completa do ticket em nova página |
| **Tamanho** | 90% viewport (desktop), 95% (tablet), fullscreen (mobile) |

### Comportamentos

| Ação | Resultado |
|------|-----------|
| Clica "Ver Todos" em tabela | Modal abre na aba correspondente |
| Clica em linha da tabela | Abre página completa do ticket |
| Muda status no modal | Ticket sai da aba e entra em outra (automático) |
| Aplica filtro | Modal recarrega tabela em < 1s (debounce) |
| Troca de aba | Filtros são mantidos |
| Volta para dashboard | Dashboard atualiza números (refresh automático) |

---

## RESPONSIVIDADE

### Desktop (1200px+)
```
┌─────────────────────────────────────────────┐
│ Tabela Abertos  │  Tabela Em Andamento     │
│                 │                          │
└─────────────────────────────────────────────┘
```

### Tablet (768px - 1199px)
```
┌──────────────────────────────────────┐
│ Tabela Abertos                       │
├──────────────────────────────────────┤
│ Tabela Em Andamento                  │
└──────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌────────────────────┐
│ Tabela Abertos     │
│ (card view, scroll)│
├────────────────────┤
│ Tabela Em And.     │
│ (card view, scroll)│
└────────────────────┘

Modal: Fullscreen com tabs colapsáveis
```

---

## PERFORMANCE TARGETS

| Métrica | Target |
|---------|--------|
| Dashboard carrega | < 3 segundos |
| Modal abre | < 1 segundo |
| Filtro responde | < 500ms (debounce 300ms) |
| Busca full-text | < 1 segundo |
| Tabela renderiza (20 linhas) | < 500ms |
| Gráficos renderizam | < 2 segundos |
| Tempo decorrido atualiza | A cada 1 minuto (ou dinâmico) |

---

## MUDANÇAS NO ROADMAP

### EPIC-1 (MVP) - Nova Story

**STORY-1.8.1: Dashboard com Tabelas Inline**
- Requisitos:
  * 2 tabelas destacadas (Abertos + Em Andamento)
  * Cores diferentes
  * Tempo decorrido calculado
  * Clique abre modal expandido
  * Ações rápidas (menu)
  * Responsivo em mobile

**STORY-1.8.2: Modal Expandido com Filtros**
- Requisitos:
  * 3 abas (Abertos, Em Andamento, Fechados)
  * Filtros: Empresa, Descrição, Data, Categoria
  * Busca full-text persistente
  * Paginação 20 linhas
  * Ações rápidas no modal
  * Sincronização com dashboard

---

## COMPONENTES REACT (FRONTEND)

Novos componentes a implementar:

```
src/components/
├── dashboard/
│   ├── DashboardPage.tsx ✓ (existente, será atualizado)
│   ├── TicketTableInline.tsx (NOVO)
│   │   ├── TicketRow.tsx (NOVO)
│   │   └── ActionMenu.tsx (NOVO)
│   ├── TimeElapsed.tsx (NOVO - atualiza dinamicamente)
│   └── TicketModalExpanded.tsx (NOVO)
│       ├── FilterBar.tsx (NOVO)
│       ├── TabsSelector.tsx (NOVO)
│       └── PaginationControls.tsx (NOVO)
```

---

## ENDPOINTS API (BACKEND)

APIs necessárias (ou ajustadas):

```
GET /api/tickets?status=aberto&limit=10
GET /api/tickets?status=em_andamento&limit=10
GET /api/tickets?status=aberto&empresa=frutty&search=erro&date_from=2026-01-01&date_to=2026-02-21&limit=20&offset=0
GET /api/tickets/{id}
PATCH /api/tickets/{id}/status (mudar status rápido)
```

---

## VALIDAÇÃO DO USUÁRIO

Se tudo está OK com o dashboard:

✅ Dashboard com 2 tabelas inline (Abertos + Em Andamento)
✅ Tabelas com cores diferentes (vermelho/amarelo)
✅ Tempo decorrido dinâmico
✅ Clique abre modal com 3 abas
✅ Filtros avançados no modal
✅ Ações rápidas (mudar status)
✅ Responsivo (desktop, tablet, mobile)
✅ Performance (< 3s dashboard, < 1s modal)

---

## PRÓXIMOS PASSOS

1. ✅ Você confirma: **"Dashboard está OK!"**
2. ✅ @architect detalha componentes React e endpoints
3. ✅ @sm cria stories refinadas com esses componentes
4. ✅ @dev implementa STORY-1.8.1 e STORY-1.8.2
5. ✅ @qa testa com AC claros
6. ✅ Deploy em EPIC-1

---

## DOCUMENTAÇÃO ATUALIZADA

| Arquivo | Status |
|---------|--------|
| `docs/prd/SISTEMA-GESTAO-DIOGO-PRD.md` | ✅ Atualizado |
| `docs/epics/EPICS-ROADMAP.md` | ⏳ Será atualizado |
| `docs/design/DASHBOARD-LAYOUT.md` | ✅ Criado |
| `docs/ATUALIZACOES-DASHBOARD.md` | ✅ Este arquivo |

---

**TUDO PRONTO PARA DESENVOLVIMENTO**


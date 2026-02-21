# Dashboard MVP - STORY-1.8 Implementation Guide

## Overview

Complete Dashboard MVP implementation with:
- 5 API modules (Empresas, Contatos, Tickets, Categorias, Dashboard)
- 9 reusable dashboard components
- 4 new pages (Dashboard, Empresas, Contatos, Tickets, TicketDetail)
- Full responsive design (desktop/tablet/mobile)
- Dark theme with Tailwind CSS

## Quick Start

### Installation
```bash
cd frontend
npm install
npm run dev
```

### Build & Tests
```bash
npm run build      # TypeScript + Vite build
npm run typecheck  # Type checking
npm run lint       # ESLint
npm test           # Vitest
```

## API Modules

All modules are in `/src/api/` with full type safety.

### Empresas API
```typescript
import { empresasApi, Empresa } from '@/api'

await empresasApi.getAll()              // GET /empresas
await empresasApi.getById(id)           // GET /empresas/:id
await empresasApi.create(data)          // POST /empresas
await empresasApi.update(id, data)      // PUT /empresas/:id
await empresasApi.delete(id)            // DELETE /empresas/:id
```

### Contatos API
```typescript
import { contatosApi, Contato } from '@/api'

await contatosApi.getAll()
await contatosApi.getById(id)
await contatosApi.getByEmpresa(empresaId)  // New: Filter by empresa
await contatosApi.create(data)
await contatosApi.update(id, data)
await contatosApi.delete(id)
```

### Tickets API
```typescript
import { ticketsApi, Ticket } from '@/api'

await ticketsApi.getAll()
await ticketsApi.getById(id)
await ticketsApi.getByStatus(status)       // 'aberto' | 'em_andamento' | 'fechado'
await ticketsApi.getByEmpresa(empresaId)
await ticketsApi.create(data)
await ticketsApi.update(id, data)
await ticketsApi.delete(id)
```

### Categorias API
```typescript
import { categoriasApi, Categoria } from '@/api'

await categoriasApi.getAll()
await categoriasApi.getById(id)
await categoriasApi.create(data)
await categoriasApi.update(id, data)
await categoriasApi.delete(id)
```

### Dashboard API
```typescript
import { dashboardApi, DashboardStats } from '@/api'

await dashboardApi.getStats()          // DashboardStats object
await dashboardApi.getFullData()       // Full dashboard data with tickets
await dashboardApi.getTicketsRecentes(limit) // GET /dashboard/tickets-recentes
```

## Components

### TicketSummaryCards
Display summary statistics in card format.

```typescript
<TicketSummaryCards
  faturadoMes={1200.50}
  faturadoYTD={8500.00}
  ticketsHoje={5}
  isLoading={false}
/>
```

**Props:**
- `faturadoMes: number` - Revenue for current month
- `faturadoYTD: number` - Revenue year to date
- `ticketsHoje: number` - Tickets created today
- `isLoading?: boolean` - Loading state

### TicketTableInline
Responsive ticket table (desktop) / card view (mobile).

```typescript
<TicketTableInline
  tickets={tickets}
  empresas={empresasMap}
  onViewTicket={(id) => handleView(id)}
  onEditTicket={(id) => handleEdit(id)}
  onDeleteTicket={(id) => handleDelete(id)}
  isLoading={false}
  isCompact={isMobile}
/>
```

**Props:**
- `tickets: Ticket[]` - Array of tickets
- `empresas?: Record<string, string>` - Empresa name mapping
- `onViewTicket?: (id) => void` - View handler
- `onEditTicket?: (id) => void` - Edit handler
- `onDeleteTicket?: (id) => void` - Delete handler
- `isLoading?: boolean` - Loading state
- `isCompact?: boolean` - Mobile view

### TicketRow
Individual ticket row component (used by TicketTableInline).

```typescript
<TicketRow
  ticket={ticket}
  empresaNome="Acme Corp"
  onView={() => {}}
  onEdit={() => {}}
  onDelete={() => {}}
  isCompact={false}
/>
```

### TimeElapsed
Display time elapsed since ticket creation (updates every minute).

```typescript
<TimeElapsed startDate="2024-02-21T10:30:00Z" />
// Displays: "2h 30m" or "15m 45s" or "3d 2h"
```

### ActionMenu
Context menu with actions (Visualizar, Editar, Deletar).

```typescript
<ActionMenu
  items={[
    { label: 'Visualizar', icon: '👁️', onClick: handleView },
    { label: 'Editar', icon: '✏️', onClick: handleEdit },
    { label: 'Deletar', icon: '🗑️', onClick: handleDelete, color: 'danger' }
  ]}
  onOpen={() => console.log('Menu opened')}
/>
```

### TicketModalExpanded
3-tab modal for ticket details (Detalhes, Histórico, Notas).

```typescript
<TicketModalExpanded
  ticket={selectedTicket}
  isOpen={true}
  onClose={() => setOpen(false)}
  onSave={(data) => handleSave(data)}
  isLoading={false}
/>
```

**Features:**
- Responsive sizing (90vw desktop, 95vw tablet, fullscreen mobile)
- Editable fields in "Detalhes" tab
- Status, valor faturado, descrição
- Tab navigation

### FilterBar
Debounced filter inputs (300ms debounce).

```typescript
<FilterBar
  onFilterChange={(filters) => handleFilter(filters)}
  empresas={empresas}
  categorias={categorias}
  debounceMs={300}
/>
```

**Filters:**
- Empresa (select)
- Descrição (text)
- Categoria (select)
- Data Início (date)
- Data Fim (date)

### TabsSelector
Status tabs (Abertos, Em Andamento, Fechados) with counts.

```typescript
<TabsSelector
  activeTab="abertos"
  onTabChange={(tab) => handleTab(tab)}
  counts={{
    abertos: 5,
    em_andamento: 3,
    fechados: 12
  }}
  isLoading={false}
/>
```

### PaginationControls
20 items per page pagination.

```typescript
<PaginationControls
  currentPage={1}
  totalPages={5}
  pageSize={20}
  totalItems={98}
  onPageChange={(page) => handlePageChange(page)}
  onPageSizeChange={(size) => handlePageSizeChange(size)}
/>
```

## Pages

### DashboardPage
Main dashboard with stats, recent tickets, tabs, and modal.

**Route:** `/`

**Features:**
- Summary cards (Faturado Mês, YTD, Tickets Hoje)
- Recent tickets (limited to 5)
- Status tabs with counts
- Ticket modal with editing
- Responsive layout

### EmpresasPage
Companies list table.

**Route:** `/empresas`

**Features:**
- Table with Nome, CNPJ, Email, Telefone
- Error handling
- Loading state

### ContatosPage
Contacts list table.

**Route:** `/contatos`

**Features:**
- Table with Nome, Email, Telefone, Cargo
- Error handling
- Loading state

### TicketsPage
Full tickets management with all features.

**Route:** `/tickets`

**Features:**
- FilterBar for all criteria
- Status tabs (Abertos, Em Andamento, Fechados)
- Responsive table/cards
- Pagination (20 per page)
- Modal for editing
- Delete with confirmation

### TicketDetailPage
Individual ticket detail view.

**Route:** `/tickets/:id`

**Features:**
- Full ticket information
- Back button
- Error handling

## Responsive Design

### Desktop (1024px+)
- Full table layout with all columns
- Modal 90% viewport width
- Summary cards in 3-column grid
- Sidebar navigation

### Tablet (640px-1023px)
- Responsive grid (2-3 columns)
- Modal 95% viewport width
- Stacked card layouts
- Touch-friendly buttons

### Mobile (<640px)
- Card view for tickets
- Modal fullscreen
- Single column layouts
- Hamburger menu ready
- Touch-optimized spacing

## Color Scheme

**Status Colors:**
- 🔴 Aberto: `#EF4444` (red-400)
- 🟡 Em Andamento: `#FBBF24` (yellow-400)
- 🟢 Fechado: `#22C55E` (green-400)

**Dark Theme:**
- Background: `#1a1a1a` (dark-card)
- Border: `#333333` (dark-border)
- Text: `#ffffff` (white)
- Muted: `#999999` (dark-muted)
- Primary: Brand blue

## TypeScript Types

All components and APIs are fully typed:

```typescript
interface Ticket {
  id: string
  descricao: string
  status: 'aberto' | 'em_andamento' | 'fechado'
  empresaId: string
  contatoId: string
  categoriaId?: string
  valorFaturado?: number
  dataAbertura: string
  dataFechamento?: string
  createdAt?: string
  updatedAt?: string
}

interface DashboardStats {
  faturadoMes: number
  faturadoYTD: number
  ticketsHoje: number
  ticketsAbertos: number
  ticketsEmAndamento: number
  ticketsFechados: number
}
```

## Localization

- **Dates:** Brazilian format (DD/MM/YYYY)
- **Currency:** Brazilian Real (R$) with comma decimal
- **Language:** Portuguese (pt-BR)

## Error Handling

All API calls include error handling:
- 401 Unauthorized → Redirect to `/login`
- Network errors → User-friendly error messages
- Loading states for all async operations

## Performance

- Debounced filters (300ms)
- Time elapsed updates every 60 seconds
- Modal lazy loading
- Component memoization ready
- Pagination (20 items/page)

## Testing

### Unit Tests
```bash
npm test
```

### Build Check
```bash
npm run build
npm run typecheck
```

## Git History

```
b2d6505 feat: implement STORY-1.8 Dashboard MVP with full API and UI components
753ffc0 feat: Setup inicial - PRD, Épicos, Design Técnico e User Stories do EPIC-1
```

## Files Created

### API Modules (6 files)
- `/src/api/client.ts` - Axios client with interceptors
- `/src/api/empresas.ts` - Companies CRUD
- `/src/api/contatos.ts` - Contacts CRUD
- `/src/api/tickets.ts` - Tickets CRUD
- `/src/api/categorias.ts` - Categories CRUD
- `/src/api/dashboard.ts` - Dashboard stats
- `/src/api/index.ts` - Barrel export

### Components (10 files)
- `/src/components/dashboard/TicketSummaryCards.tsx`
- `/src/components/dashboard/TicketTableInline.tsx`
- `/src/components/dashboard/TicketRow.tsx`
- `/src/components/dashboard/TimeElapsed.tsx`
- `/src/components/dashboard/ActionMenu.tsx`
- `/src/components/dashboard/TicketModalExpanded.tsx`
- `/src/components/dashboard/FilterBar.tsx`
- `/src/components/dashboard/TabsSelector.tsx`
- `/src/components/dashboard/PaginationControls.tsx`
- `/src/components/dashboard/index.ts`

### Pages (5 files)
- `/src/pages/DashboardPage.tsx`
- `/src/pages/EmpresasPage.tsx`
- `/src/pages/ContatosPage.tsx`
- `/src/pages/TicketsPage.tsx`
- `/src/pages/TicketDetailPage.tsx`

### Updated Files
- `/src/App.tsx` - New routes added
- `vite.config.ts` - Path alias configuration

## Next Steps

1. **Backend Integration** - Implement matching API endpoints
2. **Mock Data** - Use JSON fixtures for development
3. **Tests** - Add unit and E2E tests
4. **Performance** - Add React.memo, useMemo as needed
5. **Accessibility** - Add ARIA labels and keyboard navigation

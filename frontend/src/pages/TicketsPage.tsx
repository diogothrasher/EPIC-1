import React, { useState, useEffect } from 'react'
import { ticketsApi, Ticket, TicketCreateInput } from '@/api/tickets'
import { empresasApi, Empresa } from '@/api/empresas'
import { categoriasApi, Categoria } from '@/api/categorias'
import { contatosApi, Contato } from '@/api/contatos'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useConfirm } from '@/context/ConfirmContext'
import FilterBar, { FilterValues } from '@/components/dashboard/FilterBar'
import TabsSelector, { TabType } from '@/components/dashboard/TabsSelector'
import TicketTableInline from '@/components/dashboard/TicketTableInline'
import TicketModalExpanded from '@/components/dashboard/TicketModalExpanded'
import PaginationControls from '@/components/dashboard/PaginationControls'
import { Plus } from 'lucide-react'

const TicketsPage: React.FC = () => {
  const { isMobile } = useBreakpoint()
  const { showConfirm } = useConfirm()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [selectedTab, setSelectedTab] = useState<TabType>('abertos')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [filters, setFilters] = useState<FilterValues>({})
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [contatos, setContatos] = useState<Contato[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [empresasMap, setEmpresasMap] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({})
  const [newTicket, setNewTicket] = useState<TicketCreateInput>({
    empresaId: '',
    contatoId: '',
    categoriaId: '',
    titulo: '',
    descricao: '',
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const [ticketsData, empresasData, categoriasData, contatosData] = await Promise.all([
        ticketsApi.getAll(),
        empresasApi.getAll(),
        categoriasApi.getAll(),
        contatosApi.getAll(),
      ])

      setTickets(ticketsData)
      setEmpresas(empresasData)
      setCategorias(categoriasData)
      setContatos(contatosData)

      const empMap = empresasData.reduce(
        (acc: Record<string, string>, emp: Empresa) => {
          acc[emp.id] = emp.nome
          return acc
        },
        {}
      )
      setEmpresasMap(empMap)

      applyFilters(ticketsData, selectedTab, filters)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = (
    data: Ticket[],
    tab: TabType,
    filterValues: FilterValues
  ) => {
    let result = data

    // Filter by tab/status
    switch (tab) {
      case 'abertos':
        result = result.filter((t) => t.status === 'aberto')
        break
      case 'em_andamento':
        result = result.filter((t) => t.status === 'em_andamento')
        break
      case 'fechados':
        result = result.filter((t) => t.status === 'fechado')
        break
    }

    // Apply additional filters
    if (filterValues.empresa) {
      result = result.filter((t) => t.empresaId === filterValues.empresa)
    }
    if (filterValues.descricao) {
      result = result.filter((t) =>
        t.descricao
          .toLowerCase()
          .includes(filterValues.descricao?.toLowerCase() || '')
      )
    }
    if (filterValues.categoria) {
      result = result.filter((t) => t.categoriaId === filterValues.categoria)
    }

    setFilteredTickets(result)
    setCurrentPage(1)
  }

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab)
    applyFilters(tickets, tab, filters)
  }

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
    applyFilters(tickets, selectedTab, newFilters)
  }

  const handleViewTicket = (id: string) => {
    const ticket = filteredTickets.find((t) => t.id === id)
    if (ticket) {
      setSelectedTicket(ticket)
      setIsModalOpen(true)
    }
  }

  const handleSaveTicket = async (updatedTicket: Partial<Ticket>) => {
    if (!selectedTicket) return

    try {
      await ticketsApi.update(selectedTicket.id, updatedTicket)
      await loadInitialData()
      setIsModalOpen(false)
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar ticket')
    }
  }

  const handleDeleteTicket = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Deletar Ticket',
      message: 'Tem certeza que deseja deletar este ticket? Esta ação não pode ser desfeita.',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      isDangerous: true,
    })

    if (!confirmed) return

    try {
      await ticketsApi.delete(id)
      await loadInitialData()
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar ticket')
    }
  }

  const validateCreateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!newTicket.empresaId) errors.empresaId = 'Selecione uma empresa'
    if (!newTicket.contatoId) errors.contatoId = 'Selecione um contato'
    if (!newTicket.categoriaId) errors.categoriaId = 'Selecione uma categoria'
    if (!newTicket.titulo.trim() || newTicket.titulo.trim().length < 5) {
      errors.titulo = 'Título deve ter no mínimo 5 caracteres'
    }
    if (!newTicket.descricao.trim() || newTicket.descricao.trim().length < 10) {
      errors.descricao = 'Descrição deve ter no mínimo 10 caracteres'
    }

    setCreateErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateTicket = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateCreateForm()) return

    try {
      setIsCreating(true)
      setError(null)
      await ticketsApi.create({
        ...newTicket,
        titulo: newTicket.titulo.trim(),
        descricao: newTicket.descricao.trim(),
      })
      setShowCreateForm(false)
      setCreateErrors({})
      setNewTicket({
        empresaId: '',
        contatoId: '',
        categoriaId: '',
        titulo: '',
        descricao: '',
      })
      await loadInitialData()
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Erro ao abrir chamado')
    } finally {
      setIsCreating(false)
    }
  }

  const contatosDaEmpresa = newTicket.empresaId
    ? contatos.filter((contato) => contato.empresaId === newTicket.empresaId)
    : contatos

  const totalPages = Math.ceil(filteredTickets.length / pageSize)
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const counts = {
    abertos: tickets.filter((t) => t.status === 'aberto').length,
    em_andamento: tickets.filter((t) => t.status === 'em_andamento').length,
    fechados: tickets.filter((t) => t.status === 'fechado').length,
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Tickets</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="btn-primary flex items-center gap-2"
          aria-expanded={showCreateForm}
          aria-controls="ticket-create-form"
        >
          <Plus className="w-4 h-4" />
          Abrir Chamado
        </button>
      </div>

      {error && (
        <div role="alert" aria-live="assertive" className="mb-4 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-900">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div id="ticket-create-form" className="card mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Novo Ticket</h2>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="ticket-empresa" className="block text-sm font-medium text-dark-muted mb-2">
                  Empresa *
                </label>
                <select
                  id="ticket-empresa"
                  className="input"
                  value={newTicket.empresaId}
                  onChange={(e) => {
                    const empresaId = e.target.value
                    setNewTicket((prev) => ({
                      ...prev,
                      empresaId,
                      contatoId: '',
                    }))
                  }}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(createErrors.empresaId)}
                  aria-describedby={createErrors.empresaId ? 'ticket-empresa-error' : undefined}
                >
                  <option value="">Selecione</option>
                  {empresas.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nome}
                    </option>
                  ))}
                </select>
                {createErrors.empresaId && <p id="ticket-empresa-error" role="alert" className="text-red-400 text-sm mt-1">{createErrors.empresaId}</p>}
              </div>

              <div>
                <label htmlFor="ticket-contato" className="block text-sm font-medium text-dark-muted mb-2">
                  Contato *
                </label>
                <select
                  id="ticket-contato"
                  className="input"
                  value={newTicket.contatoId}
                  onChange={(e) => setNewTicket((prev) => ({ ...prev, contatoId: e.target.value }))}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(createErrors.contatoId)}
                  aria-describedby={createErrors.contatoId ? 'ticket-contato-error' : undefined}
                >
                  <option value="">Selecione</option>
                  {contatosDaEmpresa.map((contato) => (
                    <option key={contato.id} value={contato.id}>
                      {contato.nome}
                    </option>
                  ))}
                </select>
                {createErrors.contatoId && <p id="ticket-contato-error" role="alert" className="text-red-400 text-sm mt-1">{createErrors.contatoId}</p>}
              </div>

              <div>
                <label htmlFor="ticket-categoria" className="block text-sm font-medium text-dark-muted mb-2">
                  Categoria *
                </label>
                <select
                  id="ticket-categoria"
                  className="input"
                  value={newTicket.categoriaId}
                  onChange={(e) => setNewTicket((prev) => ({ ...prev, categoriaId: e.target.value }))}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(createErrors.categoriaId)}
                  aria-describedby={createErrors.categoriaId ? 'ticket-categoria-error' : undefined}
                >
                  <option value="">Selecione</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
                {createErrors.categoriaId && <p id="ticket-categoria-error" role="alert" className="text-red-400 text-sm mt-1">{createErrors.categoriaId}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="ticket-titulo" className="block text-sm font-medium text-dark-muted mb-2">
                Título *
              </label>
              <input
                id="ticket-titulo"
                type="text"
                className="input"
                value={newTicket.titulo}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, titulo: e.target.value }))}
                placeholder="Resumo curto do problema"
                required
                aria-required="true"
                aria-invalid={Boolean(createErrors.titulo)}
                aria-describedby={createErrors.titulo ? 'ticket-titulo-error' : undefined}
              />
              {createErrors.titulo && <p id="ticket-titulo-error" role="alert" className="text-red-400 text-sm mt-1">{createErrors.titulo}</p>}
            </div>

            <div>
              <label htmlFor="ticket-descricao-novo" className="block text-sm font-medium text-dark-muted mb-2">
                Descrição *
              </label>
              <textarea
                id="ticket-descricao-novo"
                className="input min-h-28 resize-y"
                value={newTicket.descricao}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o chamado com detalhes"
                required
                aria-required="true"
                aria-invalid={Boolean(createErrors.descricao)}
                aria-describedby={createErrors.descricao ? 'ticket-descricao-error' : undefined}
              />
              {createErrors.descricao && <p id="ticket-descricao-error" role="alert" className="text-red-400 text-sm mt-1">{createErrors.descricao}</p>}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Abrindo...' : 'Abrir Chamado'}
              </button>
              <button
                type="button"
                className="px-4 py-2 text-dark-muted hover:text-white transition"
                onClick={() => {
                  setShowCreateForm(false)
                  setCreateErrors({})
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <FilterBar
        onFilterChange={handleFilterChange}
        empresas={empresas}
        categorias={categorias}
      />

      <TabsSelector
        activeTab={selectedTab}
        onTabChange={handleTabChange}
        counts={counts}
        isLoading={isLoading}
      />

      <TicketTableInline
        tickets={paginatedTickets}
        empresas={empresasMap}
        onViewTicket={handleViewTicket}
        onDeleteTicket={handleDeleteTicket}
        isLoading={isLoading}
        isCompact={isMobile}
      />

      {filteredTickets.length > pageSize && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredTickets.length}
          onPageChange={setCurrentPage}
        />
      )}

      <TicketModalExpanded
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTicket}
      />
    </div>
  )
}

export default TicketsPage

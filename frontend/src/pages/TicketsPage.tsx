import React, { useState, useEffect } from 'react'
import { ticketsApi, Ticket } from '@/api/tickets'
import { empresasApi } from '@/api/empresas'
import { categoriasApi } from '@/api/categorias'
import FilterBar, { FilterValues } from '@/components/dashboard/FilterBar'
import TabsSelector, { TabType } from '@/components/dashboard/TabsSelector'
import TicketTableInline from '@/components/dashboard/TicketTableInline'
import TicketModalExpanded from '@/components/dashboard/TicketModalExpanded'
import PaginationControls from '@/components/dashboard/PaginationControls'

const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [selectedTab, setSelectedTab] = useState<TabType>('abertos')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [filters, setFilters] = useState<FilterValues>({})
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [empresas, setEmpresas] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [empresasMap, setEmpresasMap] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const [ticketsData, empresasData, categoriasData] = await Promise.all([
        ticketsApi.getAll(),
        empresasApi.getAll(),
        categoriasApi.getAll(),
      ])

      setTickets(ticketsData)
      setEmpresas(empresasData)
      setCategorias(categoriasData)

      const empMap = empresasData.reduce(
        (acc: Record<string, string>, emp: any) => {
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
    if (!window.confirm('Tem certeza que deseja deletar este ticket?')) return

    try {
      await ticketsApi.delete(id)
      await loadInitialData()
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar ticket')
    }
  }

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

  const isMobile = window.innerWidth < 768

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Tickets</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-900">
          {error}
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

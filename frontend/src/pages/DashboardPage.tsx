import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardApi } from '@/api/dashboard'
import { ticketsApi, Ticket } from '@/api/tickets'
import { empresasApi, Empresa } from '@/api/empresas'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useConfirm } from '@/context/ConfirmContext'
import TicketSummaryCards from '@/components/dashboard/TicketSummaryCards'
import TabsSelector, { TabType } from '@/components/dashboard/TabsSelector'
import TicketTableInline from '@/components/dashboard/TicketTableInline'
import TicketModalExpanded from '@/components/dashboard/TicketModalExpanded'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()
  const { showConfirm } = useConfirm()
  const [stats, setStats] = useState({
    faturadoMes: 0,
    faturadoYTD: 0,
    ticketsHoje: 0,
    ticketsAbertos: 0,
    ticketsEmAndamento: 0,
    ticketsFechados: 0,
  })

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [selectedTab, setSelectedTab] = useState<TabType>('abertos')
  const [isLoading, setIsLoading] = useState(true)
  const [empresasMap, setEmpresasMap] = useState<Record<string, string>>({})
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Load stats and tickets in parallel
      const [statsData, ticketsData, empresasData] = await Promise.all([
        dashboardApi.getStats(),
        ticketsApi.getAll(),
        empresasApi.getAll(),
      ])

      setStats(statsData)
      setTickets(ticketsData)

      // Build empresas map
      const empMap = empresasData.reduce(
        (acc: Record<string, string>, emp: Empresa) => {
          acc[emp.id] = emp.nome
          return acc
        },
        {}
      )
      setEmpresasMap(empMap)

      // Apply initial filter
      filterTicketsByTab(ticketsData, 'abertos')
    } catch (err: any) {
      console.error('Error loading dashboard:', err)
      setError(err.message || 'Erro ao carregar dashboard')
      // Still set loading to false for UI
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTicketsByTab = (data: Ticket[], tab: TabType) => {
    let result = data
    switch (tab) {
      case 'abertos':
        result = data.filter((t) => t.status === 'aberto')
        break
      case 'em_andamento':
        result = data.filter((t) => t.status === 'em_andamento')
        break
      case 'fechados':
        result = data.filter((t) => t.status === 'fechado')
        break
    }
    setFilteredTickets(result.slice(0, 5)) // Limit to 5 for dashboard
  }

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab)
    filterTicketsByTab(tickets, tab)
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
      await loadDashboardData()
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
      await loadDashboardData()
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar ticket')
    }
  }

  const counts = {
    abertos: stats.ticketsAbertos,
    em_andamento: stats.ticketsEmAndamento,
    fechados: stats.ticketsFechados,
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Dashboard</h1>

      {error && (
        <div role="alert" aria-live="assertive" className="mb-4 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-900">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <TicketSummaryCards
        faturadoMes={stats.faturadoMes}
        faturadoYTD={stats.faturadoYTD}
        ticketsHoje={stats.ticketsHoje}
        isLoading={isLoading}
      />

      {/* Tickets Section */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white">Tickets Recentes</h2>
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="text-sm text-brand-blue hover:text-brand-blue/80 transition-colors"
          >
            Ver todos →
          </button>
        </div>

        <TabsSelector
          activeTab={selectedTab}
          onTabChange={handleTabChange}
          counts={counts}
          isLoading={isLoading}
        />

        <TicketTableInline
          tickets={filteredTickets}
          empresas={empresasMap}
          onViewTicket={handleViewTicket}
          onDeleteTicket={handleDeleteTicket}
          isLoading={isLoading}
          isCompact={isMobile}
        />
      </div>

      {/* Modal */}
      <TicketModalExpanded
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTicket}
      />
    </div>
  )
}

export default DashboardPage

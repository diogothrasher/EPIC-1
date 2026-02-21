import { api } from './client'

export interface DashboardStats {
  faturadoMes: number
  faturadoYTD: number
  ticketsHoje: number
  ticketsAbertos: number
  ticketsEmAndamento: number
  ticketsFechados: number
}

export interface DashboardData {
  stats: DashboardStats
  ticketsRecentes: any[]
}

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get<DashboardStats>('/dashboard/stats')
    return data
  },

  getFullData: async () => {
    const { data } = await api.get<DashboardData>('/dashboard')
    return data
  },

  getTicketsRecentes: async (limit = 10) => {
    const { data } = await api.get('/dashboard/tickets-recentes', { params: { limit } })
    return data
  },
}

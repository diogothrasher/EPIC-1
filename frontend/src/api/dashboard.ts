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

interface DashboardResumoResponse {
  abertos: number
  em_andamento: number
  fechados: number
  tickets_hoje: number
  faturado_mes: number
  faturado_ytd: number
}

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get<DashboardResumoResponse>('/dashboard/resumo')
    return {
      faturadoMes: data.faturado_mes ?? 0,
      faturadoYTD: data.faturado_ytd ?? 0,
      ticketsHoje: data.tickets_hoje ?? 0,
      ticketsAbertos: data.abertos ?? 0,
      ticketsEmAndamento: data.em_andamento ?? 0,
      ticketsFechados: data.fechados ?? 0,
    }
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

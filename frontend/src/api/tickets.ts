import { api } from './client'

export interface Ticket {
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

export const ticketsApi = {
  getAll: async (filters?: Record<string, unknown>) => {
    const { data } = await api.get<Ticket[]>('/tickets', { params: filters })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<Ticket>(`/tickets/${id}`)
    return data
  },

  getByStatus: async (status: string) => {
    const { data } = await api.get<Ticket[]>(`/tickets/status/${status}`)
    return data
  },

  getByEmpresa: async (empresaId: string) => {
    const { data } = await api.get<Ticket[]>(`/tickets/empresa/${empresaId}`)
    return data
  },

  create: async (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data } = await api.post<Ticket>('/tickets', ticket)
    return data
  },

  update: async (id: string, ticket: Partial<Ticket>) => {
    const { data } = await api.put<Ticket>(`/tickets/${id}`, ticket)
    return data
  },

  delete: async (id: string) => {
    await api.delete(`/tickets/${id}`)
  },
}

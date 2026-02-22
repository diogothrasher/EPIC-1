import { api } from './client'

export interface Ticket {
  id: string
  titulo?: string
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

export interface TicketCreateInput {
  empresaId: string
  contatoId: string
  categoriaId: string
  titulo: string
  descricao: string
}

interface BackendTicket {
  id: string
  titulo?: string
  descricao: string
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado'
  empresa_id: string
  contato_id: string
  categoria_id?: string
  valor_faturado?: number
  data_criacao: string
  data_fechamento?: string
  data_atualizacao?: string
}

const mapTicketFromBackend = (ticket: BackendTicket): Ticket => ({
  id: ticket.id,
  titulo: ticket.titulo,
  descricao: ticket.descricao,
  status: ticket.status === 'resolvido' ? 'fechado' : ticket.status,
  empresaId: ticket.empresa_id,
  contatoId: ticket.contato_id,
  categoriaId: ticket.categoria_id,
  valorFaturado: ticket.valor_faturado,
  dataAbertura: ticket.data_criacao,
  dataFechamento: ticket.data_fechamento,
  createdAt: ticket.data_criacao,
  updatedAt: ticket.data_atualizacao,
})

export const ticketsApi = {
  getAll: async (filters?: Record<string, unknown>) => {
    const { data } = await api.get<BackendTicket[]>('/tickets', { params: filters })
    return data.map(mapTicketFromBackend)
  },

  getById: async (id: string) => {
    const { data } = await api.get<BackendTicket>(`/tickets/${id}`)
    return mapTicketFromBackend(data)
  },

  getByStatus: async (status: string) => {
    const { data } = await api.get<BackendTicket[]>('/tickets', { params: { status } })
    return data.map(mapTicketFromBackend)
  },

  getByEmpresa: async (empresaId: string) => {
    const { data } = await api.get<BackendTicket[]>('/tickets', { params: { empresa_id: empresaId } })
    return data.map(mapTicketFromBackend)
  },

  create: async (ticket: TicketCreateInput) => {
    const payload = {
      empresa_id: ticket.empresaId,
      contato_id: ticket.contatoId,
      categoria_id: ticket.categoriaId,
      titulo: ticket.titulo,
      descricao: ticket.descricao,
    }
    const { data } = await api.post<BackendTicket>('/tickets', payload)
    return mapTicketFromBackend(data)
  },

  update: async (id: string, ticket: Partial<Ticket>) => {
    const payload = {
      titulo: ticket.titulo,
      descricao: ticket.descricao,
      status: ticket.status,
      categoria_id: ticket.categoriaId,
      contato_id: ticket.contatoId,
    }
    const { data } = await api.put<BackendTicket>(`/tickets/${id}`, payload)
    return mapTicketFromBackend(data)
  },

  delete: async (id: string) => {
    await api.delete(`/tickets/${id}`)
  },
}

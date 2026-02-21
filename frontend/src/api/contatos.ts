import { api } from './client'

export interface Contato {
  id: string
  nome: string
  email: string
  telefone?: string
  empresaId: string
  cargo?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export const contatosApi = {
  getAll: async (filters?: Record<string, unknown>) => {
    const { data } = await api.get<Contato[]>('/contatos', { params: filters })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<Contato>(`/contatos/${id}`)
    return data
  },

  getByEmpresa: async (empresaId: string) => {
    const { data } = await api.get<Contato[]>(`/contatos/empresa/${empresaId}`)
    return data
  },

  create: async (contato: Omit<Contato, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data } = await api.post<Contato>('/contatos', contato)
    return data
  },

  update: async (id: string, contato: Partial<Contato>) => {
    const { data } = await api.put<Contato>(`/contatos/${id}`, contato)
    return data
  },

  delete: async (id: string) => {
    await api.delete(`/contatos/${id}`)
  },
}

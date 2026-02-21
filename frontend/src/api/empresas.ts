import { api } from './client'

export interface Empresa {
  id: string
  nome: string
  cnpj?: string
  email?: string
  telefone?: string
  endereco?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export const empresasApi = {
  getAll: async (filters?: Record<string, unknown>) => {
    const { data } = await api.get<Empresa[]>('/empresas', { params: filters })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<Empresa>(`/empresas/${id}`)
    return data
  },

  create: async (empresa: Omit<Empresa, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const { data } = await api.post<Empresa>('/empresas', empresa)
    return data
  },

  update: async (id: string, empresa: Partial<Empresa>) => {
    const { data } = await api.put<Empresa>(`/empresas/${id}`, empresa)
    return data
  },

  delete: async (id: string) => {
    await api.delete(`/empresas/${id}`)
  },
}

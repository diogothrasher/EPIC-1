import { api } from './client'

export interface Categoria {
  id: string
  nome: string
  descricao?: string
  cor?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export const categoriasApi = {
  getAll: async (filters?: Record<string, unknown>) => {
    const { data } = await api.get<Categoria[]>('/categorias', { params: filters })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<Categoria>(`/categorias/${id}`)
    return data
  },

  create: async (categoria: Omit<Categoria, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data } = await api.post<Categoria>('/categorias', categoria)
    return data
  },

  update: async (id: string, categoria: Partial<Categoria>) => {
    const { data } = await api.put<Categoria>(`/categorias/${id}`, categoria)
    return data
  },

  delete: async (id: string) => {
    await api.delete(`/categorias/${id}`)
  },
}

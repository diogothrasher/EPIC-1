import { api } from './client'

export interface Contato {
  id: string
  nome: string
  email: string
  telefone?: string
  empresaId: string
  cargo?: string
  departamento?: string
  principal?: boolean
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface ContatoCreateInput {
  empresaId: string
  nome: string
  email?: string
  telefone?: string
  cargo?: string
  departamento?: string
  principal?: boolean
}

interface BackendContato {
  id: string
  nome: string
  email: string
  telefone?: string
  empresa_id: string
  cargo?: string
  departamento?: string
  principal?: boolean
  ativo?: boolean
  data_criacao?: string
  data_atualizacao?: string
}

const mapContatoFromBackend = (contato: BackendContato): Contato => ({
  id: contato.id,
  nome: contato.nome,
  email: contato.email,
  telefone: contato.telefone,
  empresaId: contato.empresa_id,
  cargo: contato.cargo,
  departamento: contato.departamento,
  principal: contato.principal,
  status: contato.ativo ? 'ativo' : 'inativo',
  createdAt: contato.data_criacao,
  updatedAt: contato.data_atualizacao,
})

export const contatosApi = {
  getAll: async (filters?: Record<string, unknown>) => {
    const { data } = await api.get<BackendContato[]>('/contatos', { params: filters })
    return data.map(mapContatoFromBackend)
  },

  getById: async (id: string) => {
    const { data } = await api.get<BackendContato>(`/contatos/${id}`)
    return mapContatoFromBackend(data)
  },

  getByEmpresa: async (empresaId: string) => {
    const { data } = await api.get<BackendContato[]>('/contatos', { params: { empresa_id: empresaId } })
    return data.map(mapContatoFromBackend)
  },

  create: async (contato: ContatoCreateInput) => {
    const payload = {
      empresa_id: contato.empresaId,
      nome: contato.nome,
      email: contato.email || undefined,
      telefone: contato.telefone || undefined,
      cargo: contato.cargo || undefined,
      departamento: contato.departamento || undefined,
      principal: contato.principal ?? false,
    }
    const { data } = await api.post<BackendContato>('/contatos', payload)
    return mapContatoFromBackend(data)
  },

  update: async (id: string, contato: Partial<Contato>) => {
    const payload = {
      nome: contato.nome,
      email: contato.email,
      telefone: contato.telefone,
      cargo: contato.cargo,
      departamento: contato.departamento,
      principal: contato.principal,
    }
    const { data } = await api.put<BackendContato>(`/contatos/${id}`, payload)
    return mapContatoFromBackend(data)
  },

  delete: async (id: string) => {
    await api.delete(`/contatos/${id}`)
  },
}

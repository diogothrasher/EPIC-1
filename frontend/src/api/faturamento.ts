import { api } from './client'

export interface FaturamentoItem {
  id: string
  ticket_id: string
  empresa_id: string
  ticket_numero: string
  ticket_titulo: string
  ticket_descricao: string
  categoria_nome?: string | null
  empresa_nome?: string | null
  data_ticket: string
  valor: number
  descricao?: string | null
  mes_referencia: string
  faturado: boolean
  data_faturacao?: string | null
  numero_nota_fiscal?: string | null
}

export interface FaturamentoResumo {
  mes_referencia: string
  total_registros: number
  subtotal_pendente: number
  subtotal_faturado: number
  total_geral: number
}

export interface FaturamentoCreateInput {
  ticket_id: string
  empresa_id: string
  valor: number
  descricao?: string
  mes_referencia: string
  faturado?: boolean
  numero_nota_fiscal?: string
}

export interface FaturamentoUpdateInput {
  valor?: number
  descricao?: string
  mes_referencia?: string
  faturado?: boolean
  numero_nota_fiscal?: string
}

export const faturamentoApi = {
  list: async (params?: {
    mes_referencia?: string
    empresa_id?: string
    faturado?: boolean
  }) => {
    const { data } = await api.get<FaturamentoItem[]>('/faturamento', { params })
    return data
  },

  resumo: async (params?: { mes_referencia?: string; empresa_id?: string }) => {
    const { data } = await api.get<FaturamentoResumo>('/faturamento/resumo', { params })
    return data
  },

  create: async (payload: FaturamentoCreateInput) => {
    const { data } = await api.post('/faturamento', payload)
    return data
  },

  update: async (id: string, payload: FaturamentoUpdateInput) => {
    const { data } = await api.put(`/faturamento/${id}`, payload)
    return data
  },

  updateStatus: async (id: string, faturado: boolean, numero_nota_fiscal?: string) => {
    const { data } = await api.patch(`/faturamento/${id}/status`, null, {
      params: { faturado, numero_nota_fiscal },
    })
    return data
  },

  remove: async (id: string) => {
    await api.delete(`/faturamento/${id}`)
  },

  exportCsv: async (params?: { mes_referencia?: string; empresa_id?: string; faturado?: boolean }) => {
    const response = await api.get('/faturamento/export/csv', {
      params,
      responseType: 'blob',
    })
    return response.data as Blob
  },

  exportJson: async (params?: { mes_referencia?: string; empresa_id?: string; faturado?: boolean }) => {
    const { data } = await api.get('/faturamento/export/json', { params })
    return data
  },
}

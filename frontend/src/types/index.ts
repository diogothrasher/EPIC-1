export interface Usuario {
  id: string
  email: string
  nome: string
  role: 'admin' | 'tecnico'
  ativo: boolean
  data_criacao: string
}

export interface Empresa {
  id: string
  nome: string
  cnpj?: string
  telefone?: string
  email?: string
  endereco?: string
  contato_principal_id?: string
  ativo: boolean
  data_criacao: string
}

export interface Contato {
  id: string
  empresa_id: string
  nome: string
  email?: string
  telefone?: string
  cargo?: string
  departamento?: string
  principal: boolean
  ativo: boolean
  data_criacao: string
}

export interface CategoriaServico {
  id: string
  nome: string
  descricao?: string
  cor_tag: string
  icone?: string
  ordem: number
  ativo: boolean
}

export type TicketStatus = 'aberto' | 'em_andamento' | 'resolvido' | 'fechado'

export interface Ticket {
  id: string
  numero: string
  empresa_id: string
  contato_id: string
  categoria_id: string
  titulo: string
  descricao: string
  status: TicketStatus
  solucao_descricao?: string
  tempo_gasto_horas?: number
  data_criacao: string
  data_atualizacao: string
  data_fechamento?: string
  ativo: boolean
  empresa?: Empresa
  contato?: Contato
  categoria?: CategoriaServico
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface ApiError {
  detail: string
  message?: string
}

export interface AuthTokenResponse {
  access_token: string
  token_type: string
  usuario: Usuario
}

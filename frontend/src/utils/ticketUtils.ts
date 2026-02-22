import { TicketStatus } from '@/types'

/**
 * Retorna as classes Tailwind para colorir status de ticket
 */
export const getStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case 'aberto':
      return 'text-red-400 bg-red-900/20'
    case 'em_andamento':
      return 'text-yellow-400 bg-yellow-900/20'
    case 'fechado':
    case 'resolvido':
      return 'text-green-400 bg-green-900/20'
    default:
      return 'text-gray-400 bg-gray-900/20'
  }
}

/**
 * Retorna o label legível para status de ticket
 */
export const getStatusLabel = (status: TicketStatus): string => {
  switch (status) {
    case 'aberto':
      return 'Aberto'
    case 'em_andamento':
      return 'Em Andamento'
    case 'fechado':
      return 'Fechado'
    case 'resolvido':
      return 'Resolvido'
    default:
      return status
  }
}

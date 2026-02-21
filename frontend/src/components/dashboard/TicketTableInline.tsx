import React from 'react'
import { Ticket } from '@/api/tickets'
import TicketRow from './TicketRow'

interface TicketTableInlineProps {
  tickets: Ticket[]
  empresas?: Record<string, string>
  onViewTicket?: (id: string) => void
  onEditTicket?: (id: string) => void
  onDeleteTicket?: (id: string) => void
  isLoading?: boolean
  isCompact?: boolean
}

export const TicketTableInline: React.FC<TicketTableInlineProps> = ({
  tickets,
  empresas = {},
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  isLoading = false,
  isCompact = false,
}) => {
  if (isLoading) {
    return (
      <div className={isCompact ? 'space-y-3' : 'rounded-lg border border-dark-border overflow-hidden'}>
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className={`h-16 bg-dark-card animate-pulse ${isCompact ? 'rounded' : idx === 0 ? '' : ''}`}
          />
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-dark-muted">
        <p className="text-lg">Nenhum ticket encontrado</p>
      </div>
    )
  }

  if (isCompact) {
    return (
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            empresaNome={empresas[ticket.empresaId] || '—'}
            onView={() => onViewTicket?.(ticket.id)}
            onEdit={() => onEditTicket?.(ticket.id)}
            onDelete={() => onDeleteTicket?.(ticket.id)}
            isCompact={true}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-dark-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-dark-border">
            <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
              Descrição
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
              Empresa
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
              Tempo
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-dark-muted uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              empresaNome={empresas[ticket.empresaId] || '—'}
              onView={() => onViewTicket?.(ticket.id)}
              onEdit={() => onEditTicket?.(ticket.id)}
              onDelete={() => onDeleteTicket?.(ticket.id)}
              isCompact={false}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TicketTableInline

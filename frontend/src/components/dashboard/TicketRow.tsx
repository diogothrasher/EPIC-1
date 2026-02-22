import React from 'react'
import { Ticket } from '@/api/tickets'
import TimeElapsed from './TimeElapsed'
import ActionMenu, { ActionMenuItem } from './ActionMenu'
import { getStatusColor, getStatusLabel } from '@/utils/ticketUtils'

interface TicketRowProps {
  ticket: Ticket
  empresaNome?: string
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  isCompact?: boolean
}

export const TicketRow: React.FC<TicketRowProps> = ({
  ticket,
  empresaNome = '—',
  onView,
  onEdit,
  onDelete,
  isCompact = false,
}) => {

  const actionItems: ActionMenuItem[] = []
  if (onView)
    actionItems.push({ label: 'Visualizar', icon: '👁️', onClick: onView })
  if (onEdit) actionItems.push({ label: 'Editar', icon: '✏️', onClick: onEdit })
  if (onDelete)
    actionItems.push({
      label: 'Deletar',
      icon: '🗑️',
      onClick: onDelete,
      color: 'danger',
    })

  if (isCompact) {
    // Mobile/compact view - single column
    return (
      <div className="bg-dark-card border border-dark-border rounded p-4 mb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="text-white font-semibold line-clamp-2">
              {ticket.descricao}
            </h4>
            <p className="text-dark-muted text-xs mt-1">{empresaNome}</p>
          </div>
          <div className="ml-2">
            <ActionMenu items={actionItems} />
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className={`px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
            {getStatusLabel(ticket.status)}
          </span>
          <TimeElapsed startDate={ticket.dataAbertura} className="text-dark-muted" />
        </div>
      </div>
    )
  }

  // Desktop view - table row
  return (
    <tr className="border-t border-dark-border hover:bg-dark-border/50 transition-colors">
      <td className="px-4 py-3 text-white max-w-xs truncate">
        {ticket.descricao}
      </td>
      <td className="px-4 py-3 text-dark-muted text-sm">{empresaNome}</td>
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
          {getStatusLabel(ticket.status)}
        </span>
      </td>
      <td className="px-4 py-3 text-dark-muted text-sm">
        <TimeElapsed startDate={ticket.dataAbertura} />
      </td>
      <td className="px-4 py-3 text-right">
        <ActionMenu items={actionItems} />
      </td>
    </tr>
  )
}

export default TicketRow

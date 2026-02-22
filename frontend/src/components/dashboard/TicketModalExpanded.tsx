import React, { useState } from 'react'
import { Ticket } from '@/api/tickets'
import { getStatusColor, getStatusLabel } from '@/utils/ticketUtils'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface TicketModalExpandedProps {
  ticket?: Ticket | null
  isOpen: boolean
  onClose: () => void
  onSave?: (ticket: Partial<Ticket>) => void
  isLoading?: boolean
}

type TabType = 'details' | 'history' | 'notes'

export const TicketModalExpanded: React.FC<TicketModalExpandedProps> = ({
  ticket,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [editData, setEditData] = useState<Partial<Ticket> | null>(null)
  const { isDesktop, isTablet } = useBreakpoint()
  const titleId = React.useId()

  React.useEffect(() => {
    if (ticket) {
      setEditData({ ...ticket })
    }
  }, [ticket])

  React.useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !ticket || !editData) return null

  const modalWidth = isDesktop ? '90vw' : isTablet ? '95vw' : 'full'
  const maxHeight = isDesktop ? 'max-h-[90vh]' : isTablet ? 'max-h-[95vh]' : 'h-screen'

  const formatDate = (date: string | undefined) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`bg-dark-card border border-dark-border rounded-lg ${maxHeight} w-full overflow-y-auto shadow-2xl`}
        style={{
          maxWidth: isDesktop ? '90vw' : '100%',
          width: modalWidth === 'full' ? '100%' : 'auto',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark-border border-b border-dark-border p-4 sm:p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 id={titleId} className="text-lg sm:text-2xl font-bold text-white mb-2">
              {ticket.descricao}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {getStatusLabel(ticket.status)}
              </span>
              <span className="text-dark-muted text-xs">
                ID: {ticket.id}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-dark-muted hover:text-white transition-colors text-2xl leading-none"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-dark-border flex overflow-x-auto bg-dark-card" role="tablist" aria-label="Seções do ticket">
          {(['details', 'history', 'notes'] as TabType[]).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-brand-blue border-b-brand-blue'
                  : 'text-dark-muted border-b-transparent hover:text-white'
              }`}
            >
              {tab === 'details' && 'Detalhes'}
              {tab === 'history' && 'Histórico'}
              {tab === 'notes' && 'Notas'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ticket-status" className="block text-xs text-dark-muted mb-2 font-semibold">
                    Status
                  </label>
                  <select
                    id="ticket-status"
                    value={editData.status || ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        status: e.target.value as Ticket['status'],
                      })
                    }
                    className="w-full bg-dark-border text-white rounded px-3 py-2 text-sm border border-dark-border focus:border-brand-blue outline-none"
                  >
                    <option value="aberto">Aberto</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ticket-valor" className="block text-xs text-dark-muted mb-2 font-semibold">
                    Valor Faturado (R$)
                  </label>
                  <input
                    id="ticket-valor"
                    type="number"
                    step="0.01"
                    value={editData.valorFaturado || ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        valorFaturado: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-dark-border text-white rounded px-3 py-2 text-sm border border-dark-border focus:border-brand-blue outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ticket-descricao" className="block text-xs text-dark-muted mb-2 font-semibold">
                  Descrição
                </label>
                <textarea
                  id="ticket-descricao"
                  value={editData.descricao || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, descricao: e.target.value })
                  }
                  className="w-full bg-dark-border text-white rounded px-3 py-2 text-sm border border-dark-border focus:border-brand-blue outline-none min-h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-dark-border rounded p-3">
                <div>
                  <p className="text-xs text-dark-muted mb-1">Data de Abertura</p>
                  <p className="text-white text-sm">
                    {formatDate(ticket.dataAbertura)}
                  </p>
                </div>
                {ticket.dataFechamento && (
                  <div>
                    <p className="text-xs text-dark-muted mb-1">Data de Fechamento</p>
                    <p className="text-white text-sm">
                      {formatDate(ticket.dataFechamento)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="bg-dark-border rounded p-4 text-center text-dark-muted text-sm">
                Histórico não disponível nesta versão
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="bg-dark-border rounded p-4 text-center text-dark-muted text-sm">
                Notas não disponíveis nesta versão
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-dark-border bg-dark-card p-4 sm:p-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-dark-muted hover:text-white transition-colors"
          >
            Cancelar
          </button>
          {onSave && (
            <button
              type="button"
              onClick={() => {
                onSave(editData)
              }}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium bg-brand-blue text-dark-bg rounded hover:bg-brand-blue/90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketModalExpanded

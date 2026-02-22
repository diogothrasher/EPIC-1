import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ticketsApi, Ticket } from '@/api/tickets'

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadTicket()
    }
  }, [id])

  const loadTicket = async () => {
    if (!id) return
    try {
      setIsLoading(true)
      const data = await ticketsApi.getById(id)
      setTicket(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar ticket')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Detalhes do Ticket</h1>
        <div className="flex items-center justify-center min-h-64" role="status" aria-live="polite" aria-label="Carregando detalhes do ticket">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Detalhes do Ticket</h1>
        {error && (
          <div role="alert" aria-live="assertive" className="mb-4 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-900">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={() => navigate('/tickets')}
          className="text-brand-blue hover:text-brand-blue/80 transition-colors"
        >
          ← Voltar para tickets
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <button
        type="button"
        onClick={() => navigate('/tickets')}
        className="text-brand-blue hover:text-brand-blue/80 transition-colors mb-4"
      >
        ← Voltar para tickets
      </button>

      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-4">{ticket.descricao}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-dark-muted text-sm mb-2">Status</p>
            <p className="text-white font-semibold">
              {ticket.status === 'aberto'
                ? 'Aberto'
                : ticket.status === 'em_andamento'
                  ? 'Em Andamento'
                  : 'Fechado'}
            </p>
          </div>

          <div>
            <p className="text-dark-muted text-sm mb-2">Valor Faturado</p>
            <p className="text-white font-semibold">
              {ticket.valorFaturado
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(ticket.valorFaturado)
                : '—'}
            </p>
          </div>

          <div>
            <p className="text-dark-muted text-sm mb-2">Data de Abertura</p>
            <p className="text-white font-semibold">
              {new Date(ticket.dataAbertura).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {ticket.dataFechamento && (
            <div>
              <p className="text-dark-muted text-sm mb-2">Data de Fechamento</p>
              <p className="text-white font-semibold">
                {new Date(ticket.dataFechamento).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-dark-muted text-sm mb-2">ID</p>
          <p className="text-white font-mono text-sm">{ticket.id}</p>
        </div>
      </div>
    </div>
  )
}

export default TicketDetailPage

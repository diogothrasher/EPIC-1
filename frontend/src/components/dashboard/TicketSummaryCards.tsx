import React from 'react'

interface TicketSummaryCardsProps {
  faturadoMes: number
  faturadoYTD: number
  ticketsHoje: number
  isLoading?: boolean
}

export const TicketSummaryCards: React.FC<TicketSummaryCardsProps> = ({
  faturadoMes,
  faturadoYTD,
  ticketsHoje,
  isLoading = false,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const cards = [
    {
      title: 'Faturado (Mês)',
      value: formatCurrency(faturadoMes),
      bgColor: 'bg-dark-card',
      icon: '💰',
    },
    {
      title: 'Faturado (YTD)',
      value: formatCurrency(faturadoYTD),
      bgColor: 'bg-dark-card',
      icon: '📊',
    },
    {
      title: 'Tickets Hoje',
      value: ticketsHoje.toString(),
      bgColor: 'bg-dark-card',
      icon: '🎫',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((_, idx) => (
          <div key={idx} className="h-24 bg-dark-card rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.bgColor} p-6 rounded-lg border border-dark-border hover:border-brand-blue/50 transition-colors`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm font-medium">{card.title}</p>
              <p className="text-white text-2xl font-bold mt-2">{card.value}</p>
            </div>
            <span className="text-3xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TicketSummaryCards

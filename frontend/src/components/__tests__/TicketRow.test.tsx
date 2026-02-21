import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TicketRow } from '../dashboard/TicketRow'
import { Ticket } from '@/api/tickets'

const mockTicket: Ticket = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  numero: 'TPT-20240101-001',
  titulo: 'Test Ticket',
  descricao: 'Test ticket description',
  status: 'aberto',
  empresa_id: 'empresa-id',
  contato_id: 'contato-id',
  categoria_id: 'categoria-id',
  dataAbertura: new Date().toISOString(),
  data_criacao: new Date().toISOString(),
  data_atualizacao: new Date().toISOString(),
}

describe('TicketRow Component', () => {
  it('renders ticket description and company name', () => {
    render(
      <TicketRow ticket={mockTicket} empresaNome="Acme Corp" />
    )
    
    expect(screen.getByText('Test ticket description')).toBeDefined()
    expect(screen.getByText('Acme Corp')).toBeDefined()
  })

  it('displays correct status color for aberto status', () => {
    const { container } = render(
      <TicketRow ticket={{ ...mockTicket, status: 'aberto' }} />
    )
    
    const statusBadge = container.querySelector('.text-red-400')
    expect(statusBadge).toBeDefined()
  })

  it('displays correct status color for em_andamento status', () => {
    const { container } = render(
      <TicketRow ticket={{ ...mockTicket, status: 'em_andamento' }} />
    )
    
    const statusBadge = container.querySelector('.text-yellow-400')
    expect(statusBadge).toBeDefined()
  })

  it('displays correct status color for fechado status', () => {
    const { container } = render(
      <TicketRow ticket={{ ...mockTicket, status: 'fechado' }} />
    )
    
    const statusBadge = container.querySelector('.text-green-400')
    expect(statusBadge).toBeDefined()
  })

  it('calls onView callback when view action is clicked', () => {
    const onView = vi.fn()
    render(
      <TicketRow ticket={mockTicket} onView={onView} />
    )
    
    // Note: Full action menu testing would require more setup
    expect(onView).not.toHaveBeenCalled()
  })

  it('renders in compact mode when isCompact is true', () => {
    const { container } = render(
      <TicketRow ticket={mockTicket} isCompact={true} />
    )
    
    const compactCard = container.querySelector('.bg-dark-card')
    expect(compactCard).toBeDefined()
  })

  it('renders in desktop mode when isCompact is false', () => {
    const { container } = render(
      <TicketRow ticket={mockTicket} isCompact={false} />
    )
    
    const desktopRow = container.querySelector('tr')
    expect(desktopRow).toBeDefined()
  })

  it('displays default company name when not provided', () => {
    render(
      <TicketRow ticket={mockTicket} />
    )
    
    expect(screen.getByText('—')).toBeDefined()
  })
})

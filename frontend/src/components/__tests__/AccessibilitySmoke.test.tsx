import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import LoginPage from '@/pages/LoginPage'
import ConfirmDialog from '../common/ConfirmDialog'
import Toast from '../common/Toast'
import { TicketTableInline } from '../dashboard/TicketTableInline'
import type { Ticket } from '@/api/tickets'

const mockUseAuth = vi.fn()
const mockUseConfirm = vi.fn()
const mockUseToast = vi.fn()

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('@/context/ConfirmContext', () => ({
  useConfirm: () => mockUseConfirm(),
}))

vi.mock('@/context/ToastContext', () => ({
  useToast: () => mockUseToast(),
}))

describe('Accessibility Smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders LoginPage with labeled fields and announces login errors', async () => {
    const login = vi.fn().mockRejectedValue(new Error('invalid credentials'))
    mockUseAuth.mockReturnValue({
      login,
      token: null,
    })

    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Senha')
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()

    fireEvent.change(emailInput, { target: { value: 'admin@gestao.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong-pass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Email ou senha inválidos')
    })
  })

  it('renders confirm dialog with proper accessible dialog attributes', () => {
    mockUseConfirm.mockReturnValue({
      isOpen: true,
      options: {
        title: 'Deletar Ticket',
        message: 'Confirma a exclusão?',
        confirmText: 'Deletar',
        cancelText: 'Cancelar',
        isDangerous: true,
      },
      close: vi.fn(),
    })

    render(<ConfirmDialog />)

    const dialog = screen.getByRole('dialog', { name: 'Deletar Ticket' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Confirma a exclusão?')).toBeInTheDocument()
  })

  it('renders table with semantic headers and caption for tickets', () => {
    const tickets: Ticket[] = [
      {
        id: 'ticket-1',
        descricao: 'Ticket de teste',
        status: 'aberto',
        empresaId: 'empresa-1',
        contatoId: 'contato-1',
        dataAbertura: '2026-02-22T10:00:00Z',
      },
    ]

    render(<TicketTableInline tickets={tickets} empresas={{ 'empresa-1': 'Empresa A' }} />)

    expect(screen.getByText('Tabela de tickets com status e ações disponíveis')).toBeInTheDocument()

    const headers = screen.getAllByRole('columnheader')
    expect(headers.length).toBeGreaterThanOrEqual(5)
    headers.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col')
    })
  })

  it('announces toast messages with alert/status roles', () => {
    mockUseToast.mockReturnValue({
      toasts: [
        { id: '1', type: 'error', message: 'Falha ao salvar' },
        { id: '2', type: 'info', message: 'Dados atualizados' },
      ],
      removeToast: vi.fn(),
    })

    render(<Toast />)

    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao salvar')
    const statuses = screen.getAllByRole('status')
    expect(statuses.some((node) => node.textContent?.includes('Dados atualizados'))).toBe(true)
  })
})

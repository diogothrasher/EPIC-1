import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Ticket, Building2, Users, LogOut, Wallet } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import clsx from 'clsx'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/empresas', icon: Building2, label: 'Empresas' },
  { to: '/contatos', icon: Users, label: 'Contatos' },
  { to: '/financeiro', icon: Wallet, label: 'Financeiro' },
]

interface SidebarProps {
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const { usuario, logout } = useAuth()

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-50 w-60 min-h-screen bg-dark-card border-r border-dark-border flex flex-col transform transition-transform duration-200',
        'sm:static sm:translate-x-0 sm:z-auto',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="p-4 border-b border-brand-terminal/20">
        <h1 className="text-lg font-bold text-white">Sistema de Gestão</h1>
        <p className="text-xs text-dark-muted mt-1">{usuario?.nome}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => onCloseMobile?.()}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-brand-terminal/10 text-brand-terminal ring-1 ring-brand-terminal/30'
                  : 'text-dark-muted hover:bg-dark-hover hover:text-brand-terminal'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-brand-terminal/20">
        <button
          type="button"
          onClick={() => {
            onCloseMobile?.()
            logout()
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-muted hover:bg-dark-hover hover:text-brand-red w-full transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

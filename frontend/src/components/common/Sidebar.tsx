import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Ticket, Building2, Users, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import clsx from 'clsx'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/empresas', icon: Building2, label: 'Empresas' },
  { to: '/contatos', icon: Users, label: 'Contatos' },
  { to: '/configuracoes', icon: Settings, label: 'Config', adminOnly: true },
]

const Sidebar: React.FC = () => {
  const { usuario, logout } = useAuth()

  return (
    <aside className="w-60 min-h-screen bg-dark-card border-r border-dark-border flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <h1 className="text-lg font-bold text-white">Sistema de Gestão</h1>
        <p className="text-xs text-dark-muted mt-1">{usuario?.nome}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav
          .filter((item) => !item.adminOnly || usuario?.role === 'admin')
          .map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-brand-blue/20 text-brand-blue'
                    : 'text-dark-muted hover:bg-dark-hover hover:text-dark-text'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
      </nav>

      <div className="p-3 border-t border-dark-border">
        <button
          onClick={logout}
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

import React, { Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { ConfirmProvider } from '@/context/ConfirmContext'
import Toast from '@/components/common/Toast'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Sidebar from '@/components/common/Sidebar'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import EmpresasPage from '@/pages/EmpresasPage'
import ContatosPage from '@/pages/ContatosPage'
import TicketsPage from '@/pages/TicketsPage'
import FinanceiroPage from '@/pages/FinanceiroPage'
import TicketDetailPage from '@/pages/TicketDetailPage'
import NotFoundPage from '@/pages/NotFoundPage'
import Footer from '@/components/common/Footer'
import '@/styles/globals.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen sm:flex">
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Fechar menu lateral"
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sm:hidden sticky top-0 z-30 flex items-center justify-between border-b border-dark-border bg-dark-card px-4 py-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-md border border-dark-border px-3 py-1.5 text-sm text-dark-text"
          >
            Menu
          </button>
          <span className="text-sm font-semibold text-dark-text">Sistema de Gestao</span>
        </header>
        <main id="conteudo-principal" className="overflow-auto flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

const Spinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-terminal" />
  </div>
)

const App: React.FC = () => (
  <AuthProvider>
    <ToastProvider>
      <ConfirmProvider>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Toast />
            <ConfirmDialog />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/empresas" element={<EmpresasPage />} />
                        <Route path="/contatos" element={<ContatosPage />} />
                        <Route path="/tickets" element={<TicketsPage />} />
                        <Route path="/financeiro" element={<FinanceiroPage />} />
                        <Route path="/tickets/:id" element={<TicketDetailPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ConfirmProvider>
    </ToastProvider>
  </AuthProvider>
)

export default App

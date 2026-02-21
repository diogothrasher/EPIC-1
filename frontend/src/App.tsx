import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import Toast from '@/components/common/Toast'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Sidebar from '@/components/common/Sidebar'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import EmpresasPage from '@/pages/EmpresasPage'
import ContatosPage from '@/pages/ContatosPage'
import TicketsPage from '@/pages/TicketsPage'
import TicketDetailPage from '@/pages/TicketDetailPage'
import NotFoundPage from '@/pages/NotFoundPage'
import '@/styles/globals.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 overflow-auto">{children}</main>
  </div>
)

const Spinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
  </div>
)

const App: React.FC = () => (
  <AuthProvider>
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Toast />
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
    </ToastProvider>
  </AuthProvider>
)

export default App

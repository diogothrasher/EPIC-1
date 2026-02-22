import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const LoginPage: React.FC = () => {
  const { login, token } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, senha)
    } catch {
      setError('Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Sistema de Gestão</h1>
        <p className="text-dark-muted mb-6 text-sm">Entre com suas credenciais</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm text-dark-muted mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="seu@email.com"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-error' : undefined}
              required
            />
          </div>

          <div>
            <label htmlFor="login-senha" className="block text-sm text-dark-muted mb-1">Senha</label>
            <input
              id="login-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input"
              placeholder="••••••••"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-error' : undefined}
              required
            />
          </div>

          {error && (
            <p id="login-error" role="alert" aria-live="assertive" className="text-brand-red text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

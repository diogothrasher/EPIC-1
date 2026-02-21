import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-6xl font-bold text-dark-muted">404</h1>
    <p className="text-dark-muted">Página não encontrada</p>
    <Link to="/" className="btn-primary">Voltar ao Dashboard</Link>
  </div>
)

export default NotFoundPage

import React, { useState, useEffect } from 'react'
import { empresasApi, Empresa } from '@/api/empresas'

const EmpresasPage: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEmpresas()
  }, [])

  const loadEmpresas = async () => {
    try {
      setIsLoading(true)
      const data = await empresasApi.getAll()
      setEmpresas(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar empresas')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Empresas</h1>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Empresas</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-900">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-dark-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-border">
              <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                CNPJ
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Telefone
              </th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr
                key={empresa.id}
                className="border-t border-dark-border hover:bg-dark-border/50 transition-colors"
              >
                <td className="px-4 py-3 text-white font-medium">{empresa.nome}</td>
                <td className="px-4 py-3 text-dark-muted text-sm">{empresa.cnpj}</td>
                <td className="px-4 py-3 text-dark-muted text-sm">
                  {empresa.email || '—'}
                </td>
                <td className="px-4 py-3 text-dark-muted text-sm">
                  {empresa.telefone || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {empresas.length === 0 && (
        <div className="text-center py-8 text-dark-muted">
          <p>Nenhuma empresa encontrada</p>
        </div>
      )}
    </div>
  )
}

export default EmpresasPage

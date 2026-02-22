import React, { useState, useEffect } from 'react'
import { contatosApi, Contato, ContatoCreateInput } from '@/api/contatos'
import { empresasApi, Empresa } from '@/api/empresas'
import { Pencil, Plus } from 'lucide-react'

const ContatosPage: React.FC = () => {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [empresasMap, setEmpresasMap] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingContatoId, setEditingContatoId] = useState<string | null>(null)
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [newContato, setNewContato] = useState<ContatoCreateInput>({
    empresaId: '',
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',
    principal: false,
  })

  const resetForm = () => {
    setNewContato({
      empresaId: '',
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      departamento: '',
      principal: false,
    })
    setCreateErrors({})
    setEditingContatoId(null)
    setShowCreateForm(false)
  }

  useEffect(() => {
    loadContatos()
  }, [])

  const loadContatos = async () => {
    try {
      setIsLoading(true)
      const [contatosData, empresasData] = await Promise.all([
        contatosApi.getAll(),
        empresasApi.getAll(),
      ])
      setContatos(contatosData)
      setEmpresas(empresasData)
      const map = empresasData.reduce((acc: Record<string, string>, empresa) => {
        acc[empresa.id] = empresa.nome
        return acc
      }, {})
      setEmpresasMap(map)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Erro ao carregar contatos')
    } finally {
      setIsLoading(false)
    }
  }

  const validateCreateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!newContato.empresaId) errors.empresaId = 'Selecione uma empresa'
    if (!newContato.nome.trim() || newContato.nome.trim().length < 3) {
      errors.nome = 'Nome deve ter no mínimo 3 caracteres'
    }
    if (newContato.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContato.email)) {
      errors.email = 'Email inválido'
    }
    if (
      newContato.telefone &&
      !/^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{10,11}$/.test(newContato.telefone)
    ) {
      errors.telefone = 'Telefone inválido'
    }
    setCreateErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateContato = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateCreateForm()) return

    try {
      setIsCreating(true)
      setError(null)
      if (editingContatoId) {
        await contatosApi.update(editingContatoId, {
          nome: newContato.nome.trim(),
          email: newContato.email?.trim() || '',
          telefone: newContato.telefone?.trim() || undefined,
          cargo: newContato.cargo?.trim() || undefined,
          departamento: newContato.departamento?.trim() || undefined,
          principal: newContato.principal,
        })
      } else {
        await contatosApi.create({
          empresaId: newContato.empresaId,
          nome: newContato.nome.trim(),
          email: newContato.email?.trim() || undefined,
          telefone: newContato.telefone?.trim() || undefined,
          cargo: newContato.cargo?.trim() || undefined,
          departamento: newContato.departamento?.trim() || undefined,
          principal: newContato.principal,
        })
      }
      resetForm()
      await loadContatos()
    } catch (err: any) {
      setError(
        err?.response?.data?.detail
        || err.message
        || (editingContatoId ? 'Erro ao atualizar contato' : 'Erro ao criar contato')
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditContato = (contato: Contato) => {
    setEditingContatoId(contato.id)
    setNewContato({
      empresaId: contato.empresaId,
      nome: contato.nome || '',
      email: contato.email || '',
      telefone: contato.telefone || '',
      cargo: contato.cargo || '',
      departamento: contato.departamento || '',
      principal: Boolean(contato.principal),
    })
    setCreateErrors({})
    setError(null)
    setShowCreateForm(true)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Contatos</h1>
        <div className="flex items-center justify-center min-h-64" role="status" aria-live="polite" aria-label="Carregando contatos">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Contatos</h1>
        <button
          type="button"
          onClick={() => {
            if (showCreateForm) {
              resetForm()
              return
            }
            setShowCreateForm(true)
          }}
          className="btn-primary flex items-center gap-2"
          aria-expanded={showCreateForm}
          aria-controls="contato-create-form"
        >
          <Plus className="w-4 h-4" />
          {showCreateForm ? 'Fechar' : 'Novo Contato'}
        </button>
      </div>

      {error && (
        <div role="alert" aria-live="assertive" className="mb-4 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-900">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div id="contato-create-form" className="card mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingContatoId ? 'Editar Contato' : 'Criar Novo Contato'}
          </h2>
          <form onSubmit={handleCreateContato} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contato-empresa" className="block text-sm font-medium text-dark-muted mb-2">
                  Empresa *
                </label>
                <select
                  id="contato-empresa"
                  className="input"
                  value={newContato.empresaId}
                  onChange={(e) => setNewContato((prev) => ({ ...prev, empresaId: e.target.value }))}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(createErrors.empresaId)}
                  aria-describedby={createErrors.empresaId ? 'contato-empresa-error' : undefined}
                >
                  <option value="">Selecione</option>
                  {empresas.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nome}
                    </option>
                  ))}
                </select>
                {createErrors.empresaId && <p id="contato-empresa-error" role="alert" className="text-red-400 text-sm mt-1">{createErrors.empresaId}</p>}
              </div>

              <div>
                <label htmlFor="contato-nome" className="block text-sm font-medium text-dark-muted mb-2">
                  Nome *
                </label>
                <input
                  id="contato-nome"
                  className="input"
                  value={newContato.nome}
                  onChange={(e) => setNewContato((prev) => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome do contato"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(createErrors.nome)}
                  aria-describedby={createErrors.nome ? 'contato-nome-error' : undefined}
                />
                {createErrors.nome && <p id="contato-nome-error" role="alert" className="text-red-400 text-sm mt-1">{createErrors.nome}</p>}
              </div>

              <div>
                <label htmlFor="contato-email" className="block text-sm font-medium text-dark-muted mb-2">
                  Email
                </label>
                <input
                  id="contato-email"
                  type="email"
                  className="input"
                  value={newContato.email || ''}
                  onChange={(e) => setNewContato((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="contato@empresa.com"
                  aria-invalid={Boolean(createErrors.email)}
                  aria-describedby={createErrors.email ? 'contato-email-error' : undefined}
                />
                {createErrors.email && <p id="contato-email-error" role="alert" className="text-red-400 text-sm mt-1">{createErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="contato-telefone" className="block text-sm font-medium text-dark-muted mb-2">
                  Telefone
                </label>
                <input
                  id="contato-telefone"
                  className="input"
                  value={newContato.telefone || ''}
                  onChange={(e) => setNewContato((prev) => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  aria-invalid={Boolean(createErrors.telefone)}
                  aria-describedby={createErrors.telefone ? 'contato-telefone-error' : undefined}
                />
                {createErrors.telefone && <p id="contato-telefone-error" role="alert" className="text-red-400 text-sm mt-1">{createErrors.telefone}</p>}
              </div>

              <div>
                <label htmlFor="contato-cargo" className="block text-sm font-medium text-dark-muted mb-2">
                  Cargo
                </label>
                <input
                  id="contato-cargo"
                  className="input"
                  value={newContato.cargo || ''}
                  onChange={(e) => setNewContato((prev) => ({ ...prev, cargo: e.target.value }))}
                  placeholder="Cargo"
                />
              </div>

              <div>
                <label htmlFor="contato-departamento" className="block text-sm font-medium text-dark-muted mb-2">
                  Departamento
                </label>
                <input
                  id="contato-departamento"
                  className="input"
                  value={newContato.departamento || ''}
                  onChange={(e) => setNewContato((prev) => ({ ...prev, departamento: e.target.value }))}
                  placeholder="Departamento"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-dark-muted">
              <input
                type="checkbox"
                checked={Boolean(newContato.principal)}
                onChange={(e) => setNewContato((prev) => ({ ...prev, principal: e.target.checked }))}
              />
              Definir como contato principal
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (editingContatoId ? 'Salvando...' : 'Criando...') : (editingContatoId ? 'Salvar Alterações' : 'Criar Contato')}
              </button>
              <button
                type="button"
                className="px-4 py-2 text-dark-muted hover:text-white transition"
                onClick={resetForm}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-lg border border-dark-border">
        <table className="w-full">
          <caption className="sr-only">Tabela de contatos cadastrados</caption>
          <thead>
            <tr className="bg-dark-border">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Empresa
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Nome
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Email
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Telefone
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Cargo
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {contatos.map((contato) => (
              <tr
                key={contato.id}
                className="border-t border-dark-border hover:bg-dark-border/50 transition-colors"
              >
                <td className="px-4 py-3 text-dark-muted text-sm">
                  {empresasMap[contato.empresaId] || '—'}
                </td>
                <td className="px-4 py-3 text-white font-medium">{contato.nome}</td>
                <td className="px-4 py-3 text-dark-muted text-sm">{contato.email}</td>
                <td className="px-4 py-3 text-dark-muted text-sm">
                  {contato.telefone || '—'}
                </td>
                <td className="px-4 py-3 text-dark-muted text-sm">
                  {contato.cargo || '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    aria-label={`Editar contato ${contato.nome}`}
                    onClick={() => handleEditContato(contato)}
                    className="text-brand-blue hover:text-brand-blue/80 transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contatos.length === 0 && (
        <div className="text-center py-8 text-dark-muted">
          <p>Nenhum contato encontrado</p>
        </div>
      )}
    </div>
  )
}

export default ContatosPage

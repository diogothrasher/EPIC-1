import React, { useState, useEffect } from 'react'
import { empresasApi, Empresa } from '@/api/empresas'
import { useToast } from '@/context/ToastContext'
import { useConfirm } from '@/context/ConfirmContext'
import { Pencil, Plus, Trash2 } from 'lucide-react'

interface FormData {
  nome: string
  cnpj?: string
  email?: string
  telefone?: string
  endereco?: string
}

const EmpresasPage: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingEmpresaId, setEditingEmpresaId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { addToast } = useToast()
  const { showConfirm } = useConfirm()

  const resetForm = () => {
    setFormData({ nome: '', cnpj: '', email: '', telefone: '', endereco: '' })
    setErrors({})
    setEditingEmpresaId(null)
    setShowForm(false)
  }

  useEffect(() => {
    loadEmpresas()
  }, [])

  const loadEmpresas = async () => {
    try {
      setIsLoading(true)
      const data = await empresasApi.getAll()
      setEmpresas(data)
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Erro ao carregar empresas'
      addToast(errorMsg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    } else if (formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter no mínimo 3 caracteres'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.cnpj && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/.test(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido (use formato XX.XXX.XXX/XXXX-XX ou 14 dígitos)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      addToast('Por favor, corrija os erros no formulário', 'warning')
      return
    }

    try {
      setIsSubmitting(true)
      if (editingEmpresaId) {
        const updatedEmpresa = await empresasApi.update(editingEmpresaId, formData)
        setEmpresas((prev) => prev.map((empresa) => (empresa.id === editingEmpresaId ? updatedEmpresa : empresa)))
        addToast('Empresa atualizada com sucesso!', 'success')
      } else {
        const newEmpresa = await empresasApi.create(formData)
        setEmpresas((prev) => [...prev, newEmpresa as Empresa])
        addToast('Empresa criada com sucesso!', 'success')
      }
      resetForm()
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail
        || err.message
        || (editingEmpresaId ? 'Erro ao atualizar empresa' : 'Erro ao criar empresa')
      addToast(errorMsg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresaId(empresa.id)
    setFormData({
      nome: empresa.nome || '',
      cnpj: empresa.cnpj || '',
      email: empresa.email || '',
      telefone: empresa.telefone || '',
      endereco: empresa.endereco || '',
    })
    setErrors({})
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Deletar Empresa',
      message: 'Tem certeza que deseja deletar esta empresa? Esta ação não pode ser desfeita.',
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      isDangerous: true,
    })

    if (!confirmed) return

    try {
      await empresasApi.delete(id)
      setEmpresas(empresas.filter((e) => e.id !== id))
      addToast('Empresa deletada com sucesso!', 'success')
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Erro ao deletar empresa'
      addToast(errorMsg, 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Empresas</h1>
        <div className="flex items-center justify-center min-h-64" role="status" aria-live="polite" aria-label="Carregando empresas">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Empresas</h1>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm()
              return
            }
            setShowForm(true)
          }}
          className="flex items-center gap-2 btn-primary"
          aria-expanded={showForm}
          aria-controls="empresa-create-form"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Fechar' : 'Nova Empresa'}
        </button>
      </div>

      {showForm && (
        <div id="empresa-create-form" className="card mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingEmpresaId ? 'Editar Empresa' : 'Criar Nova Empresa'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="empresa-nome" className="block text-sm font-medium text-dark-muted mb-2">
                Nome *
              </label>
              <input
                id="empresa-nome"
                type="text"
                className="input"
                placeholder="Nome da empresa"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                aria-required="true"
                aria-invalid={Boolean(errors.nome)}
                aria-describedby={errors.nome ? 'empresa-nome-error' : undefined}
              />
              {errors.nome && (
                <p id="empresa-nome-error" role="alert" className="text-red-400 text-sm mt-1">{errors.nome}</p>
              )}
            </div>

            <div>
              <label htmlFor="empresa-cnpj" className="block text-sm font-medium text-dark-muted mb-2">
                CNPJ
              </label>
              <input
                id="empresa-cnpj"
                type="text"
                className="input"
                placeholder="XX.XXX.XXX/XXXX-XX"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                aria-invalid={Boolean(errors.cnpj)}
                aria-describedby={errors.cnpj ? 'empresa-cnpj-error' : undefined}
              />
              {errors.cnpj && (
                <p id="empresa-cnpj-error" role="alert" className="text-red-400 text-sm mt-1">{errors.cnpj}</p>
              )}
            </div>

            <div>
              <label htmlFor="empresa-email" className="block text-sm font-medium text-dark-muted mb-2">
                Email
              </label>
              <input
                id="empresa-email"
                type="email"
                className="input"
                placeholder="email@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'empresa-email-error' : undefined}
              />
              {errors.email && (
                <p id="empresa-email-error" role="alert" className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="empresa-telefone" className="block text-sm font-medium text-dark-muted mb-2">
                Telefone
              </label>
              <input
                id="empresa-telefone"
                type="tel"
                className="input"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="empresa-endereco" className="block text-sm font-medium text-dark-muted mb-2">
                Endereço
              </label>
              <input
                id="empresa-endereco"
                type="text"
                className="input"
                placeholder="Rua, número, complemento"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (editingEmpresaId ? 'Salvando...' : 'Criando...') : (editingEmpresaId ? 'Salvar Alterações' : 'Criar Empresa')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-dark-muted hover:text-white transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-lg border border-dark-border">
        <table className="w-full">
          <caption className="sr-only">Tabela de empresas cadastradas</caption>
          <thead>
            <tr className="bg-dark-border">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Nome
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                CNPJ
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Email
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Telefone
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-dark-muted uppercase">
                Ações
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
                <td className="px-4 py-3 text-dark-muted text-sm">{empresa.cnpj || '—'}</td>
                <td className="px-4 py-3 text-dark-muted text-sm">
                  {empresa.email || '—'}
                </td>
                <td className="px-4 py-3 text-dark-muted text-sm">
                  {empresa.telefone || '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Editar empresa ${empresa.nome}`}
                      onClick={() => handleEdit(empresa)}
                      className="text-brand-blue hover:text-brand-blue/80 transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Excluir empresa ${empresa.nome}`}
                      onClick={() => handleDelete(empresa.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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

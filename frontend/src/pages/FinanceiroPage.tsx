import React, { useEffect, useMemo, useState } from 'react'
import { faturamentoApi, FaturamentoItem } from '@/api/faturamento'
import { empresasApi, Empresa } from '@/api/empresas'
import { ticketsApi, Ticket } from '@/api/tickets'
import { Download, Plus, Save, X } from 'lucide-react'

const getCurrentMonth = () => {
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const FinanceiroPage: React.FC = () => {
  const [mesReferencia, setMesReferencia] = useState(getCurrentMonth())
  const [empresaId, setEmpresaId] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'faturado' | 'pendente'>('todos')
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [items, setItems] = useState<FaturamentoItem[]>([])
  const [resumo, setResumo] = useState({
    total_registros: 0,
    subtotal_pendente: 0,
    subtotal_faturado: 0,
    total_geral: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newItem, setNewItem] = useState({
    ticket_id: '',
    valor: '',
    descricao: '',
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [editingDescricao, setEditingDescricao] = useState('')
  const [editingNf, setEditingNf] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const faturadoParam = statusFilter === 'todos' ? undefined : statusFilter === 'faturado'
      const [empresasData, ticketsData, faturamentoData, resumoData] = await Promise.all([
        empresasApi.getAll({ limit: 500 }),
        ticketsApi.getAll({ limit: 500 }),
        faturamentoApi.list({
          mes_referencia: mesReferencia,
          empresa_id: empresaId || undefined,
          faturado: faturadoParam,
        }),
        faturamentoApi.resumo({
          mes_referencia: mesReferencia,
          empresa_id: empresaId || undefined,
        }),
      ])

      setEmpresas(empresasData)
      setTickets(ticketsData)
      setItems(faturamentoData)
      setResumo({
        total_registros: resumoData.total_registros,
        subtotal_pendente: Number(resumoData.subtotal_pendente || 0),
        subtotal_faturado: Number(resumoData.subtotal_faturado || 0),
        total_geral: Number(resumoData.total_geral || 0),
      })
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Erro ao carregar financeiro')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [mesReferencia, empresaId, statusFilter])

  const ticketsDisponiveis = useMemo(() => {
    const idsFaturados = new Set(items.map((item) => item.ticket_id))
    return tickets.filter((ticket) => !idsFaturados.has(ticket.id) && (ticket.status === 'fechado'))
  }, [tickets, items])

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!newItem.ticket_id || !newItem.valor) return

    const ticket = tickets.find((item) => item.id === newItem.ticket_id)
    if (!ticket) return

    try {
      setIsSubmitting(true)
      await faturamentoApi.create({
        ticket_id: ticket.id,
        empresa_id: ticket.empresaId,
        valor: Number(newItem.valor),
        descricao: newItem.descricao || undefined,
        mes_referencia: mesReferencia,
      })
      setNewItem({ ticket_id: '', valor: '', descricao: '' })
      await loadData()
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Erro ao criar lançamento financeiro')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleFaturado = async (item: FaturamentoItem) => {
    try {
      await faturamentoApi.updateStatus(item.id, !item.faturado, item.numero_nota_fiscal || undefined)
      await loadData()
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Erro ao atualizar status de faturamento')
    }
  }

  const startEdit = (item: FaturamentoItem) => {
    setEditingId(item.id)
    setEditingValue(String(item.valor))
    setEditingDescricao(item.descricao || '')
    setEditingNf(item.numero_nota_fiscal || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingValue('')
    setEditingDescricao('')
    setEditingNf('')
  }

  const saveEdit = async () => {
    if (!editingId) return
    try {
      await faturamentoApi.update(editingId, {
        valor: Number(editingValue),
        descricao: editingDescricao || undefined,
        numero_nota_fiscal: editingNf || undefined,
      })
      cancelEdit()
      await loadData()
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Erro ao atualizar lançamento')
    }
  }

  const handleExportCsv = async () => {
    const faturadoParam = statusFilter === 'todos' ? undefined : statusFilter === 'faturado'
    const blob = await faturamentoApi.exportCsv({
      mes_referencia: mesReferencia,
      empresa_id: empresaId || undefined,
      faturado: faturadoParam,
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `faturamento-${mesReferencia}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJson = async () => {
    const faturadoParam = statusFilter === 'todos' ? undefined : statusFilter === 'faturado'
    const data = await faturamentoApi.exportJson({
      mes_referencia: mesReferencia,
      empresa_id: empresaId || undefined,
      faturado: faturadoParam,
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `faturamento-${mesReferencia}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleExportCsv} className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button type="button" onClick={handleExportJson} className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            JSON
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-4 p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-900">
          {error}
        </div>
      )}

      <div className="card mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="fin-mes" className="block text-sm text-dark-muted mb-1">Mês de referência</label>
            <input id="fin-mes" type="month" className="input" value={mesReferencia} onChange={(e) => setMesReferencia(e.target.value)} />
          </div>
          <div>
            <label htmlFor="fin-empresa" className="block text-sm text-dark-muted mb-1">Empresa</label>
            <select id="fin-empresa" className="input" value={empresaId} onChange={(e) => setEmpresaId(e.target.value)}>
              <option value="">Todas</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fin-status" className="block text-sm text-dark-muted mb-1">Status</label>
            <select id="fin-status" className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'todos' | 'faturado' | 'pendente')}>
              <option value="todos">Todos</option>
              <option value="faturado">Faturado</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <div className="card"><p className="text-dark-muted text-sm">Registros</p><p className="text-white text-xl font-bold">{resumo.total_registros}</p></div>
        <div className="card"><p className="text-dark-muted text-sm">Pendente</p><p className="text-white text-xl font-bold">{formatCurrency(resumo.subtotal_pendente)}</p></div>
        <div className="card"><p className="text-dark-muted text-sm">Faturado</p><p className="text-white text-xl font-bold">{formatCurrency(resumo.subtotal_faturado)}</p></div>
        <div className="card"><p className="text-dark-muted text-sm">Total</p><p className="text-white text-xl font-bold">{formatCurrency(resumo.total_geral)}</p></div>
      </div>

      <div className="card mb-4">
        <h2 className="text-white font-semibold mb-3">Adicionar lançamento</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-2">
            <label htmlFor="fin-ticket" className="block text-sm text-dark-muted mb-1">Ticket fechado</label>
            <select id="fin-ticket" className="input" value={newItem.ticket_id} onChange={(e) => setNewItem((prev) => ({ ...prev, ticket_id: e.target.value }))} required>
              <option value="">Selecione</option>
              {ticketsDisponiveis.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.descricao} ({ticket.id.slice(0, 8)})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fin-valor" className="block text-sm text-dark-muted mb-1">Valor</label>
            <input id="fin-valor" type="number" min="0" step="0.01" className="input" value={newItem.valor} onChange={(e) => setNewItem((prev) => ({ ...prev, valor: e.target.value }))} required />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
            <Plus className="w-4 h-4" />
            {isSubmitting ? 'Salvando...' : 'Adicionar'}
          </button>
          <div className="sm:col-span-4">
            <label htmlFor="fin-descricao" className="block text-sm text-dark-muted mb-1">Descrição</label>
            <input id="fin-descricao" type="text" className="input" value={newItem.descricao} onChange={(e) => setNewItem((prev) => ({ ...prev, descricao: e.target.value }))} placeholder="Descrição para nota fiscal" />
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-dark-border">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-border">
              <th className="px-3 py-2 text-left text-xs text-dark-muted uppercase">Data</th>
              <th className="px-3 py-2 text-left text-xs text-dark-muted uppercase">Solicitação</th>
              <th className="px-3 py-2 text-left text-xs text-dark-muted uppercase">Serviço</th>
              <th className="px-3 py-2 text-left text-xs text-dark-muted uppercase">Nº Chamado</th>
              <th className="px-3 py-2 text-left text-xs text-dark-muted uppercase">Valor</th>
              <th className="px-3 py-2 text-left text-xs text-dark-muted uppercase">Status</th>
              <th className="px-3 py-2 text-left text-xs text-dark-muted uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-dark-muted">Carregando...</td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-dark-muted">Nenhum lançamento encontrado no período.</td>
              </tr>
            )}
            {!loading && items.map((item) => (
              <tr key={item.id} className="border-t border-dark-border">
                <td className="px-3 py-2 text-sm text-dark-muted">{new Date(item.data_ticket).toLocaleDateString('pt-BR')}</td>
                <td className="px-3 py-2 text-sm text-white">{item.ticket_titulo || item.ticket_descricao}</td>
                <td className="px-3 py-2 text-sm text-dark-muted">{item.categoria_nome || '—'}</td>
                <td className="px-3 py-2 text-sm text-dark-muted">{item.ticket_numero}</td>
                <td className="px-3 py-2 text-sm text-white">
                  {editingId === item.id ? (
                    <input className="input max-w-32" type="number" step="0.01" min="0" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} />
                  ) : (
                    formatCurrency(item.valor)
                  )}
                </td>
                <td className="px-3 py-2 text-sm">
                  <button type="button" onClick={() => handleToggleFaturado(item)} className={item.faturado ? 'badge-resolvido' : 'badge-em_andamento'}>
                    {item.faturado ? 'Faturado' : 'Pendente'}
                  </button>
                </td>
                <td className="px-3 py-2 text-sm">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-2">
                      <input className="input max-w-44" placeholder="Descrição" value={editingDescricao} onChange={(e) => setEditingDescricao(e.target.value)} />
                      <input className="input max-w-28" placeholder="NF" value={editingNf} onChange={(e) => setEditingNf(e.target.value)} />
                      <button type="button" className="btn-primary" onClick={saveEdit}><Save className="w-4 h-4" /></button>
                      <button type="button" className="btn-danger" onClick={cancelEdit}><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <button type="button" className="text-brand-blue hover:text-brand-blue/80 transition" onClick={() => startEdit(item)}>
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FinanceiroPage

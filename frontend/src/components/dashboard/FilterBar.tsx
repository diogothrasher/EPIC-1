import React, { useState, useEffect } from 'react'

export interface FilterValues {
  empresa?: string
  descricao?: string
  dataInicio?: string
  dataFim?: string
  categoria?: string
}

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void
  empresas?: Array<{ id: string; nome: string }>
  categorias?: Array<{ id: string; nome: string }>
  debounceMs?: number
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  empresas = [],
  categorias = [],
  debounceMs = 300,
}) => {
  const [filters, setFilters] = useState<FilterValues>({})
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer)

    const timer = setTimeout(() => {
      onFilterChange(filters)
    }, debounceMs)

    setDebounceTimer(timer)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [filters, onFilterChange, debounceMs])

  const handleChange = (key: keyof FilterValues, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const hasActiveFilters = Object.values(filters).some((v) => v)

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Empresa Filter */}
        <div>
          <label className="block text-xs text-dark-muted mb-2 font-semibold">
            Empresa
          </label>
          <select
            value={filters.empresa || ''}
            onChange={(e) => handleChange('empresa', e.target.value)}
            className="w-full bg-dark-border text-white rounded px-3 py-2 text-sm border border-dark-border focus:border-brand-blue outline-none transition-colors"
          >
            <option value="">Todas</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Description Filter */}
        <div>
          <label className="block text-xs text-dark-muted mb-2 font-semibold">
            Descrição
          </label>
          <input
            type="text"
            value={filters.descricao || ''}
            onChange={(e) => handleChange('descricao', e.target.value)}
            placeholder="Filtrar por descrição..."
            className="w-full bg-dark-border text-white rounded px-3 py-2 text-sm border border-dark-border focus:border-brand-blue outline-none transition-colors placeholder-dark-muted"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs text-dark-muted mb-2 font-semibold">
            Categoria
          </label>
          <select
            value={filters.categoria || ''}
            onChange={(e) => handleChange('categoria', e.target.value)}
            className="w-full bg-dark-border text-white rounded px-3 py-2 text-sm border border-dark-border focus:border-brand-blue outline-none transition-colors"
          >
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-xs text-dark-muted mb-2 font-semibold">
            Data Início
          </label>
          <input
            type="date"
            value={filters.dataInicio || ''}
            onChange={(e) => handleChange('dataInicio', e.target.value)}
            className="w-full bg-dark-border text-white rounded px-3 py-2 text-sm border border-dark-border focus:border-brand-blue outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-dark-muted mb-2 font-semibold">
            Data Fim
          </label>
          <input
            type="date"
            value={filters.dataFim || ''}
            onChange={(e) => handleChange('dataFim', e.target.value)}
            className="w-full bg-dark-border text-white rounded px-3 py-2 text-sm border border-dark-border focus:border-brand-blue outline-none transition-colors"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="text-sm text-brand-blue hover:text-brand-blue/80 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterBar

import React from 'react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-dark-card rounded-lg border border-dark-border">
      <div className="text-sm text-dark-muted">
        Mostrando <span className="text-white font-semibold">{startItem}</span> até{' '}
        <span className="text-white font-semibold">{endItem}</span> de{' '}
        <span className="text-white font-semibold">{totalItems}</span> itens
      </div>

      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-dark-muted">Items por página:</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              className="bg-dark-border text-white rounded px-2 py-1 text-sm border border-dark-border"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm bg-dark-border text-white rounded hover:bg-dark-border/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>

          <div className="text-sm text-dark-muted">
            Página <span className="text-white font-semibold">{currentPage}</span> de{' '}
            <span className="text-white font-semibold">{totalPages}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm bg-dark-border text-white rounded hover:bg-dark-border/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaginationControls

import React from 'react'
import { useConfirm } from '@/context/ConfirmContext'

export const ConfirmDialog: React.FC = () => {
  const { isOpen, options, close: closeConfirm } = useConfirm()
  const titleId = React.useId()
  const messageId = React.useId()

  React.useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeConfirm(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeConfirm])

  if (!isOpen || !options) return null

  const handleConfirm = () => {
    closeConfirm(true)
  }

  const handleCancel = () => {
    closeConfirm(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="bg-dark-card border border-dark-border rounded-lg max-w-sm w-full shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-dark-border p-6">
          <h2 id={titleId} className="text-lg font-bold text-white">
            {options.title}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <p id={messageId} className="text-dark-muted text-sm leading-relaxed">
            {options.message}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-dark-border p-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-dark-muted hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue"
          >
            {options.cancelText || 'Cancelar'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              options.isDangerous
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-brand-blue hover:bg-brand-blue/90 text-dark-bg'
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue`}
          >
            {options.confirmText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

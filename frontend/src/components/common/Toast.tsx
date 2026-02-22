import React from 'react'
import { useToast } from '@/context/ToastContext'
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast()

  const getStylesByType = (type: string) => {
    const styles = {
      success: {
        bg: 'bg-green-900/20',
        border: 'border-green-900',
        text: 'text-green-400',
        icon: CheckCircle,
      },
      error: {
        bg: 'bg-red-900/20',
        border: 'border-red-900',
        text: 'text-red-400',
        icon: AlertCircle,
      },
      warning: {
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-900',
        text: 'text-yellow-400',
        icon: AlertTriangle,
      },
      info: {
        bg: 'bg-dark-hover/70',
        border: 'border-dark-border',
        text: 'text-dark-text',
        icon: Info,
      },
    }
    return styles[type as keyof typeof styles] || styles.info
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const style = getStylesByType(toast.type)
        const IconComponent = style.icon

        return (
          <div
            key={toast.id}
            role={toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'}
            aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
            className={`flex items-start gap-3 p-4 rounded-lg border ${style.bg} ${style.border} animate-fade-in`}
          >
            <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.text}`} />
            <p className={`flex-1 ${style.text}`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`flex-shrink-0 ${style.text} hover:opacity-70 transition`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Toast

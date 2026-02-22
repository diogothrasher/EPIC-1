import React, { createContext, useContext, useState, useCallback } from 'react'

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
}

interface ConfirmContextType {
  isOpen: boolean
  options: ConfirmOptions | null
  showConfirm: (options: ConfirmOptions) => Promise<boolean>
  close: (confirmed?: boolean) => void
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const showConfirm = useCallback((confirmOptions: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(confirmOptions)
      setIsOpen(true)
      setResolvePromise(() => resolve)
    })
  }, [])

  const close = useCallback((confirmed: boolean = false) => {
    setIsOpen(false)
    if (resolvePromise) {
      resolvePromise(confirmed)
      setResolvePromise(null)
    }
  }, [resolvePromise])

  return (
    <ConfirmContext.Provider value={{ isOpen, options, showConfirm, close }}>
      {children}
    </ConfirmContext.Provider>
  )
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return context
}

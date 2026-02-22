import React, { useState } from 'react'

export interface ActionMenuItem {
  label: string
  icon?: string
  onClick: () => void
  color?: 'default' | 'danger' | 'success'
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  onOpen?: () => void
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ items, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const menuId = React.useId()
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const menuRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) return

    const updateMenuPosition = () => {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 192
      const estimatedMenuHeight = menuRef.current?.offsetHeight || Math.min(items.length * 44 + 12, 260)
      const spaceBelow = window.innerHeight - rect.bottom
      const shouldOpenUpwards = spaceBelow < estimatedMenuHeight && rect.top > spaceBelow

      let top = shouldOpenUpwards
        ? rect.top - estimatedMenuHeight - 8
        : rect.bottom + 8

      const maxTop = window.innerHeight - estimatedMenuHeight - 8
      top = Math.max(8, Math.min(top, maxTop))

      let left = rect.right - menuWidth
      const maxLeft = window.innerWidth - menuWidth - 8
      left = Math.max(8, Math.min(left, maxLeft))

      setMenuPosition({ top, left })
    }

    updateMenuPosition()
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)

    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [isOpen, items.length])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen && onOpen) onOpen()
  }

  const handleItemClick = (onClick: () => void) => {
    onClick()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label="Abrir menu de ações"
        className="text-dark-muted hover:text-white transition-colors p-2 hover:bg-dark-border rounded"
      >
        ⋯
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          className="fixed w-48 max-h-64 overflow-y-auto bg-dark-card border border-dark-border rounded-lg shadow-lg z-[60]"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              role="menuitem"
              tabIndex={0}
              onClick={() => handleItemClick(item.onClick)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                idx === 0 ? 'rounded-t-lg' : ''
              } ${idx === items.length - 1 ? 'rounded-b-lg' : ''} ${
                item.color === 'danger'
                  ? 'text-red-400 hover:bg-red-900/20'
                  : item.color === 'success'
                    ? 'text-green-400 hover:bg-green-900/20'
                    : 'text-dark-muted hover:bg-dark-border'
              }`}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default ActionMenu

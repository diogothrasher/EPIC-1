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
        onClick={handleToggle}
        className="text-dark-muted hover:text-white transition-colors p-2 hover:bg-dark-border rounded"
        title="Ações"
      >
        ⋯
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg z-50">
          {items.map((item, idx) => (
            <button
              key={idx}
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
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default ActionMenu

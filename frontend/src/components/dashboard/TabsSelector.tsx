import React from 'react'

export type TabType = 'abertos' | 'em_andamento' | 'fechados'

interface TabsSelectorProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  counts?: {
    abertos: number
    em_andamento: number
    fechados: number
  }
  isLoading?: boolean
}

export const TabsSelector: React.FC<TabsSelectorProps> = ({
  activeTab,
  onTabChange,
  counts,
  isLoading = false,
}) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'abertos', label: 'Abertos' },
    { id: 'em_andamento', label: 'Em Andamento' },
    { id: 'fechados', label: 'Fechados' },
  ]

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto bg-dark-card/80 border border-dark-border p-1 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          disabled={isLoading}
          className={`px-4 py-2.5 whitespace-nowrap text-sm font-medium transition-all rounded-lg flex items-center gap-2 ${
            activeTab === tab.id
              ? 'text-dark-text bg-dark-hover ring-1 ring-white/10'
              : 'text-dark-muted hover:text-white hover:bg-dark-hover/60'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {tab.label}
          {counts && (
            <span className="ml-1 text-xs bg-dark-border px-2 py-0.5 rounded-full">
              {counts[tab.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default TabsSelector

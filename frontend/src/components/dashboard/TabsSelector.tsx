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
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'abertos', label: 'Abertos', icon: '🔴' },
    { id: 'em_andamento', label: 'Em Andamento', icon: '🟡' },
    { id: 'fechados', label: 'Fechados', icon: '🟢' },
  ]

  return (
    <div className="flex gap-2 mb-4 border-b border-dark-border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          disabled={isLoading}
          className={`px-4 py-3 whitespace-nowrap text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === tab.id
              ? 'text-brand-blue border-b-brand-blue'
              : 'text-dark-muted border-b-transparent hover:text-white'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>{tab.icon}</span>
          {tab.label}
          {counts && (
            <span className="ml-1 text-xs bg-dark-border px-2 py-1 rounded-full">
              {counts[tab.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default TabsSelector

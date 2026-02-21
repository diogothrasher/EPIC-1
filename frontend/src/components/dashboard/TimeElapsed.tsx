import React, { useState, useEffect } from 'react'

interface TimeElapsedProps {
  startDate: string | Date
  className?: string
}

export const TimeElapsed: React.FC<TimeElapsedProps> = ({ startDate, className = '' }) => {
  const [elapsed, setElapsed] = useState<string>('')

  useEffect(() => {
    const calculateElapsed = () => {
      const start = new Date(startDate)
      const now = new Date()
      const diff = now.getTime() - start.getTime()

      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) {
        return `${days}d ${hours % 24}h`
      } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`
      } else {
        return `${seconds}s`
      }
    }

    setElapsed(calculateElapsed())
    const interval = setInterval(() => {
      setElapsed(calculateElapsed())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [startDate])

  return <span className={className}>{elapsed || '—'}</span>
}

export default TimeElapsed

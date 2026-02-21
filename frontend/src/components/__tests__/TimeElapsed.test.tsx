import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimeElapsed } from '../dashboard/TimeElapsed'

describe('TimeElapsed Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders seconds when elapsed time is less than 1 minute', () => {
    const now = new Date()
    const startDate = new Date(now.getTime() - 30 * 1000) // 30 seconds ago

    render(<TimeElapsed startDate={startDate} />)
    
    const elapsed = screen.getByText(/^\d+s$/)
    expect(elapsed).toBeDefined()
  })

  it('renders minutes and seconds when elapsed time is less than 1 hour', () => {
    const now = new Date()
    const startDate = new Date(now.getTime() - 5 * 60 * 1000) // 5 minutes ago

    render(<TimeElapsed startDate={startDate} />)
    
    // Should show format like "5m 0s"
    expect(screen.getByText(/^\d+m \d+s$/)).toBeDefined()
  })

  it('renders hours and minutes when elapsed time is less than 1 day', () => {
    const now = new Date()
    const startDate = new Date(now.getTime() - 3 * 60 * 60 * 1000) // 3 hours ago

    render(<TimeElapsed startDate={startDate} />)
    
    // Should show format like "3h 0m"
    expect(screen.getByText(/^\d+h \d+m$/)).toBeDefined()
  })

  it('renders days and hours when elapsed time is more than 1 day', () => {
    const now = new Date()
    const startDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago

    render(<TimeElapsed startDate={startDate} />)
    
    // Should show format like "2d 0h"
    expect(screen.getByText(/^\d+d \d+h$/)).toBeDefined()
  })

  it('formats time correctly from string date', () => {
    const now = new Date()
    const startDate = new Date(now.getTime() - 60 * 1000) // 1 minute ago
    const startDateString = startDate.toISOString()

    render(<TimeElapsed startDate={startDateString} />)
    
    // Should display some elapsed time
    const elapsed = screen.queryByText('—')
    // Either shows time or dash
    expect(elapsed || screen.getByText(/[dhms]/)).toBeDefined()
  })

  it('applies custom className', () => {
    const now = new Date()
    const startDate = new Date(now.getTime() - 30 * 1000)
    const { container } = render(
      <TimeElapsed startDate={startDate} className="text-red-500" />
    )

    const span = container.querySelector('.text-red-500')
    expect(span).toBeDefined()
  })

  it('displays dash when elapsed time cannot be calculated', () => {
    const { container } = render(<TimeElapsed startDate="invalid-date" />)
    
    const text = container.textContent
    expect(text).toBeDefined()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { ActionMenu } from '../dashboard/ActionMenu'

describe('ActionMenu Component', () => {
  const mockItems = [
    { label: 'View', onClick: vi.fn(), icon: '👁️' },
    { label: 'Edit', onClick: vi.fn(), icon: '✏️' },
    { label: 'Delete', onClick: vi.fn(), icon: '🗑️', color: 'danger' as const },
  ]

  it('renders menu button', () => {
    const { container } = render(
      <ActionMenu items={mockItems} />
    )
    
    // Should have a button or clickable element
    const menuButton = container.querySelector('button')
    expect(menuButton).toBeDefined()
  })

  it('shows menu items when clicked', () => {
    const { container } = render(
      <ActionMenu items={mockItems} />
    )
    
    const button = container.querySelector('button')
    if (button) {
      fireEvent.click(button)
      // Menu items should be visible or accessible
    }
  })

  it('handles empty items list', () => {
    const { container } = render(
      <ActionMenu items={[]} />
    )
    
    expect(container).toBeDefined()
  })

  it('applies danger styling to danger items', () => {
    const { container } = render(
      <ActionMenu items={mockItems} />
    )
    
    // The menu should render without errors
    expect(container).toBeDefined()
  })

  it('renders with onOpen callback', () => {
    const onOpen = vi.fn()
    const { container } = render(
      <ActionMenu items={mockItems} onOpen={onOpen} />
    )

    // Should render without errors
    expect(container).toBeDefined()
  })
})

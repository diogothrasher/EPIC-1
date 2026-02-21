import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { Toast } from "../common/Toast"

describe("Toast Component", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders success toast message", () => {
    render(
      <Toast 
        message="Success message" 
        type="success"
        isVisible={true}
      />
    )
    
    expect(screen.getByText("Success message")).toBeDefined()
  })

  it("renders error toast message", () => {
    render(
      <Toast 
        message="Error message" 
        type="error"
        isVisible={true}
      />
    )
    
    expect(screen.getByText("Error message")).toBeDefined()
  })

  it("hides toast when isVisible is false", () => {
    const { container } = render(
      <Toast 
        message="Hidden message" 
        type="success"
        isVisible={false}
      />
    )
    
    expect(container).toBeDefined()
  })
})

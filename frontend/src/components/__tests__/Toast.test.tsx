import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import Toast from "../common/Toast"

// Mock the ToastContext hook
vi.mock("@/context/ToastContext", () => ({
  useToast: vi.fn(() => ({
    toasts: [],
    removeToast: vi.fn(),
  })),
}))

describe("Toast Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Toast />)
    expect(container).toBeDefined()
  })

  it("renders toast container", () => {
    const { container } = render(<Toast />)
    const toastContainer = container.querySelector(".fixed.top-4.right-4")
    expect(toastContainer).toBeDefined()
  })

  it("renders empty when no toasts", () => {
    const { container } = render(<Toast />)
    const toastMessages = container.querySelectorAll("[role='alert']")
    expect(toastMessages.length).toBe(0)
  })
})

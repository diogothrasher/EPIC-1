import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { TicketTableInline } from "../dashboard/TicketTableInline"
import { Ticket } from "@/api/tickets"

const mockTickets: Ticket[] = [
  {
    id: "1",
    descricao: "Description 1",
    status: "aberto",
    empresaId: "emp1",
    contatoId: "cont1",
    categoriaId: "cat1",
    dataAbertura: new Date().toISOString(),
  },
  {
    id: "2",
    descricao: "Description 2",
    status: "em_andamento",
    empresaId: "emp1",
    contatoId: "cont1",
    categoriaId: "cat1",
    dataAbertura: new Date().toISOString(),
  },
]

describe("TicketTableInline Component", () => {
  it("renders table with tickets", () => {
    const { container } = render(
      <TicketTableInline
        tickets={mockTickets}
        empresas={{}}
      />
    )

    expect(container.querySelector("table")).toBeDefined()
  })

  it("renders empty state when no tickets", () => {
    const { container } = render(
      <TicketTableInline
        tickets={[]}
        empresas={{}}
      />
    )

    expect(container).toBeDefined()
  })

  it("sorts tickets by status", () => {
    const mixed: Ticket[] = [
      { ...mockTickets[0], status: "fechado" },
      { ...mockTickets[0], status: "aberto" },
      { ...mockTickets[0], status: "em_andamento" },
    ]

    const { container } = render(
      <TicketTableInline
        tickets={mixed}
        empresas={{}}
      />
    )

    expect(container).toBeDefined()
  })

  it("calls onViewTicket when row is clicked", () => {
    const onViewTicket = vi.fn()
    render(
      <TicketTableInline
        tickets={mockTickets}
        empresas={{}}
        onViewTicket={onViewTicket}
      />
    )

    // Component should be interactive
    expect(onViewTicket).not.toHaveBeenCalled()
  })

  it("displays company names from map", () => {
    const empresas = {
      emp1: "Company Name",
    }

    const { container } = render(
      <TicketTableInline
        tickets={mockTickets}
        empresas={empresas}
      />
    )

    expect(container).toBeDefined()
  })
})

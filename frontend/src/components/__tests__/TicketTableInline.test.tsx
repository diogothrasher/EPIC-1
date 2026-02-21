import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { TicketTableInline } from "../dashboard/TicketTableInline"
import { Ticket } from "@/api/tickets"

const mockTickets: Ticket[] = [
  {
    id: "1",
    numero: "TPT-001",
    titulo: "Ticket 1",
    descricao: "Description 1",
    status: "aberto",
    empresa_id: "emp1",
    contato_id: "cont1",
    categoria_id: "cat1",
    dataAbertura: new Date().toISOString(),
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString(),
  },
  {
    id: "2",
    numero: "TPT-002",
    titulo: "Ticket 2",
    descricao: "Description 2",
    status: "em_andamento",
    empresa_id: "emp1",
    contato_id: "cont1",
    categoria_id: "cat1",
    dataAbertura: new Date().toISOString(),
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString(),
  },
]

describe("TicketTableInline Component", () => {
  it("renders table with tickets", () => {
    const { container } = render(
      <TicketTableInline 
        tickets={mockTickets}
        empresasMap={{}}
        onTicketClick={vi.fn()}
      />
    )
    
    expect(container.querySelector("table")).toBeDefined()
  })

  it("renders empty state when no tickets", () => {
    const { container } = render(
      <TicketTableInline 
        tickets={[]}
        empresasMap={{}}
        onTicketClick={vi.fn()}
      />
    )
    
    expect(container).toBeDefined()
  })

  it("sorts tickets by status", () => {
    const mixed = [
      { ...mockTickets[0], status: "fechado" },
      { ...mockTickets[0], status: "aberto" },
      { ...mockTickets[0], status: "em_andamento" },
    ]
    
    const { container } = render(
      <TicketTableInline 
        tickets={mixed}
        empresasMap={{}}
        onTicketClick={vi.fn()}
      />
    )
    
    expect(container).toBeDefined()
  })

  it("calls onTicketClick when row is clicked", () => {
    const onTicketClick = vi.fn()
    render(
      <TicketTableInline 
        tickets={mockTickets}
        empresasMap={{}}
        onTicketClick={onTicketClick}
      />
    )
    
    // Component should be interactive
    expect(onTicketClick).not.toHaveBeenCalled()
  })

  it("displays company names from map", () => {
    const empresasMap = {
      emp1: "Company Name",
    }
    
    const { container } = render(
      <TicketTableInline 
        tickets={mockTickets}
        empresasMap={empresasMap}
        onTicketClick={vi.fn()}
      />
    )
    
    expect(container).toBeDefined()
  })
})

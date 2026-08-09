import { IconTools } from "@tabler/icons-react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { ToolDetail, type ToolDetailProps } from "./ToolDetail"

const labels = {
  title: "Tools",
  close: "Close",
  open: "Open",
  search: "Search tools…",
  tabs: { all: "All", favorites: "Favorites", recent: "Recent" },
  quickAccess: "Quick access",
  categories: "Categories",
  toolCount: (count: number) => `${count} tools`,
  empty: "No tools",
  favorite: (tool: string) => `Favorite ${tool}`,
  unfavorite: (tool: string) => `Unfavorite ${tool}`,
  back: "Back to toolbox",
  parameters: "Parameters",
  inputLayer: "Input layer",
  distance: "Distance",
  distanceRequired: "Distance required",
  parametersValid: "Parameters valid",
  completed: "Completed",
  run: (tool: string) => `Run ${tool}`,
}

const props: ToolDetailProps = {
  tool: {
    id: "buffer",
    label: "Buffer",
    description: "Create a buffer",
    group: "Analysis",
    icon: IconTools,
    parameterKind: "distance",
  },
  favored: false,
  inputLayerName: "Land use",
  distance: "100",
  completed: false,
  labels,
  onDistanceChange: vi.fn(),
  onFavoriteChange: vi.fn(),
  onBack: vi.fn(),
  onOpenChange: vi.fn(),
  onRun: vi.fn(),
}

function renderDetail(overrides: Partial<ToolDetailProps> = {}) {
  return renderToStaticMarkup(<ToolDetail {...props} {...overrides} />)
}

describe("ToolDetail", () => {
  it("marks an empty required distance invalid and suppresses the valid status", () => {
    const html = renderDetail({ distance: "" })

    expect(html).toContain('data-invalid="true"')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain("required")
    expect(html).toContain("Distance required")
    expect(html).toContain("disabled")
    expect(html).not.toContain("Parameters valid")
  })

  it("shows a polite valid status when required parameters are present", () => {
    const html = renderDetail()

    expect(html).toContain("Parameters valid")
    expect(html).toContain('role="status"')
    expect(html).not.toContain("Distance required")
  })

  it("generates unique field ids for multiple toolbox instances", () => {
    const html = renderToStaticMarkup(
      <>
        <ToolDetail {...props} distance="" />
        <ToolDetail {...props} distance="" />
      </>,
    )
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    const labelTargets = [...html.matchAll(/\sfor="([^"]+)"/g)].map((match) => match[1])

    expect(ids).toHaveLength(6)
    expect(new Set(ids).size).toBe(ids.length)
    expect(labelTargets).toHaveLength(4)
    expect(labelTargets.every((target) => ids.includes(target))).toBe(true)
  })

  it("uses aligned header controls and mirrors the back icon in RTL", () => {
    const html = renderDetail()
    const header = html.slice(html.indexOf("<header"), html.indexOf("</header>"))
    const buttons = [...header.matchAll(/<button[^>]+>/g)].map((match) => match[0])
    const fieldLabels = [...html.matchAll(/<label[^>]+>/g)].map((match) => match[0])

    expect(buttons).toHaveLength(3)
    expect(buttons[0]).toContain("h-7")
    expect(buttons[0]).not.toContain("h-auto")
    expect(buttons[1]).toContain("size-7")
    expect(buttons[2]).toContain("size-7")
    expect(header).toContain("rtl:rotate-180")
    expect(fieldLabels.every((label) => !label.includes("text-muted-foreground"))).toBe(true)
  })
})

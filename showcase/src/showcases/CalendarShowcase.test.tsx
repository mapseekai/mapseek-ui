import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

vi.mock("@registry/ui/button", async () => {
  return await import("../../../registry/ui/button")
})

vi.mock("@/registry/ui/button", async () => {
  return await import("../../../registry/ui/button")
})

vi.mock("@registry/ui/calendar", async () => {
  return await import("../../../registry/ui/calendar")
})

vi.mock("@registry/ui/popover", async () => {
  return await import("../../../registry/ui/popover")
})

import { CalendarOverviewDemo } from "./CalendarShowcase"

describe("CalendarOverviewDemo", () => {
  it("keeps the date picker trigger background neutral while the popover is expanded", () => {
    const html = renderToStaticMarkup(<CalendarOverviewDemo />)

    expect(html).toContain("aria-expanded:bg-background")
    expect(html).toContain("aria-expanded:hover:bg-accent/50")
  })

  it("keeps the placeholder text muted while the popover is expanded", () => {
    const html = renderToStaticMarkup(<CalendarOverviewDemo />)

    expect(html).toContain("aria-expanded:text-muted-foreground")
    expect(html).toContain("aria-expanded:hover:text-muted-foreground")
  })
})

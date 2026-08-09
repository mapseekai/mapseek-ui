import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))
vi.mock("@/components/ui/tag", async () => import("../../ui/tag"))
vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}))
vi.mock("recharts", () => ({
  Bar: () => null,
  BarChart: ({ children }: { children?: ReactNode }) => <>{children}</>,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
}))

import { BandStat } from "./BandStat"

const labels = {
  min: "Min",
  max: "Max",
  mean: "Mean",
  stddev: "Std. dev.",
  histogram: "Histogram",
  histogramMeta: "64 bins",
  histogramYAxis: "Count",
  histogramXAxis: "Value range",
  histogramCount: "Count",
}

function renderBandStat(name = "Coastal aerosol") {
  return renderToStaticMarkup(
    <BandStat
      data={{
        band: "B1",
        name,
        type: "UINT16",
        min: 0,
        max: 16_382,
        mean: 1_182,
        stddev: 432,
        histogram: Array.from({ length: 64 }, () => 1),
      }}
      labels={labels}
    />,
  )
}

describe("BandStat", () => {
  it("uses the approved compact orange Tag for the data type", () => {
    const html = renderBandStat()

    expect(html).toContain('data-slot="tag"')
    expect(html).toContain('data-color="orange"')
    expect(html).toContain('data-size="sm"')
    expect(html).not.toContain("border-warning/25")
  })

  it("uses two responsive metric columns with complete separators", () => {
    const html = renderBandStat()

    expect(html).toContain("grid-cols-2")
    expect(html).toContain("sm:grid-cols-4")
    expect(html).toContain("border-r border-b border-border sm:border-b-0")
    expect(html).toContain("border-b border-border sm:border-r sm:border-b-0")
  })

  it("truncates a long band name while retaining its full title", () => {
    const name = "Coastal aerosol measurement with a very long identifier"
    const html = renderBandStat(name)

    expect(html).toContain(`title="${name}"`)
    expect(html).toMatch(/class="[^"]*min-w-0[^"]*truncate[^"]*"/)
  })
})

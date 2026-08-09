import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock(
  "@/components/ui/button-radio-group",
  async () => await import("../../ui/button-radio-group"),
)
vi.mock("@/components/ui/input", async () => await import("../../ui/input"))
vi.mock("@/components/ui/input-number", async () => await import("../../ui/input-number"))
vi.mock("@/lib/utils", async () => await import("../../lib/utils"))
vi.mock("@/registry/lib/utils", async () => await import("../../lib/utils"))

import { StretchControl } from "./StretchControl"

const labels = {
  modes: {
    custom: "Custom",
    minmax: "Min max",
    percent: "Percent",
    stddev: "Std dev",
  },
  percentHint: "pc =",
  sigmaHint: "sigma =",
  sigmaSuffix: "mean +/- sigma",
  auto: "Auto",
}

const inputTag = (html: string, label: string) =>
  (html.match(/<input[^>]*>/g) ?? []).find((tag) => tag.includes(`aria-label="${label}"`))

describe("StretchControl", () => {
  it("renders standard deviation with the shared InputNumber", () => {
    const html = renderToStaticMarkup(
      <StretchControl value={{ mode: "stddev", sigma: 2 }} labels={labels} onChange={() => {}} />,
    )

    const input = inputTag(html, "Stretch standard deviation")

    expect(input).toContain('data-slot="input-number-input"')
    expect(html).toContain('data-slot="input-number"')
    expect(html).toContain('data-step="any"')
    expect(html).toContain("pe-14")
    expect(html).toContain("absolute")
  })

  it("bounds percentile entries between zero and one hundred", () => {
    const html = renderToStaticMarkup(
      <StretchControl
        value={{ mode: "percent", percent: [2, 98] }}
        labels={labels}
        onChange={() => {}}
      />,
    )

    const low = inputTag(html, "Stretch percentile low")
    const high = inputTag(html, "Stretch percentile high")

    expect(low).toContain('data-slot="input-number-input"')
    expect(high).toContain('data-slot="input-number-input"')
    expect(html.match(/data-slot="input-number"/g) ?? []).toHaveLength(2)
    expect(html.match(/data-step="any"/g) ?? []).toHaveLength(2)
  })

  it("applies dataRange to custom stretch endpoints", () => {
    const html = renderToStaticMarkup(
      <StretchControl
        value={{ mode: "custom", ranges: [[0, 10]] }}
        dataRange={[-18.4, 3842]}
        labels={labels}
        onChange={() => {}}
      />,
    )

    const minimum = inputTag(html, "Custom stretch 1 minimum")
    const maximum = inputTag(html, "Custom stretch 1 maximum")

    expect(minimum).toContain('data-slot="input-number-input"')
    expect(maximum).toContain('data-slot="input-number-input"')
    expect(html.match(/data-slot="input-number"/g) ?? []).toHaveLength(2)
    expect(html.match(/data-step="any"/g) ?? []).toHaveLength(2)
  })
})

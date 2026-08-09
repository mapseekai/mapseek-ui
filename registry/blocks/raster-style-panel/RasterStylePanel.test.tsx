import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", async () => await import("../../ui/button"))
vi.mock(
  "@/components/ui/button-radio-group",
  async () => await import("../../ui/button-radio-group"),
)
vi.mock("@/components/ui/input", async () => await import("../../ui/input"))
vi.mock("@/components/ui/input-number", async () => await import("../../ui/input-number"))
vi.mock("@/components/ui/select", async () => await import("../../ui/select"))
vi.mock("@/components/ui/tooltip", async () => await import("../../ui/tooltip"))
vi.mock("@/lib/mapseek-labels", async () => await import("../../lib/labels"))
vi.mock("@/lib/utils", async () => await import("../../lib/utils"))
vi.mock("@/registry/lib/utils", async () => await import("../../lib/utils"))

import { RasterStylePanel } from "./RasterStylePanel"
import type { RasterStyleLabels, RasterStyleValue } from "./types"

const value: RasterStyleValue = {
  mode: "SINGLE",
  selector: { kind: "bands", bands: [1], assignments: {} },
  colormap: { kind: "none" },
  stretch: { mode: "stddev", sigma: 2 },
  resampling: "bilinear",
  tileSize: 256,
  format: "webp",
}

const labels: RasterStyleLabels = {
  band: "Band",
  renderMode: "Render mode",
  renderSingle: "Single band",
  renderRgb: "RGB composite",
  bandAppend: "Add",
  colormap: "Colormap",
  customColormap: "Custom",
  stretch: "Stretch",
  stretchModes: {
    custom: "Custom",
    minmax: "Min max",
    percent: "Percent",
    stddev: "Std dev",
  },
  percentHint: "pc =",
  sigmaHint: "sigma =",
  sigmaSuffix: "mean +/- sigma",
  auto: "Auto",
  nodata: "NoData",
  resampling: "Resampling",
  resamplingModes: {
    nearest: "Nearest",
    bilinear: "Bilinear",
    cubic: "Cubic",
    cubicspline: "Cubic spline",
    lanczos: "Lanczos",
    average: "Average",
    mode: "Mode",
  },
  tileSize: "Tile size",
  format: "Format",
  formatModes: { png: "PNG", webp: "WebP", jpeg: "JPEG" },
  multibandNote: "RGB composites do not use a colormap",
}

const inputTag = (html: string, label: string) =>
  (html.match(/<input[^>]*>/g) ?? []).find((tag) => tag.includes(`aria-label="${label}"`))

describe("RasterStylePanel", () => {
  it("renders scalar raster choices as Select controls and stretch as a soft button radio group", () => {
    const html = renderToStaticMarkup(
      <RasterStylePanel value={value} labels={labels} onChange={() => {}} />,
    )

    const selectTriggers = html.match(/<button[^>]*data-slot="select-trigger"[^>]*>/g) ?? []

    expect(selectTriggers).toHaveLength(4)
    for (const trigger of selectTriggers) {
      expect(trigger).toContain('data-size="default"')
    }
    expect(html).toMatch(/data-slot="select-value"[^>]*>Bilinear<\/span>/)
    expect(html).toMatch(/data-slot="select-value"[^>]*>WebP<\/span>/)
    expect(html).toContain('aria-label="Resampling"')
    expect(html).toContain('aria-label="Format"')
    expect(html).toContain('aria-label="Tile size"')
    expect(html).toContain('data-slot="button-radio-group"')
    expect(html).toContain('data-variant="soft"')
    expect(html).toContain("text-body-md uppercase text-muted-foreground")
  })

  it("uses soft button radio groups for render mode and colormap mode", () => {
    const html = renderToStaticMarkup(
      <RasterStylePanel value={value} labels={labels} onChange={() => {}} />,
    )
    const radioGroups = html.match(/<[^>]*data-slot="button-radio-group"[^>]*>/g) ?? []
    const renderMode = radioGroups.find((tag) => tag.includes('aria-label="Render mode"'))
    const colormap = radioGroups.find((tag) => tag.includes('aria-label="Colormap"'))

    expect(radioGroups).toHaveLength(3)
    expect(renderMode).toContain('data-variant="soft"')
    expect(colormap).toContain('data-variant="soft"')
  })

  it("uses localized RGB channel prefixes", () => {
    const html = renderToStaticMarkup(
      <RasterStylePanel
        value={{
          ...value,
          selector: {
            kind: "bands",
            bands: [1, 2, 3],
            assignments: { red: 1, green: 2, blue: 3 },
          },
        }}
        labels={{
          ...labels,
          channelLabels: { red: "红", green: "绿", blue: "蓝" },
        }}
        onChange={() => {}}
      />,
    )

    expect(html).toContain(">红</span>")
    expect(html).toContain(">绿</span>")
    expect(html).toContain(">蓝</span>")
    expect(html).toContain('aria-label="红 Band"')
  })

  it("does not render legacy raster metadata above the style controls", () => {
    const html = renderToStaticMarkup(
      <RasterStylePanel
        value={value}
        labels={labels}
        onChange={() => {}}
        stats={[{ label: "Band count", value: "4 / 13", unit: "UInt16" }]}
      />,
    )

    expect(html).not.toContain("Band count")
    expect(html).not.toContain("4 / 13")
  })

  it("shows the applied custom colormap as a gradient preview", () => {
    const html = renderToStaticMarkup(
      <RasterStylePanel
        value={{
          ...value,
          colormap: {
            kind: "custom",
            value: {
              interpolation: "step",
              colorSpace: "srgb",
              entries: [
                { value: 0, color: "#102030" },
                { value: 50, color: "#405060" },
                { value: 100, color: "#708090" },
              ],
            },
          },
        }}
        labels={labels}
        onChange={() => {}}
        onEditCustomColormap={() => {}}
      />,
    )

    expect(html).toContain('data-slot="custom-colormap-preview"')
    expect(html).toContain("#102030")
    expect(html).toContain("#405060")
    expect(html).toContain("#708090")
    expect(html).toContain("#102030 33.33%")
    expect(html).toContain("#405060 33.33%")
  })

  it("uses InputNumber for inline colormap stops while preserving NoData text", () => {
    const html = renderToStaticMarkup(
      <RasterStylePanel
        value={{
          ...value,
          colormap: {
            kind: "custom",
            value: {
              entries: [
                { value: 0, color: "#000000" },
                { value: 1, color: "#ffffff" },
              ],
            },
          },
          nodata: { kind: "custom", custom: -9999 },
        }}
        dataRange={[-18.4, 3842]}
        labels={labels}
        onChange={() => {}}
      />,
    )

    const stopValue = inputTag(html, "Colormap stop 1 value")
    const noData = inputTag(html, "Custom NoData")

    expect(stopValue).toContain('data-slot="input-number-input"')
    expect(html).toContain('data-slot="input-number"')
    expect(html).toContain('data-step="any"')
    expect(noData).not.toContain('type="number"')
    expect(noData).not.toContain("min=")
    expect(noData).not.toContain("max=")
  })
})

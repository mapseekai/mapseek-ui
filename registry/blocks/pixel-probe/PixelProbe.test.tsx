import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PixelProbe } from "./PixelProbe"
import type { PixelProbeLabels } from "./types"

const labels: PixelProbeLabels = {
  title: "Pixel probe",
  copy: "Copy JSON",
  copied: "Copied",
  close: "Close",
  prev: "Previous pixel",
  next: "Next pixel",
  pointPrefix: "PT",
  empty: "No selected pixel",
  locked: "Locked",
}

describe("PixelProbe", () => {
  it("exposes a named section and semantic field relationships", () => {
    const html = renderToStaticMarkup(
      <PixelProbe
        labels={labels}
        count={2}
        fields={[
          { key: "band", type: "INT", value: "1 / 1", locked: true },
          { key: "colormap", type: "ENUM", value: "viridis" },
        ]}
      />,
    )

    expect(html).toContain("<section")
    expect(html).toContain('aria-label="Pixel probe"')
    expect(html).toContain("<dl")
    expect(html).toContain("<dt")
    expect(html).toContain("<dd")
    expect(html).toContain('data-slot="tag"')
    expect(html).toContain('data-color="gray"')
    expect(html).toContain('data-size="sm"')
    expect(html).toContain('<span class="sr-only">Locked</span>')
    expect(html.match(/<svg[^>]*aria-hidden="true"/g)).toHaveLength(2)
  })

  it("renders the injected empty state inside the panel", () => {
    const html = renderToStaticMarkup(<PixelProbe labels={labels} fields={[]} />)

    expect(html).toContain('data-slot="empty"')
    expect(html).toContain('data-slot="empty-header"')
    expect(html).toContain('data-slot="empty-title"')
    expect(html).toContain("No selected pixel")
    expect(html).toContain("Pixel probe")
  })

  it("keeps long values scrollable without moving their unit", () => {
    const html = renderToStaticMarkup(
      <PixelProbe
        labels={labels}
        fields={[
          {
            key: "identifier",
            type: "TEXT",
            value: "a-very-long-raster-identifier-that-must-remain-selectable",
            unit: "m",
          },
        ]}
      />,
    )

    expect(html).toContain("min-w-0 flex-1 overflow-x-auto whitespace-nowrap")
    expect(html).toContain("shrink-0")
    expect(html).not.toContain("overflow-x-hidden")
  })
})

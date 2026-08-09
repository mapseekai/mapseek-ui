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

function buttonTag(html: string, accessibleName: string) {
  const match = html.match(new RegExp(`<button[^>]*aria-label="${accessibleName}"[^>]*>`))
  expect(match, `button ${accessibleName}`).not.toBeNull()
  return match?.[0] ?? ""
}

function isDisabled(openingTag: string) {
  return /\sdisabled=""/u.test(openingTag)
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
    expect(html).toMatch(/<section[^>]*class="[^"]*\bnot-prose\b[^"]*"/u)
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

  it("omits navigation buttons whose callbacks are missing", () => {
    const html = renderToStaticMarkup(
      <PixelProbe labels={labels} fields={[]} index={2} count={3} />,
    )

    expect(html).not.toContain('aria-label="Previous pixel"')
    expect(html).not.toContain('aria-label="Next pixel"')
    expect(html).toContain("PT 2")
  })

  it("disables navigation at one-based count boundaries", () => {
    const first = renderToStaticMarkup(
      <PixelProbe
        labels={labels}
        fields={[]}
        index={1}
        count={3}
        onPrev={() => {}}
        onNext={() => {}}
      />,
    )
    const last = renderToStaticMarkup(
      <PixelProbe
        labels={labels}
        fields={[]}
        index={3}
        count={3}
        onPrev={() => {}}
        onNext={() => {}}
      />,
    )

    expect(isDisabled(buttonTag(first, labels.prev))).toBe(true)
    expect(isDisabled(buttonTag(first, labels.next))).toBe(false)
    expect(isDisabled(buttonTag(last, labels.prev))).toBe(false)
    expect(isDisabled(buttonTag(last, labels.next))).toBe(true)
  })

  it("honors explicit navigation disabled states", () => {
    const html = renderToStaticMarkup(
      <PixelProbe
        labels={labels}
        fields={[]}
        index={2}
        count={3}
        prevDisabled
        nextDisabled
        onPrev={() => {}}
        onNext={() => {}}
      />,
    )

    expect(isDisabled(buttonTag(html, labels.prev))).toBe(true)
    expect(isDisabled(buttonTag(html, labels.next))).toBe(true)
  })
})

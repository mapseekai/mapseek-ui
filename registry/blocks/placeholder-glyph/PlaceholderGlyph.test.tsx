import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PlaceholderGlyph } from "./PlaceholderGlyph"

describe("PlaceholderGlyph", () => {
  it("stays decorative when no accessible title is supplied", () => {
    const html = renderToStaticMarkup(<PlaceholderGlyph seed="layer" />)

    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('role="img"')
    expect(html).not.toContain("<title")
  })

  it("uses injected titles as unique accessible names", () => {
    const html = renderToStaticMarkup(
      <>
        <PlaceholderGlyph seed="layer" title="图层" />
        <PlaceholderGlyph seed="search" title="Search" />
      </>,
    )
    const labelledBy = [...html.matchAll(/aria-labelledby="([^"]+)"/g)].map(([, id]) => id)

    expect(html.match(/role="img"/g) ?? []).toHaveLength(2)
    expect(labelledBy).toHaveLength(2)
    expect(new Set(labelledBy).size).toBe(2)
    for (const id of labelledBy) expect(html).toContain(`id="${id}"`)
    expect(html).toContain(">图层</title>")
    expect(html).toContain(">Search</title>")
    expect(html).not.toContain("Placeholder resource glyph")
  })

  it("keeps viewBox stroke width constant across rendered sizes", () => {
    const small = renderToStaticMarkup(<PlaceholderGlyph size={16} />)
    const large = renderToStaticMarkup(<PlaceholderGlyph size={72} />)

    expect(small).toContain('stroke-width="2"')
    expect(large).toContain('stroke-width="2"')
  })
})

import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { LayerEditorGroup } from "./LayerEditorGroup"

const sections = [
  { id: "layer", title: "Layer", children: <span>Layer content</span> },
  { id: "paint", title: "Paint", children: <span>Paint content</span> },
]

function renderGroup() {
  return renderToStaticMarkup(<LayerEditorGroup sections={sections} />)
}

describe("LayerEditorGroup", () => {
  it("keeps sticky headers inside a bounded local stacking context", () => {
    const html = renderGroup()
    const stickyHeaders = html.match(/<div class="[^"]*\bsticky\b[^"]*" style="[^"]*">/g) ?? []

    expect(html).toMatch(/data-slot="accordion" class="[^"]*\bisolate\b/)
    expect(stickyHeaders).toHaveLength(2)
    for (const header of stickyHeaders) {
      expect(header).toContain("z-10")
      expect(header).not.toContain("z-index:")
    }
  })

  it("uses the normal hover treatment while a disclosure is expanded", () => {
    const html = renderGroup()

    expect(html).toContain("hover:bg-accent/50")
    expect(html).toContain("hover:text-foreground")
    expect(html).toContain("aria-expanded:bg-accent/50")
    expect(html).toContain("aria-expanded:text-foreground")
  })

  it("keeps the complete headline typography token", () => {
    const html = renderGroup()

    expect(html).toContain("text-headline-sm")
    expect(html).not.toContain("leading-5")
  })

  it("hides the decorative section icon from assistive technology", () => {
    const html = renderGroup()
    const icon = html.match(/<svg[^>]*tabler-icon-flag[^>]*>/)?.[0]

    expect(icon).toContain('width="14"')
    expect(icon).toContain('height="14"')
    expect(icon).toContain('stroke-width="1.5"')
    expect(icon).toContain('aria-hidden="true"')
  })
})

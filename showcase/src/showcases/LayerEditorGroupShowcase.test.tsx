import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { buildLayerEditorSections } from "./layer-editor-sections"

function renderSection(id: string) {
  const section = buildLayerEditorSections().find((candidate) => candidate.id === id)

  if (!section) throw new Error(`Missing ${id} section`)

  return renderToStaticMarkup(section.children)
}

describe("LayerEditorGroup showcase fields", () => {
  it("uses semantic Field labels for essential editor text", () => {
    const html = renderSection("layer")
    const labels = html.match(/<label[^>]*data-slot="field-label"[^>]*>/g) ?? []

    expect(html).toContain('data-slot="field-group"')
    expect(labels).toHaveLength(5)
    for (const label of labels) {
      expect(label).toContain("text-body-md")
      expect(label).not.toContain("text-xs")
      expect(label).not.toContain("text-muted-foreground")
    }
  })

  it("associates the filter expression with a readable label", () => {
    const html = renderSection("filter")

    expect(html).toContain('for="layer-editor-group-filter-expression"')
    expect(html).toContain('id="layer-editor-group-filter-expression"')
    expect(html).toContain(">过滤器</label>")
  })
})

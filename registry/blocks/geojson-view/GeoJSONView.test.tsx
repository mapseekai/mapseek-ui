import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/json-viewer", () => ({
  JsonViewer: ({
    copyLabel,
    copiedLabel,
    itemLabel,
    itemsLabel,
    copyContent,
  }: {
    copyLabel?: string
    copiedLabel?: string
    itemLabel?: string
    itemsLabel?: string
    copyContent?: string
  }) => (
    <div
      data-slot="json-viewer"
      data-copy-label={copyLabel}
      data-copied-label={copiedLabel}
      data-item-label={itemLabel}
      data-items-label={itemsLabel}
      data-copy-content={copyContent}
    />
  ),
}))

import { GeoJSONView } from "./GeoJSONView"

const labels = {
  copy: "Copy JSON",
  copied: "Copied",
  item: "item",
  items: "items",
  parseError: "Unable to parse JSON",
  unsupportedValue: "Only JSON objects and arrays are supported",
}

describe("GeoJSONView", () => {
  it("renders an explicit destructive alert when JSON parsing fails", () => {
    const html = renderToStaticMarkup(
      <GeoJSONView json="{ invalid" emptyLabel="No GeoJSON" labels={labels} />,
    )

    expect(html).toContain('role="alert"')
    expect(html).toContain("text-destructive")
    expect(html).toContain("Unable to parse JSON")
    expect(html).toContain("{ invalid")
  })

  it("renders an explicit warning status for unsupported primitive JSON", () => {
    const html = renderToStaticMarkup(
      <GeoJSONView json='"point"' emptyLabel="No GeoJSON" labels={labels} />,
    )

    expect(html).toContain('role="status"')
    expect(html).toContain("text-warning")
    expect(html).toContain("Only JSON objects and arrays are supported")
    expect(html).toContain("&quot;point&quot;")
  })

  it("keeps essential empty-state copy on the normal foreground", () => {
    const html = renderToStaticMarkup(
      <GeoJSONView json={null} emptyLabel="No GeoJSON" labels={labels} />,
    )

    expect(html).toContain('<code class="whitespace-pre-wrap text-foreground">No GeoJSON</code>')
  })

  it("uses semantic fallback markup without block content inside pre", () => {
    const html = renderToStaticMarkup(
      <GeoJSONView json={'{\n  "type":'} emptyLabel="No GeoJSON" labels={labels} />,
    )

    expect(html).not.toContain("<pre")
    expect(html).not.toMatch(/<code[^>]*>\s*<div/)
  })

  it("forwards injected viewer labels and copies the original formatted JSON", () => {
    const source = '{\n  "type": "Feature"\n}'
    const html = renderToStaticMarkup(
      <GeoJSONView json={source} emptyLabel="No GeoJSON" labels={labels} />,
    )

    expect(html).toContain('data-copy-label="Copy JSON"')
    expect(html).toContain('data-copied-label="Copied"')
    expect(html).toContain('data-item-label="item"')
    expect(html).toContain('data-items-label="items"')
    expect(html).toContain('data-copy-content="{\n  &quot;type&quot;: &quot;Feature&quot;\n}"')
  })
})

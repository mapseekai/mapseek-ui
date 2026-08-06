import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { ButtonRadioGroup, ButtonRadioGroupItem } from "./button-radio-group"

describe("button radio group icons", () => {
  it("renders an icon slot while preserving group size and selected-state variants", () => {
    const html = renderToStaticMarkup(
      <ButtonRadioGroup size="sm" variant="soft" defaultValue="map" aria-label="View">
        <ButtonRadioGroupItem value="map" icon={<svg data-testid="map-icon" />}>
          Map
        </ButtonRadioGroupItem>
      </ButtonRadioGroup>,
    )

    expect(html).toContain('data-size="sm"')
    expect(html).toContain('data-variant="soft"')
    expect(html).toContain('data-slot="button-radio-group-item-icon"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('data-testid="map-icon"')
    expect(html).toContain("Map")
  })

  it("supports an accessible icon-only item", () => {
    const html = renderToStaticMarkup(
      <ButtonRadioGroup defaultValue="map" aria-label="View">
        <ButtonRadioGroupItem value="map" icon={<svg />} aria-label="Map view" />
      </ButtonRadioGroup>,
    )

    expect(html).toContain('aria-label="Map view"')
    expect(html).toContain('data-slot="button-radio-group-item-icon"')
  })
})

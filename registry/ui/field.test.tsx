import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", async () => await import("../lib/utils"))
vi.mock("@/registry/ui/label", async () => await import("./label"))
vi.mock("@/registry/ui/separator", async () => await import("./separator"))

import { FieldLabel, FieldLegend } from "./field"

describe("Field required markers", () => {
  it("appends a red destructive marker only to required field names", () => {
    const html = renderToStaticMarkup(
      <>
        <FieldLabel required htmlFor="dataset-name">
          Dataset name
        </FieldLabel>
        <FieldLegend required variant="label">
          Layers
        </FieldLegend>
        <FieldLabel htmlFor="description">Description</FieldLabel>
      </>,
    )

    expect(html.match(/data-slot="field-required-indicator"/g) ?? []).toHaveLength(2)
    expect(html).toContain('class="text-destructive"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('Description<span data-slot="field-required-indicator"')
  })
})

import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/checkbox", async () => await import("../../ui/checkbox"))
vi.mock("@/components/ui/field", async () => await import("../../ui/field"))
vi.mock("@/components/ui/input", async () => await import("../../ui/input"))
vi.mock("@/components/ui/select", async () => await import("../../ui/select"))
vi.mock("@/lib/utils", async () => await import("../../lib/utils"))
vi.mock("@/registry/lib/utils", async () => await import("../../lib/utils"))
vi.mock("@/registry/ui/label", async () => await import("../../ui/label"))
vi.mock("@/registry/ui/separator", async () => await import("../../ui/separator"))

import { SchemaForm } from "./SchemaForm"

describe("SchemaForm", () => {
  it("gives every multiselect option row equal vertical padding", () => {
    const html = renderToStaticMarkup(
      <SchemaForm
        fields={[
          {
            key: "layers",
            label: "Layers",
            type: "multiselect",
            options: [
              { label: "roads", value: "roads" },
              { label: "rivers", value: "rivers" },
              { label: "parcels", value: "parcels" },
            ],
          },
        ]}
        values={{ layers: [] }}
        onChange={() => undefined}
      />,
    )

    const optionRows = [...html.matchAll(/<fieldset data-slot="field"[^>]*class="([^"]+)"/g)]

    expect(optionRows).toHaveLength(3)
    for (const [, className] of optionRows) {
      expect(className).toContain("py-1.5")
    }
  })
})

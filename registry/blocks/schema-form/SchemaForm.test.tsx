import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/checkbox", async () => await import("../../ui/checkbox"))
vi.mock("@/components/ui/empty", async () => await import("../../ui/empty"))
vi.mock("@/components/ui/field", async () => await import("../../ui/field"))
vi.mock("@/components/ui/input", async () => await import("../../ui/input"))
vi.mock("@/components/ui/select", async () => await import("../../ui/select"))
vi.mock("@/lib/utils", async () => await import("../../lib/utils"))
vi.mock("@/registry/lib/utils", async () => await import("../../lib/utils"))
vi.mock("@/registry/ui/label", async () => await import("../../ui/label"))
vi.mock("@/registry/ui/separator", async () => await import("../../ui/separator"))

import { SchemaForm } from "./SchemaForm"
import type { SchemaFormField } from "./types"

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

  it("uses the shared primary marker for every required field name", () => {
    const html = renderToStaticMarkup(
      <SchemaForm
        fields={[
          { key: "radius", label: "Radius", required: true, type: "number" },
          {
            key: "layers",
            label: "Layers",
            required: true,
            type: "multiselect",
            options: [{ label: "roads", value: "roads" }],
          },
          {
            key: "method",
            label: "Method",
            required: true,
            type: "select",
            options: [{ label: "Douglas-Peucker", value: "dp" }],
          },
        ]}
        values={{ radius: undefined, layers: [] }}
        onChange={() => undefined}
      />,
    )

    expect(html.match(/data-slot="field-required-indicator"/g) ?? []).toHaveLength(3)
    expect(html).toContain('name="radius"')
    expect(html).toContain('required=""')
    expect(html.match(/aria-required="true"/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
  })

  it("renders current values instead of field defaults", () => {
    const fields: SchemaFormField[] = [
      { key: "radius", label: "Radius", type: "number", default: 5 },
      { key: "crs", label: "CRS", type: "text", default: "EPSG:4326" },
      {
        key: "method",
        label: "Method",
        type: "select",
        default: "dp",
        options: [
          { value: "dp", label: "Douglas-Peucker" },
          { value: "vw", label: "Visvalingam" },
        ],
      },
    ]

    const changed = renderToStaticMarkup(
      <SchemaForm
        fields={fields}
        values={{ radius: 25, crs: "EPSG:3857", method: "vw" }}
        onChange={() => undefined}
      />,
    )
    const reset = renderToStaticMarkup(
      <SchemaForm
        fields={fields}
        values={{ radius: 5, crs: "EPSG:4326", method: "dp" }}
        onChange={() => undefined}
      />,
    )

    expect(changed).toContain('value="25"')
    expect(changed).toContain('value="EPSG:3857"')
    expect(changed).toContain("Visvalingam")
    expect(reset).toContain('value="5"')
    expect(reset).toContain('value="EPSG:4326"')
    expect(reset).toContain("Douglas-Peucker")
  })

  it("generates unique ids for sibling form instances", () => {
    const fields: SchemaFormField[] = [{ key: "radius", label: "Radius", type: "number" }]
    const html = renderToStaticMarkup(
      <>
        <SchemaForm fields={fields} values={{}} onChange={() => undefined} />
        <SchemaForm fields={fields} values={{}} onChange={() => undefined} />
      </>,
    )
    const ids = [...html.matchAll(/<input[^>]+id="([^"]+-radius)"/g)].map((match) => match[1])

    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })

  it("uses field keys as names and allows form metadata overrides", () => {
    const html = renderToStaticMarkup(
      <SchemaForm
        idPrefix="buffer"
        fields={[
          { key: "radius", label: "Radius", type: "number" },
          {
            key: "crs",
            label: "CRS",
            type: "text",
            name: "target-crs",
            autoComplete: "organization",
          },
        ]}
        values={{}}
        onChange={() => undefined}
      />,
    )

    expect(html).toContain('name="radius"')
    expect(html).toContain('autoComplete="off"')
    expect(html).toContain('name="target-crs"')
    expect(html).toContain('autoComplete="organization"')
  })

  it("forwards required semantics to controls and groups", () => {
    const html = renderToStaticMarkup(
      <SchemaForm
        fields={[
          { key: "radius", label: "Radius", required: true, type: "number" },
          { key: "method", label: "Method", required: true, type: "select", options: [] },
          { key: "layers", label: "Layers", required: true, type: "multiselect", options: [] },
        ]}
        values={{}}
        onChange={() => undefined}
      />,
    )

    expect(html).toContain("required")
    expect(html.match(/aria-required="true"/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
  })

  it("renders field errors with invalid and described-by relationships", () => {
    const html = renderToStaticMarkup(
      <SchemaForm
        idPrefix="buffer"
        fields={[{ key: "radius", label: "Radius", type: "number" }]}
        values={{}}
        errors={{ radius: "Enter a radius." }}
        onChange={() => undefined}
      />,
    )

    expect(html).toContain('data-invalid="true"')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain('aria-describedby="buffer-radius-error"')
    expect(html).toContain('id="buffer-radius-error"')
    expect(html).toContain("Enter a radius.")
  })

  it("renders a localized shared empty state for multiselect", () => {
    const html = renderToStaticMarkup(
      <SchemaForm
        fields={[
          { key: "available", label: "Available", type: "multiselect", options: [] },
          {
            key: "layers",
            label: "Layers",
            type: "multiselect",
            options: [],
            emptyHint: "No layers",
          },
        ]}
        labels={{ emptyOptions: "Nothing available" }}
        values={{}}
        onChange={() => undefined}
      />,
    )

    expect(html.match(/data-slot="empty"/g) ?? []).toHaveLength(2)
    expect(html).toContain("Nothing available")
    expect(html).toContain("No layers")
  })
})

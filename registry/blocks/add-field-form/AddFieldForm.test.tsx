import { IconAbc } from "@tabler/icons-react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/checkbox", () => ({ Checkbox: "div" }))
vi.mock("@/components/ui/field", () => ({
  Field: "div",
  FieldDescription: "div",
  FieldGroup: "div",
  FieldLabel: "label",
  FieldLegend: "legend",
  FieldSet: "fieldset",
}))
vi.mock("@/components/ui/input", () => ({ Input: "input" }))
vi.mock("@/components/ui/toggle-group", () => ({
  ToggleGroup: "div",
  ToggleGroupItem: "button",
}))
vi.mock("@/lib/utils", () => ({
  cn: (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" "),
}))

import { AddFieldForm } from "./AddFieldForm"

describe("AddFieldForm", () => {
  it("does not override the shared input surface for field inputs", () => {
    const html = renderToStaticMarkup(
      <AddFieldForm
        value={{
          name: "status",
          type: "enum",
          enumValues: "open,closed",
          defaultVal: "open",
          nullable: true,
          desc: "Feature status",
        }}
        onChange={() => {}}
        fieldTypes={[{ id: "enum", label: "Enum", icon: IconAbc, hasOptions: true }]}
        labels={{
          nameLabel: "Name",
          nameRequiredHint: "Required",
          namePlaceholder: "status",
          nameHint: "Field name",
          typeLabel: "Type",
          enumLabel: "Options",
          enumOptionalHint: "Optional",
          enumPlaceholder: "open,closed",
          defaultLabel: "Default",
          defaultOptionalHint: "Optional",
          nullableLabel: "Nullable",
          nullableHint: "Can be empty",
          descLabel: "Description",
          descOptionalHint: "Optional",
          descPlaceholder: "Feature status",
        }}
      />,
    )

    const inputTags = Array.from(html.matchAll(/<input[^>]*>/g)).map(([tag]) => tag)

    expect(inputTags).toHaveLength(4)
    for (const inputTag of inputTags) {
      expect(inputTag).toContain("border-input")
      expect(inputTag).toContain("bg-input-surface")
      expect(inputTag).not.toMatch(/class="[^"]*(?:border-border|bg-background)[^"]*"/)
    }
  })
})

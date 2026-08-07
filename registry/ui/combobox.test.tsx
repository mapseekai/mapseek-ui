import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))
vi.mock("@/registry/ui/input-group", () => ({
  InputGroup: "fieldset",
  InputGroupAddon: "div",
  InputGroupButton: "button",
  InputGroupInput: "input",
}))

import { ComboboxChips } from "./combobox"

describe("ComboboxChips surface", () => {
  it("uses the shared input border and surface", () => {
    const chips = ComboboxChips({ children: "Value" }) as ReactElement<{
      className: string
    }>
    const classes = chips.props.className.split(/\s+/)

    expect(classes).toContain("border-input")
    expect(classes).toContain("bg-input-surface")
    expect(classes).not.toContain("border-border")
    expect(classes).not.toContain("bg-background")
  })
})

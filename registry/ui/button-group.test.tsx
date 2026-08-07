import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

vi.mock("@/registry/ui/separator", () => ({
  Separator: () => null,
}))

import { ButtonGroupText } from "./button-group"

describe("ButtonGroupText", () => {
  it("stretches to the height established by adjacent controls", () => {
    const text = ButtonGroupText({}) as ReactElement<{ className: string }>
    const classes = text.props.className.split(/\s+/)

    expect(classes).toContain("h-auto")
    expect(classes).not.toContain("h-8")
  })
})

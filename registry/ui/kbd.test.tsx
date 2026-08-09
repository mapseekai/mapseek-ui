import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { Kbd } from "./kbd"

describe("Kbd", () => {
  it("uses a neutral label treatment outside prose typography", () => {
    const kbd = Kbd({ children: "K" }) as ReactElement<{ className: string }>
    const classes = kbd.props.className.split(/\s+/)

    expect(classes).toEqual(
      expect.arrayContaining(["not-prose", "bg-muted", "text-label-md", "text-muted-foreground"]),
    )
    expect(classes).not.toContain("text-[10px]")
    expect(classes).not.toContain("font-medium")
    expect(classes.some((className) => className.startsWith("border"))).toBe(false)
    expect(classes.some((className) => className.startsWith("shadow"))).toBe(false)
    expect(classes.some((className) => className.includes("primary"))).toBe(false)
  })
})

import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { Switch } from "./switch"

type SwitchRootElement = ReactElement<{
  className: string
  children: ReactElement<{ className: string }>
  "data-size": "sm" | "default"
}>

function renderSwitch(size: "sm" | "default" = "default") {
  return Switch({ size }) as SwitchRootElement
}

function classList(element: ReactElement<{ className: string }>) {
  return element.props.className.split(/\s+/)
}

describe("Switch", () => {
  it("keeps the compact 32px-by-18.4px default visual track", () => {
    const root = renderSwitch()
    const rootClasses = classList(root)
    const thumbClasses = classList(root.props.children)

    expect(root.props["data-size"]).toBe("default")
    expect(rootClasses).toEqual(
      expect.arrayContaining([
        "after:-inset-y-2",
        "data-[size=default]:h-[18.4px]",
        "data-[size=default]:w-8",
      ]),
    )
    expect(thumbClasses).toContain("group-data-[size=default]/switch:size-4")
  })

  it("keeps the compact 24px-by-14px small visual track", () => {
    const root = renderSwitch("sm")
    const rootClasses = classList(root)
    const thumbClasses = classList(root.props.children)

    expect(root.props["data-size"]).toBe("sm")
    expect(rootClasses).toEqual(
      expect.arrayContaining(["after:-inset-y-2", "data-[size=sm]:h-3.5", "data-[size=sm]:w-6"]),
    )
    expect(thumbClasses).toContain("group-data-[size=sm]/switch:size-3")
  })
})

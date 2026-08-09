import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { Switch } from "./switch"

type SwitchRootElement = ReactElement<{
  className: string
  children: ReactElement<{ className: string }>
  "data-size"?: "sm" | "default"
  "data-variant"?: "default" | "square"
}>

function renderSwitch(
  size: "sm" | "default" = "default",
  variant: "default" | "square" = "default",
) {
  return Switch({ size, variant } as never) as SwitchRootElement
}

function classList(element: ReactElement<{ className: string }>) {
  return element.props.className.split(/\s+/)
}

describe("Switch", () => {
  it("uses the upstream 32px-by-18.4px default visual track and 16px thumb", () => {
    const root = renderSwitch()
    const rootClasses = classList(root)
    const thumbClasses = classList(root.props.children)

    expect(root.props["data-size"]).toBe("default")
    expect(rootClasses).toEqual(
      expect.arrayContaining([
        "after:-inset-y-2",
        "border",
        "border-transparent",
        "data-[size=default]:h-[18.4px]",
        "data-[size=default]:w-[32px]",
      ]),
    )
    expect(thumbClasses).toContain("group-data-[size=default]/switch:size-4")
  })

  it("uses the upstream 24px-by-14px small visual track and 12px thumb", () => {
    const root = renderSwitch("sm")
    const rootClasses = classList(root)
    const thumbClasses = classList(root.props.children)

    expect(root.props["data-size"]).toBe("sm")
    expect(rootClasses).toEqual(
      expect.arrayContaining([
        "after:-inset-y-2",
        "data-[size=sm]:h-[14px]",
        "data-[size=sm]:w-[24px]",
      ]),
    )
    expect(thumbClasses).toContain("group-data-[size=sm]/switch:size-3")
  })

  it("keeps the upstream transparent border and checked thumb translation", () => {
    const defaultRoot = renderSwitch()
    const defaultRootClasses = classList(defaultRoot)
    const defaultThumbClasses = classList(defaultRoot.props.children)
    const squareRoot = renderSwitch("default", "square")
    const squareRootClasses = classList(squareRoot)
    const squareThumbClasses = classList(squareRoot.props.children)

    expect(defaultRootClasses).toEqual(expect.arrayContaining(["border", "border-transparent"]))
    expect(defaultThumbClasses).toContain(
      "group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)]",
    )

    expect(squareRootClasses).toEqual(expect.arrayContaining(["border", "border-transparent"]))
    expect(squareThumbClasses).toContain(
      "group-data-[variant=square]/switch:data-checked:translate-x-[calc(100%-2px)]",
    )
  })

  it("provides a 24px-wide square variant for compact configuration toggles", () => {
    const root = renderSwitch("default", "square")
    const rootClasses = classList(root)
    const thumbClasses = classList(root.props.children)

    expect(root.props["data-variant"]).toBe("square")
    expect(root.props["data-size"]).toBeUndefined()
    expect(rootClasses).toEqual(
      expect.arrayContaining([
        "data-[variant=square]:h-4",
        "data-[variant=square]:w-6",
        "data-[variant=square]:rounded-none",
      ]),
    )
    expect(thumbClasses).toEqual(
      expect.arrayContaining([
        "group-data-[variant=square]/switch:size-3",
        "group-data-[variant=square]/switch:rounded-none",
      ]),
    )
  })
})

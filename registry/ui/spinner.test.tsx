import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { Spinner } from "./spinner"

type SpinnerElement = ReactElement<{
  "aria-hidden"?: boolean
  "aria-label"?: string
  className: string
  role?: string
}>

describe("Spinner", () => {
  it("is decorative by default and honors reduced-motion preferences", () => {
    const spinner = Spinner({}) as SpinnerElement

    expect(spinner.props["aria-hidden"]).toBe(true)
    expect(spinner.props.role).toBeUndefined()
    expect(spinner.props["aria-label"]).toBeUndefined()
    expect(spinner.props.className).toContain("motion-reduce:animate-none")
  })

  it("exposes an explicitly localized status label", () => {
    const spinner = Spinner({ label: "正在加载" }) as SpinnerElement

    expect(spinner.props.role).toBe("status")
    expect(spinner.props["aria-label"]).toBe("正在加载")
    expect(spinner.props["aria-hidden"]).toBeUndefined()
  })

  it("keeps the inherited aria-label API accessible", () => {
    const spinner = Spinner({ "aria-label": "Loading data" }) as SpinnerElement

    expect(spinner.props.role).toBe("status")
    expect(spinner.props["aria-label"]).toBe("Loading data")
    expect(spinner.props["aria-hidden"]).toBeUndefined()
  })
})

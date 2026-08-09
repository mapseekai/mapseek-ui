import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { Radio } from "./radio-group"

describe("Radio", () => {
  it("uses the input surface for unchecked radios in dark mode", () => {
    const radio = Radio({ value: "option" }) as ReactElement<{ className: string }>

    expect(radio.props.className.split(/\s+/)).toContain("dark:bg-input/30")
  })
})

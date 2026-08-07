import { describe, expect, it, vi } from "vitest"

vi.mock("@base-ui/react/select", () => ({
  Select: {
    Root: (props: Record<string, unknown>) => props,
  },
}))

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { Select } from "./select"

describe("Select modal behavior", () => {
  it("passes a non-modal default to the Base UI root", () => {
    expect(Select({ children: null })).toMatchObject({ props: { modal: false } })
  })

  it("preserves an explicit modal opt-in", () => {
    expect(Select({ children: null, modal: true })).toMatchObject({ props: { modal: true } })
  })
})

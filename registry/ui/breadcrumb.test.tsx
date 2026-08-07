import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { Breadcrumb } from "./breadcrumb"

describe("Breadcrumb", () => {
  it("isolates breadcrumb links from prose link decoration", () => {
    const breadcrumb = Breadcrumb({}) as ReactElement<{ className: string }>

    expect(breadcrumb.props.className.split(/\s+/)).toContain("not-prose")
  })
})

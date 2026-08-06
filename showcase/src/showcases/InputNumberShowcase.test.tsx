import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

vi.mock("@registry/ui/input-number", async () => {
  return await import("../../../registry/ui/input-number")
})

import { InputNumberOverviewDemo } from "./InputNumberShowcase"

describe("InputNumberOverviewDemo", () => {
  it("names inputs without turning the surrounding label row into a focus target", () => {
    const html = renderToStaticMarkup(<InputNumberOverviewDemo />)

    expect(html).not.toContain('<label for="distance-input"')
    expect(html).not.toContain('<label for="opacity-input"')
    expect(html).toContain('id="distance-label"')
    expect(html).toContain('aria-labelledby="distance-label"')
    expect(html).toContain('id="opacity-label"')
    expect(html).toContain('aria-labelledby="opacity-label"')
  })
})

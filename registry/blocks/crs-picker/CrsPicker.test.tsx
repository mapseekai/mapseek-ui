import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/input", () => ({ Input: "input" }))
vi.mock("@/lib/mapseek-labels", () => ({
  resolveLabels: <T extends object>(defaults: T, overrides?: Partial<T>) => ({
    ...defaults,
    ...overrides,
  }),
}))
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

import { CrsPicker } from "./CrsPicker"

describe("CrsPicker", () => {
  it("uses the semantic selection background for the selected CRS row", () => {
    const html = renderToStaticMarkup(<CrsPicker value="EPSG:4326" />)

    expect(html).toContain('aria-label="EPSG:4326"')
    expect(html).toContain("bg-selection-bg")
    expect(html).not.toContain("bg-[oklch")
  })
})

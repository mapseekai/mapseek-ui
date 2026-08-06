import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { InputNumber } from "./input-number"

describe("InputNumber", () => {
  it("shows the unit while idle and exposes step controls while active", () => {
    const html = renderToStaticMarkup(
      <InputNumber aria-label="Distance" defaultValue={12} min={0} max={20} step={2} unit="km" />,
    )

    expect(html).toContain('data-slot="input-number"')
    expect(html).toContain('aria-label="Distance"')
    expect(html).toContain('data-slot="input-number-unit"')
    expect(html).toContain("group-focus-within/input-number:hidden")
    expect(html).toContain(">km</span>")
    expect(html).toContain('data-slot="input-number-controls"')
    expect(html).toContain("group-focus-within/input-number:flex")
    expect(html).toContain("min-w-14 shrink-0")
    expect(html).toContain("h-full w-14 shrink-0")
    expect(html).not.toContain("pointer-events-none absolute")
    expect(html).not.toContain("absolute inset-y-0 end-0")
    expect(html).toContain('aria-label="Decrease value"')
    expect(html).toContain('aria-label="Increase value"')
    expect(html).toContain("tabler-icon-minus")
    expect(html).toContain("tabler-icon-plus")
  })

  it("defaults to a step of one and forwards numeric field state", () => {
    const html = renderToStaticMarkup(
      <InputNumber aria-label="Opacity" defaultValue={40} min={0} max={100} disabled />,
    )

    expect(html).toContain('data-step="1"')
    expect(html).toContain('data-disabled=""')
    expect(html).toContain('disabled=""')
  })
})

import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PixelProbeDemo } from "./PixelProbeShowcase"

describe("PixelProbeDemo", () => {
  it("starts within the mobile stage inset with bounded navigation and polite status", () => {
    const html = renderToStaticMarkup(<PixelProbeDemo locale="en" />)
    const previous = html.match(/<button[^>]*aria-label="Previous pixel"[^>]*>/u)?.[0] ?? ""

    expect(html).toContain("left-4")
    expect(html).toContain("right-4")
    expect(html).toContain("w-auto")
    expect(html).toContain("sm:left-auto")
    expect(html).toContain("sm:w-[340px]")
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain(">3<")
    expect(previous).not.toBe("")
    expect(previous).toMatch(/\sdisabled=""/u)
  })
})

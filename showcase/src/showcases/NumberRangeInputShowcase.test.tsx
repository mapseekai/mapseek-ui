import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { NumberRangeInputDemo } from "./NumberRangeInputShowcase"

describe("NumberRangeInput showcase", () => {
  it.each(["zh-CN", "en"] as const)("renders responsive field states in %s", (locale) => {
    const html = renderToStaticMarkup(<NumberRangeInputDemo locale={locale} />)

    expect(html).toContain('data-slot="field-group"')
    expect(html).toContain('data-slot="field-label"')
    expect(html).toContain('data-slot="field-description"')
    expect(html).toContain('data-slot="field-error"')
    expect(html).toContain("text-body-sm")
    expect(html).toContain("text-body-md")
    expect(html).toContain("disabled")
    expect(html).not.toContain("grid-cols-[150px_minmax(0,1fr)]")
    expect(html).not.toContain("text-xs")
    expect(html).not.toContain("text-[10px]")
  })
})

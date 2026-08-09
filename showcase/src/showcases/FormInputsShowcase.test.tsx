import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { FormInputsDemo } from "./FormInputsShowcase"

describe("FormInputsDemo", () => {
  it("uses semantic fields with associated control labels", () => {
    const html = renderToStaticMarkup(<FormInputsDemo locale="zh-CN" />)

    expect(html).toContain('data-slot="field-group"')
    expect(html).toContain('for="form-inputs-string"')
    expect(html).toContain('id="form-inputs-string"')
    expect(html).toContain('for="form-inputs-checkbox"')
    expect(html).toContain('id="form-inputs-checkbox"')
    expect(html).toContain('aria-labelledby="form-inputs-enum-label"')
    expect(html).toContain('aria-labelledby="form-inputs-font-stack-label"')
  })

  it("collapses each field row to one column below the small breakpoint", () => {
    const html = renderToStaticMarkup(<FormInputsDemo locale="zh-CN" />)

    expect(html).toContain("grid-cols-1")
    expect(html).toContain("sm:grid-cols-[130px_minmax(0,1fr)]")
  })

  it("keeps the checkbox behind the field row's width boundary", () => {
    const html = renderToStaticMarkup(<FormInputsDemo locale="zh-CN" />)
    const checkboxIndex = html.indexOf('id="form-inputs-checkbox"')
    const fieldStart = html.lastIndexOf("<fieldset", checkboxIndex)
    const fieldEnd = html.indexOf("</fieldset>", checkboxIndex)
    const checkboxField = html.slice(fieldStart, fieldEnd)

    expect(checkboxIndex).toBeGreaterThan(-1)
    expect(checkboxField).toContain('data-slot="field-content"')
  })
})

import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { SchemaFormDemo } from "./SchemaFormShowcase"

describe("SchemaFormDemo", () => {
  it.each([
    ["zh-CN" as const, "输入 0 或更大的缓冲半径。", "EPSG:3857 / proj4 / WKT…"],
    ["en" as const, "Enter a buffer radius of 0 or greater.", "EPSG:3857 / proj4 / WKT…"],
  ])(
    "renders localized errors and a polite validity status for %s",
    (locale, error, placeholder) => {
      const html = renderToStaticMarkup(<SchemaFormDemo locale={locale} />)

      expect(html).toContain('role="status"')
      expect(html).toContain('aria-live="polite"')
      expect(html).toContain('role="alert"')
      expect(html).toContain(error)
      expect(html).toContain(`placeholder="${placeholder}"`)
    },
  )
})

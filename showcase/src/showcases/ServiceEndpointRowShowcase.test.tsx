import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { ServiceEndpointRowDemo } from "./ServiceEndpointRowShowcase"

const localizedOpenLabel = {
  "zh-CN": "新窗口打开",
  en: "Open in new window",
} as const

describe("ServiceEndpointRowDemo", () => {
  it.each(["zh-CN", "en"] as const)("renders accessible %s endpoint states", (locale) => {
    const html = renderToStaticMarkup(<ServiceEndpointRowDemo locale={locale} />)

    expect(html).toMatch(/<output[^>]*aria-live="polite"/)
    expect(html).toMatch(
      new RegExp(
        `<a[^>]*href="https://api\\.mapseek\\.io/v1/raster/demo/tilejson\\.json"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*aria-label="${localizedOpenLabel[locale]}"`,
      ),
    )
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toMatch(/(?:border|bg|text)-(?:warning|info)/)
  })
})

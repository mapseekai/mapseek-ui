import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Slider } from "./slider"

describe("Slider", () => {
  it("forwards a name to the real thumb input without changing pointer geometry", () => {
    const html = renderToStaticMarkup(
      <Slider value={40} getAriaLabel={() => "Opacity"} />,
    )

    expect(html).toContain('aria-label="Opacity"')
    expect(html).toContain("size-3")
    expect(html).toContain("after:-inset-2")
    expect(html).toContain("has-[:focus-visible]:ring-(length:--focus-ring-width)")
  })
})

import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { CoordinateSystemComboboxDemo } from "./CoordinateSystemComboboxShowcase"

describe("CoordinateSystemComboboxDemo", () => {
  it("stacks both examples within the standard Combobox width", () => {
    const html = renderToStaticMarkup(<CoordinateSystemComboboxDemo locale="zh-CN" />)

    expect(html).toContain("mx-auto grid w-full max-w-xs gap-8")
    expect(html).not.toContain("lg:grid-cols-2")
  })
})

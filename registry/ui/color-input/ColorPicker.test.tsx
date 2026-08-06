import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/components/ui/input", () => ({ Input: "input" }))
vi.mock("@/components/ui/select", () => ({ Select: "select" }))
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" "),
}))

import { ColorPicker, ColorPickerSelection } from "./ColorPicker"

describe("ColorPickerSelection", () => {
  it("positions the selection indicator from the controlled color", () => {
    const html = renderToStaticMarkup(
      <ColorPicker value="#2563eb">
        <ColorPickerSelection />
      </ColorPicker>,
    )

    expect(html).toContain("left:83.19327731092436%")
    expect(html).toContain("top:8.681055155875306%")
    expect(html).toContain("border border-primary")
    expect(html).not.toContain("bg-white")
    expect(html).toContain("outline-2 -outline-offset-3 outline-white")
    expect(html).not.toContain("box-shadow")
  })
})

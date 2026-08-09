import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { CoordinateSystemCombobox } from "./CoordinateSystemCombobox"

describe("CoordinateSystemCombobox", () => {
  it("shows only the selected EPSG code in its accessible Combobox input", () => {
    const html = renderToStaticMarkup(<CoordinateSystemCombobox value="EPSG:4490" />)

    expect(html).toContain('role="combobox"')
    expect(html).toContain('aria-label="选择坐标系"')
    expect(html).toMatch(/role="combobox"[^>]*value="EPSG:4490"/)
    expect(html).not.toMatch(/role="combobox"[^>]*value="CGCS2000"/)
  })

  it("uses the standard default Combobox width", () => {
    const html = renderToStaticMarkup(<CoordinateSystemCombobox />)

    expect(html).toContain("w-[calc(100%-4px)]")
    expect(html).toContain("max-w-xs")
  })

  it("uses an extra item when it overrides the selected default EPSG", () => {
    const html = renderToStaticMarkup(
      <CoordinateSystemCombobox
        value="EPSG:4491"
        extraItems={[
          {
            epsg: "EPSG:4491",
            name: "CGCS2000 / Gauss-Kruger zone 13 (project override)",
            kind: "projected",
          },
        ]}
      />,
    )

    expect(html).toMatch(/role="combobox"[^>]*value="EPSG:4491"/)
  })
})

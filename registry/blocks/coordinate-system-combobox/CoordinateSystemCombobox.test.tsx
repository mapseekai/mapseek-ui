import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { CoordinateSystemCombobox } from "./CoordinateSystemCombobox"

describe("CoordinateSystemCombobox", () => {
  it("shows the selected EPSG and CRS name in its accessible Combobox input", () => {
    const html = renderToStaticMarkup(<CoordinateSystemCombobox value="EPSG:4490" />)

    expect(html).toContain('role="combobox"')
    expect(html).toContain('aria-label="选择坐标系"')
    expect(html).toContain('value="EPSG:4490 · CGCS2000"')
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

    expect(html).toContain('value="EPSG:4491 · CGCS2000 / Gauss-Kruger zone 13 (project override)"')
  })
})

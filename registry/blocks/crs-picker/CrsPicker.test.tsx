import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/mapseek-labels", () => ({
  resolveLabels: <T extends object>(defaults: T, overrides?: Partial<T>) => ({
    ...defaults,
    ...overrides,
  }),
}))
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

import { DEFAULT_CRS_ITEMS } from "./built-in-crs"
import { CrsPicker } from "./CrsPicker"

describe("CrsPicker", () => {
  it("renders CRS filtering through an accessible Command search surface", () => {
    const html = renderToStaticMarkup(<CrsPicker value="EPSG:4326" />)

    expect(html).toContain('data-slot="command"')
    expect(html).toContain('data-slot="command-input"')
    expect(html).toContain('aria-label="搜索坐标系"')
    expect(html).toContain('aria-label="坐标参考系"')
    expect(html).toContain("max-w-full")
    expect(html).toContain('data-checked="true"')
  })

  it("uses the semantic selection background for the selected CRS row", () => {
    const html = renderToStaticMarkup(<CrsPicker value="EPSG:4326" />)

    expect(html).toContain("bg-selection-bg")
    expect(html).not.toContain("bg-[oklch")
  })

  it("ships built-in CRS items without an unused description", () => {
    expect(DEFAULT_CRS_ITEMS.every((item) => !("description" in item))).toBe(true)
  })

  it("hides purely decorative CRS icons from assistive technology", () => {
    const html = renderToStaticMarkup(<CrsPicker value="EPSG:4326" />)

    expect(html.match(/<svg[^>]*aria-hidden="true"/g)).toHaveLength(3)
  })

  it("keeps a CRS option's visible EPSG code and name available to assistive technology", () => {
    const html = renderToStaticMarkup(<CrsPicker value="EPSG:4326" />)

    expect(html).not.toContain('aria-label="EPSG:4326"')
    expect(html).toContain("WGS 84")
    expect(html).not.toContain("全球通用 · 经纬度")
  })

  it("keeps the selected CRS name in the primary selection color", () => {
    const html = renderToStaticMarkup(<CrsPicker value="EPSG:4326" />)

    expect(html).toContain(
      "mt-0.5 truncate font-mono text-body-sm leading-snug text-muted-foreground group-data-[checked=true]/command-item:text-primary",
    )
  })

  it("truncates long external CRS names while retaining their complete title", () => {
    const longName = "A very long custom coordinate reference system name for narrow containers"
    const html = renderToStaticMarkup(
      <CrsPicker
        value="EPSG:9999"
        extraItems={[
          {
            epsg: "EPSG:9999",
            name: longName,
            kind: "projected",
          },
        ]}
      />,
    )

    expect(html).toContain(`title="${longName}"`)
    expect(html).toContain("mt-0.5 truncate")
  })

  it("extends CRS group label backgrounds to the option edges", () => {
    const html = renderToStaticMarkup(<CrsPicker value="EPSG:4326" />)

    expect(html).toContain("mb-1 -mx-2 flex")
  })

  it("keeps the checked indicator primary while its row is active", () => {
    const html = renderToStaticMarkup(<CrsPicker value="EPSG:4326" />)

    expect(html).toContain("data-[checked=true]:data-selected:*:[svg]:text-primary")
  })

  it("removes duplicate group heading padding from the shared Command surface", () => {
    const html = renderToStaticMarkup(<CrsPicker value="EPSG:4326" />)

    expect(html).toContain("**:[[cmdk-group-heading]]:py-0")
  })
})

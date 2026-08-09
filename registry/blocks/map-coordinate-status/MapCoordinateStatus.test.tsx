import type { ReactElement, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children?: ReactNode }) => <>{children}</>,
  PopoverContent: ({ children, className }: { children?: ReactNode; className?: string }) => (
    <div data-slot="popover-content" className={className}>
      {children}
    </div>
  ),
  PopoverTrigger: ({ render }: { render: ReactElement }) => render,
}))
vi.mock("@/lib/mapseek-labels", () => ({
  resolveLabels: <T extends object>(defaults: T, overrides?: Partial<T>) => ({
    ...defaults,
    ...overrides,
  }),
}))
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))
vi.mock("../crs-picker", () => ({
  CrsPicker: ({ value }: { value?: string }) => <div data-slot="crs-picker" data-value={value} />,
}))

import { MapCoordinateStatus } from "./MapCoordinateStatus"

describe("MapCoordinateStatus", () => {
  it("renders each default coordinate readout with tabular numerals", () => {
    const html = renderToStaticMarkup(
      <MapCoordinateStatus crs="EPSG:4326" center={[121.4737, 31.2304]} zoom={14} />,
    )

    expect(html.match(/class="tnum"/g)).toHaveLength(3)
  })

  it("uses the Tag default icon treatment for the CRS trigger", () => {
    const html = renderToStaticMarkup(
      <MapCoordinateStatus crs="EPSG:3857" center={[13_522_425.02, 3_662_700.31]} zoom={11} />,
    )

    expect(html).toContain("<button")
    expect(html).toContain('aria-label="切换坐标参考系"')
    expect(html).toContain('data-slot="tag"')
    expect(html).toContain('data-size="default"')
    expect(html).toContain("EPSG:3857")
    expect(html).not.toContain('stroke-width="1.75"')
    expect(html.match(/stroke-width="2"/g)).toHaveLength(2)
  })

  it("removes the generic popover ring while keeping the standard CRS picker", () => {
    const html = renderToStaticMarkup(
      <MapCoordinateStatus crs="EPSG:3857" center={[13_522_425.02, 3_662_700.31]} zoom={11} />,
    )

    expect(html).toContain('data-slot="popover-content"')
    expect(html).toContain("ring-0")
    expect(html).toContain('data-slot="crs-picker"')
    expect(html).toContain('data-value="EPSG:3857"')
  })
})

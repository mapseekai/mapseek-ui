import type { ReactElement, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children?: ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
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
vi.mock("../crs-picker", () => ({ CrsPicker: () => <div /> }))

import { MapCoordinateStatus } from "./MapCoordinateStatus"

describe("MapCoordinateStatus", () => {
  it("renders each default coordinate readout with tabular numerals", () => {
    const html = renderToStaticMarkup(
      <MapCoordinateStatus crs="EPSG:4326" center={[121.4737, 31.2304]} zoom={14} />,
    )

    expect(html.match(/class="tnum"/g)).toHaveLength(3)
  })
})

import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
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

  it("uses the standard 24px button size for the CRS selector", async () => {
    const source = await readFile(resolve(import.meta.dirname, "MapCoordinateStatus.tsx"), "utf8")
    const crsSelector = source.slice(
      source.indexOf("<Popover open={open}"),
      source.indexOf('<PopoverContent side="top"'),
    )

    expect(crsSelector).toContain('size="xs"')
    expect(crsSelector).toContain("text-label-md")
    expect(crsSelector).not.toContain("h-5")
    expect(crsSelector).not.toContain("text-[10px]")
  })
})

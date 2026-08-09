import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children, className }: { children: ReactNode; className?: string }) => (
    <section className={className}>{children}</section>
  ),
}))

import { StyleSourcePickerDialog } from "./StyleSourcePickerDialog"

describe("StyleSourcePickerDialog", () => {
  it("keeps the search controls clear of the header separator", () => {
    const html = renderToStaticMarkup(
      <StyleSourcePickerDialog
        open
        loading={false}
        options={[]}
        alreadyAddedKeys={new Set()}
        confirming={false}
        onOpenChange={() => {}}
        onConfirm={() => {}}
      />,
    )

    expect(html).toMatch(/class="[^"]*flex flex-col gap-3[^"]*border-b px-4 py-4[^"]*"/)
  })

  it("centers the close control against the padded dialog title", () => {
    const html = renderToStaticMarkup(
      <StyleSourcePickerDialog
        open
        loading={false}
        options={[]}
        alreadyAddedKeys={new Set()}
        confirming={false}
        onOpenChange={() => {}}
        onConfirm={() => {}}
      />,
    )

    expect(html).toContain("[&amp;&gt;[data-slot=dialog-close]]:top-3")
  })

  it("stacks footer actions on narrow screens and keeps type metadata neutral", () => {
    const html = renderToStaticMarkup(
      <StyleSourcePickerDialog
        open
        loading={false}
        options={[
          {
            key: "dataset:roads",
            sourceKind: "DATASET",
            sourceUID: "roads-uid",
            sourceName: "Road Network",
            sourceType: "vector",
          },
          {
            key: "dataset:dem",
            sourceKind: "DATASET",
            sourceUID: "dem-uid",
            sourceName: "Terrain DEM",
            sourceType: "raster",
          },
        ]}
        alreadyAddedKeys={new Set()}
        confirming={false}
        onOpenChange={() => {}}
        onConfirm={() => {}}
      />,
    )

    expect(html).toMatch(
      /class="flex flex-col items-stretch gap-3 border-t[^"]*sm:flex-row[^"]*sm:items-center[^"]*sm:justify-between/,
    )
    expect(html).toMatch(
      /data-slot="badge" data-variant="outline"[^>]*border-cat-2\/30[^>]*bg-cat-2\/10[^>]*text-cat-2/,
    )
    expect(html).toMatch(
      /data-slot="badge" data-variant="outline"[^>]*border-cat-5\/30[^>]*bg-cat-5\/10[^>]*text-cat-5/,
    )
  })
})

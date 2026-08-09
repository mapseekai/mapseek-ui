import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/dropdown-menu", async () => import("../../ui/dropdown-menu"))
vi.mock("@/components/ui/icon-button", async () => import("../../ui/icon-button"))
vi.mock("@/components/ui/tooltip", async () => import("../../ui/tooltip"))

import { LayerActions } from "./LayerActions"
import { LAYER_PANEL_LABELS_EN } from "./labels"

describe("LayerActions trigger composition", () => {
  it("keeps the dropdown trigger intact when the more action also has a tooltip", () => {
    const html = renderToStaticMarkup(
      <LayerActions
        layer={{
          id: "roads",
          name: "Roads",
          group: "Base maps",
          geometry: "polyline",
          featureCount: 42,
          visible: true,
        }}
        labels={LAYER_PANEL_LABELS_EN}
        selected
        onVisibilityChange={() => {}}
        onOpenAttributeTable={() => {}}
      />,
    )

    expect(html).toContain('data-slot="tooltip-trigger"')
    expect(html).toContain('data-slot="dropdown-menu-trigger"')
  })
})

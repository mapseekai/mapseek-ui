import type { ComponentProps, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

type ButtonProps = ComponentProps<"button"> & {
  readonly variant?: string
  readonly size?: string
}

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: { readonly children: ReactNode }) => <span>{children}</span>,
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, size: _size, variant: _variant, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

vi.mock("./LoomLayerActions", () => ({ LoomLayerActions: () => null }))

import { LoomLayerGroup } from "./LoomLayerGroup"
import { LOOM_LAYER_PANEL_LABELS_EN } from "./labels"

describe("LoomLayerGroup", () => {
  it("uses the shared selection background and primary text for the selected layer", () => {
    const html = renderToStaticMarkup(
      <LoomLayerGroup
        group="Base maps"
        members={[
          {
            id: "roads",
            name: "Roads",
            group: "Base maps",
            geometry: "polyline",
            featureCount: 42,
            visible: true,
          },
        ]}
        selectedId="roads"
        collapsed={false}
        labels={LOOM_LAYER_PANEL_LABELS_EN}
        onSelectLayer={() => {}}
        onVisibilityChange={() => {}}
      />,
    )

    expect(html).toContain("bg-selection-bg")
    expect(html).toMatch(
      /<button(?=[^>]*aria-label="Select layer Roads")(?=[^>]*class="[^"]*text-primary")[^>]*>/,
    )
    expect(html).not.toContain("bg-primary/10")
  })
})

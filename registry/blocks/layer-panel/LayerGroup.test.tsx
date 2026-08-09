import type { ComponentProps } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

type ButtonProps = ComponentProps<"button"> & {
  readonly variant?: string
  readonly size?: string
}

type IconButtonProps = ComponentProps<"button"> & {
  readonly label: string
  readonly size?: string
  readonly tooltip?: boolean | string
}

const { iconButtonHandlers } = vi.hoisted(() => ({
  iconButtonHandlers: new Map<string, () => void>(),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, size: _size, variant: _variant, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/components/ui/icon-button", () => ({
  IconButton: ({ children, label, onClick, size: _size, tooltip, ...props }: IconButtonProps) => {
    if (onClick) iconButtonHandlers.set(label, () => onClick({} as never))
    return (
      <span data-slot="tooltip">
        <button aria-label={label} {...props}>
          {children}
        </button>
        {tooltip && <span data-slot="tooltip-content">{tooltip === true ? label : tooltip}</span>}
      </span>
    )
  },
}))

vi.mock("@/components/ui/tag", async () => import("../../ui/tag"))

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

vi.mock("./LayerActions", () => ({ LayerActions: () => null }))

import { LayerGroup } from "./LayerGroup"
import { LAYER_PANEL_LABELS_EN } from "./labels"

describe("LayerGroup", () => {
  beforeEach(() => {
    iconButtonHandlers.clear()
  })

  it("hides every member when the whole group is visible", () => {
    const onVisibilityChange = vi.fn()

    renderToStaticMarkup(
      <LayerGroup
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
          {
            id: "parcels",
            name: "Parcels",
            group: "Base maps",
            geometry: "polygon",
            featureCount: 12,
            visible: true,
          },
        ]}
        collapsed={false}
        labels={LAYER_PANEL_LABELS_EN}
        onSelectLayer={() => {}}
        onVisibilityChange={onVisibilityChange}
      />,
    )

    const hideGroup = iconButtonHandlers.get("Hide group Base maps")
    expect(hideGroup).toBeTypeOf("function")
    hideGroup?.()
    expect(onVisibilityChange.mock.calls).toEqual([
      ["roads", false],
      ["parcels", false],
    ])
  })

  it("shows every member when any layer in the group is hidden", () => {
    const onVisibilityChange = vi.fn()

    renderToStaticMarkup(
      <LayerGroup
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
          {
            id: "parcels",
            name: "Parcels",
            group: "Base maps",
            geometry: "polygon",
            featureCount: 12,
            visible: false,
          },
        ]}
        collapsed={false}
        labels={LAYER_PANEL_LABELS_EN}
        onSelectLayer={() => {}}
        onVisibilityChange={onVisibilityChange}
      />,
    )

    const showGroup = iconButtonHandlers.get("Show group Base maps")
    expect(showGroup).toBeTypeOf("function")
    showGroup?.()
    expect(onVisibilityChange.mock.calls).toEqual([
      ["roads", true],
      ["parcels", true],
    ])
  })

  it("provides tooltips for group icon actions", () => {
    const html = renderToStaticMarkup(
      <LayerGroup
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
        collapsed={false}
        labels={LAYER_PANEL_LABELS_EN}
        onRenameGroup={() => {}}
        onSelectLayer={() => {}}
        onVisibilityChange={() => {}}
      />,
    )

    expect(html).toContain('data-slot="tooltip-content">Hide group</span>')
    expect(html).toContain('data-slot="tooltip-content">Rename group</span>')
    expect(html).toContain('aria-label="Hide group Base maps"')
    expect(html).toContain('aria-label="Rename group Base maps"')
  })

  it("uses the ordinary interaction surface when hovering the group header", () => {
    const html = renderToStaticMarkup(
      <LayerGroup
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
        collapsed={false}
        labels={LAYER_PANEL_LABELS_EN}
        onSelectLayer={() => {}}
        onVisibilityChange={() => {}}
      />,
    )

    expect(html).toMatch(
      /<section class="flex flex-col gap-1"><div class="[^"]*transition-colors[^"]*hover:bg-accent\/50[^"]*">/,
    )
  })

  it("uses the interaction hover surface only for unselected layer rows", () => {
    const html = renderToStaticMarkup(
      <LayerGroup
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
          {
            id: "parcels",
            name: "Parcels",
            group: "Base maps",
            geometry: "polygon",
            featureCount: 12,
            visible: true,
          },
        ]}
        selectedId="parcels"
        collapsed={false}
        labels={LAYER_PANEL_LABELS_EN}
        onSelectLayer={() => {}}
        onVisibilityChange={() => {}}
      />,
    )

    const unselectedRowClass = html.match(
      /<div class="([^"]*)"><button(?=[^>]*aria-label="Select layer Roads")[^>]*>/,
    )?.[1]
    const selectedRowClass = html.match(
      /<div class="([^"]*)"><button(?=[^>]*aria-current="true")(?=[^>]*aria-label="Select layer Parcels")[^>]*>/,
    )?.[1]

    expect(unselectedRowClass).toContain("transition-colors")
    expect(unselectedRowClass).toContain("hover:bg-accent/50")
    expect(selectedRowClass).toContain("bg-selection-bg")
    expect(selectedRowClass).not.toContain("hover:bg-accent/50")
  })

  it("renders the selected-layer status with the solid Tag", () => {
    const html = renderToStaticMarkup(
      <LayerGroup
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
        labels={LAYER_PANEL_LABELS_EN}
        onSelectLayer={() => {}}
        onVisibilityChange={() => {}}
      />,
    )

    expect(html).toMatch(
      /<span(?=[^>]*data-slot="tag")(?=[^>]*data-variant="solid")[^>]*>Current<\/span>/,
    )
  })

  it("uses the shared selection background and primary text for the selected layer", () => {
    const html = renderToStaticMarkup(
      <LayerGroup
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
        labels={LAYER_PANEL_LABELS_EN}
        onSelectLayer={() => {}}
        onVisibilityChange={() => {}}
      />,
    )

    expect(html).toContain("bg-selection-bg")
    expect(html).toMatch(
      /<button(?=[^>]*aria-current="true")(?=[^>]*aria-label="Select layer Roads")(?=[^>]*class="[^"]*text-primary")[^>]*>/,
    )
    expect(html).not.toContain("bg-primary/10")
  })

  it("exposes full values for text that can truncate", () => {
    const html = renderToStaticMarkup(
      <LayerGroup
        group="Base maps"
        members={[
          {
            id: "roads",
            name: "Road centerlines",
            group: "Base maps",
            geometry: "polyline",
            featureCount: 42,
            visible: true,
          },
        ]}
        collapsed={false}
        labels={LAYER_PANEL_LABELS_EN}
        onSelectLayer={() => {}}
        onVisibilityChange={() => {}}
      />,
    )

    expect(html).toContain('title="Base maps"')
    expect(html).toContain('title="Road centerlines"')
    expect(html).toContain('title="Line · 42 features"')
  })
})

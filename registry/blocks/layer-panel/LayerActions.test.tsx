import type { ComponentProps, ReactElement, ReactNode } from "react"
import { cloneElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

type ButtonProps = ComponentProps<"button"> & {
  readonly size?: string
  readonly variant?: string
}

type IconButtonProps = ComponentProps<"button"> & {
  readonly label: string
  readonly size?: string
  readonly tooltip?: boolean | string
}

type TriggerProps = {
  readonly children?: ReactNode
  readonly render: ReactElement<{ readonly children?: ReactNode; readonly label?: string }>
}

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, size: _size, variant: _variant, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/components/ui/icon-button", () => ({
  IconButton: ({ children, label, size: _size, tooltip, ...props }: IconButtonProps) => (
    <span data-slot="tooltip">
      <button aria-label={label} {...props}>
        {children}
      </button>
      {tooltip && <span data-slot="tooltip-content">{tooltip === true ? label : tooltip}</span>}
    </span>
  ),
}))

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { readonly children: ReactNode }) => (
    <div data-slot="dropdown-menu">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { readonly children: ReactNode }) => (
    <div data-slot="dropdown-menu-content">{children}</div>
  ),
  DropdownMenuGroup: ({ children }: { readonly children: ReactNode }) => (
    <div data-slot="dropdown-menu-group">{children}</div>
  ),
  DropdownMenuItem: ({ children }: { readonly children: ReactNode }) => (
    <div data-slot="dropdown-menu-item">{children}</div>
  ),
  DropdownMenuTrigger: ({ children, render }: TriggerProps) =>
    cloneElement(render, undefined, children),
}))

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { readonly children: ReactNode }) => (
    <span data-slot="tooltip">{children}</span>
  ),
  TooltipContent: ({ children }: { readonly children: ReactNode }) => (
    <span data-slot="tooltip-content">{children}</span>
  ),
  TooltipTrigger: ({ children, render }: TriggerProps) => cloneElement(render, undefined, children),
}))

import { LayerActions } from "./LayerActions"
import { LAYER_PANEL_LABELS_EN } from "./labels"

describe("LayerActions", () => {
  it("limits selected layers to three direct buttons and moves overflow actions into a menu", () => {
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
        onLocateLayer={() => {}}
        onOpenAttributeTable={() => {}}
        onMoreLayerActions={() => {}}
      />,
    )

    expect(html.match(/<button/g)).toHaveLength(3)
    expect(html).toContain('data-slot="dropdown-menu-content"')
    expect(html).toMatch(/data-slot="dropdown-menu-item"[^>]*>[\s\S]*Open attribute table<\/div>/)
    expect(html).toMatch(/data-slot="dropdown-menu-item"[^>]*>[\s\S]*More layer actions<\/div>/)
    expect(html).toContain('aria-label="More layer actions for Roads"')
  })

  it("provides tooltip content for every direct icon action", () => {
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
        onLocateLayer={() => {}}
        onOpenAttributeTable={() => {}}
      />,
    )

    expect(html).toContain('data-slot="tooltip-content">Locate layer</span>')
    expect(html).toContain('data-slot="tooltip-content">More layer actions</span>')
    expect(html).toContain('data-slot="tooltip-content">Hide layer</span>')
    expect(html).toContain('aria-label="Locate layer Roads"')
    expect(html).toContain('aria-label="Hide layer Roads"')
  })
})

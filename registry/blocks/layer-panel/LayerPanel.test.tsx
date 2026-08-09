import type { ComponentProps, ComponentType, ReactElement, ReactNode } from "react"
import { cloneElement, createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

type ButtonProps = ComponentProps<"button"> & {
  readonly size?: string
  readonly variant?: string
}

type ToggleGroupProps = ComponentProps<"div"> & {
  readonly onValueChange?: (value: readonly string[]) => void
  readonly spacing?: number
  readonly value?: readonly string[]
}

type IconButtonProps = ComponentProps<"button"> & {
  readonly label: string
  readonly size?: string
  readonly tooltip?: boolean | string
}

type TooltipTriggerProps = {
  readonly children?: ReactNode
  readonly render: ReactElement<{ readonly children?: ReactNode }>
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

vi.mock("@/components/ui/tag", async () => import("../../ui/tag"))

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { readonly children: ReactNode }) => (
    <span data-slot="tooltip">{children}</span>
  ),
  TooltipContent: ({ children }: { readonly children: ReactNode }) => (
    <span data-slot="tooltip-content">{children}</span>
  ),
  TooltipTrigger: ({ children, render }: TooltipTriggerProps) =>
    cloneElement(render, undefined, children),
}))

vi.mock("@/components/ui/empty", () => ({
  Empty: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  EmptyHeader: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  EmptyMedia: ({
    children,
    variant: _variant,
    ...props
  }: ComponentProps<"div"> & {
    readonly variant?: string
  }) => <div {...props}>{children}</div>,
  EmptyTitle: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
}))

vi.mock("@/components/ui/input-group", () => ({
  InputGroup: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  InputGroupAddon: ({ children, ...props }: ComponentProps<"div">) => (
    <div {...props}>{children}</div>
  ),
  InputGroupInput: (props: ComponentProps<"input">) => <input {...props} />,
}))

vi.mock("@/components/ui/toggle-group", () => ({
  ToggleGroup: ({
    children,
    onValueChange: _onValueChange,
    spacing: _spacing,
    value: _value,
    ...props
  }: ToggleGroupProps) => <div {...props}>{children}</div>,
  ToggleGroupItem: ({ children, value: _value, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" "),
}))

import { LayerPanel } from "./LayerPanel"
import { LAYER_PANEL_LABELS_EN } from "./labels"

describe("LayerPanel", () => {
  it("provides tooltips for panel icon actions", () => {
    const html = renderToStaticMarkup(
      createElement(LayerPanel as ComponentType<Record<string, unknown>>, {
        layers: [],
        query: "",
        visibleOnly: false,
        onQueryChange: () => undefined,
        onSelectLayer: () => undefined,
        onVisibilityChange: () => undefined,
        onVisibleOnlyChange: () => undefined,
        onCreateGroup: () => undefined,
        onAddLayer: () => undefined,
        onCollapsedChange: () => undefined,
      }),
    )

    expect(html).toContain('data-slot="tooltip-content">新建分组')
    expect(html).toContain('data-slot="tooltip-content">添加图层')
    expect(html).toContain('data-slot="tooltip-content">收起图层面板')
  })

  it("renders the layer search with accessible input and icon semantics", () => {
    const html = renderToStaticMarkup(
      createElement(LayerPanel as ComponentType<Record<string, unknown>>, {
        layers: [],
        query: "",
        visibleOnly: false,
        onQueryChange: () => undefined,
        onSelectLayer: () => undefined,
        onVisibilityChange: () => undefined,
        onVisibleOnlyChange: () => undefined,
      }),
    )

    expect(html).toContain('<div aria-label="搜索图层">')
    expect(html).toContain('data-slot="tooltip-content">搜索图层')
    expect(html).toContain('type="search"')
    expect(html).toContain('name="layer-search"')
    expect(html).toContain('autoComplete="off"')
  })

  it("renders the layer total with the small Tag", () => {
    const html = renderToStaticMarkup(
      createElement(LayerPanel as ComponentType<Record<string, unknown>>, {
        layers: [
          {
            id: "roads",
            name: "Road centerlines",
            group: "Base data",
            geometry: "polyline",
            featureCount: 532,
            visible: true,
          },
          {
            id: "parcels",
            name: "Land parcels",
            group: "Base data",
            geometry: "polygon",
            featureCount: 1284,
            visible: true,
          },
        ],
        query: "",
        visibleOnly: false,
        onQueryChange: () => undefined,
        onSelectLayer: () => undefined,
        onVisibilityChange: () => undefined,
        onVisibleOnlyChange: () => undefined,
      }),
    )

    expect(html).toMatch(/<span(?=[^>]*data-size="sm")(?=[^>]*data-slot="tag")[^>]*>2<\/span>/)
  })

  it("filters rendered layers using the controlled search query", () => {
    const html = renderToStaticMarkup(
      createElement(LayerPanel as ComponentType<Record<string, unknown>>, {
        layers: [
          {
            id: "roads",
            name: "Road centerlines",
            group: "Base data",
            geometry: "polyline",
            featureCount: 532,
            visible: true,
          },
          {
            id: "parcels",
            name: "Land parcels",
            group: "Base data",
            geometry: "polygon",
            featureCount: 1284,
            visible: true,
          },
        ],
        query: "road",
        visibleOnly: false,
        onQueryChange: () => undefined,
        onSelectLayer: () => undefined,
        onVisibilityChange: () => undefined,
        onVisibleOnlyChange: () => undefined,
      }),
    )

    expect(html).toContain('data-slot="layer-panel"')
    expect(html).toContain("Road centerlines")
    expect(html).not.toContain("Land parcels")
  })

  it("keeps the panel root stable while collapsed", () => {
    const html = renderToStaticMarkup(
      createElement(LayerPanel as ComponentType<Record<string, unknown>>, {
        collapsed: true,
        labels: LAYER_PANEL_LABELS_EN,
        layers: [],
        query: "",
        visibleOnly: false,
        onQueryChange: () => undefined,
        onSelectLayer: () => undefined,
        onVisibilityChange: () => undefined,
        onVisibleOnlyChange: () => undefined,
      }),
    )

    expect(html).toMatch(/^<aside[^>]*data-slot="layer-panel"[^>]*data-collapsed="true"/)
    expect(html).toContain('<button aria-label="Expand layer panel"')
    expect(html).toContain('data-slot="tooltip-content">Expand layer panel')
  })
})

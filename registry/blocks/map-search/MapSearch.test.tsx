import type { ButtonHTMLAttributes } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/mapseek-labels", () => ({
  resolveLabels: <T extends object>(defaults: T, overrides?: Partial<T>) => ({
    ...defaults,
    ...overrides,
  }),
}))
vi.mock("@/lib/utils", () => ({
  cn: (...values: Array<string | undefined | false>) => values.filter(Boolean).join(" "),
}))
vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined | false>) => values.filter(Boolean).join(" "),
}))
vi.mock("@/components/ui/combobox", async () => {
  const React = await import("react")

  function Combobox<T>({ children }: { children: React.ReactNode; value?: T | null }) {
    return <div data-slot="combobox">{children}</div>
  }

  return {
    Combobox,
    ComboboxContent: ({
      anchor: _anchor,
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      anchor?: React.RefObject<HTMLDivElement | null>
    }) => (
      <div data-slot="combobox-content" {...props}>
        {children}
      </div>
    ),
    ComboboxInput: ({
      showTrigger: _showTrigger,
      ...props
    }: React.InputHTMLAttributes<HTMLInputElement> & { showTrigger?: boolean }) => (
      <input data-slot="combobox-input" role="combobox" aria-expanded="false" {...props} />
    ),
    ComboboxItem: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div data-slot="combobox-item" role="option" tabIndex={-1} {...props}>
        {children}
      </div>
    ),
    ComboboxList: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div data-slot="combobox-list" role="listbox" {...props}>
        {children}
      </div>
    ),
    useComboboxAnchor: () => ({ current: null }),
  }
})
vi.mock("@/components/ui/field", () => ({
  Field: "fieldset",
  FieldError: "div",
  FieldGroup: "div",
  FieldLabel: "label",
}))
vi.mock("@/components/ui/icon-button", () => ({
  IconButton: ({
    children,
    "data-slot": dataSlot,
    label,
    tooltip: _tooltip,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & {
    "data-slot"?: string
    label: string
    tooltip?: boolean | string
  }) => (
    <button {...props} data-slot={dataSlot ?? "icon-button"} aria-label={label}>
      {children}
    </button>
  ),
}))
vi.mock("@/components/ui/input", () => ({ Input: "input" }))
vi.mock("@/components/ui/spinner", () => ({ Spinner: "span" }))
vi.mock("@/components/ui/tabs", async () => import("../../ui/tabs"))
vi.mock("@/components/ui/tooltip", async () => {
  const React = await import("react")
  return {
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipContent: () => null,
    TooltipTrigger: ({ render }: { render: React.ReactElement }) => render,
  }
})

import { MapSearch } from "./MapSearch"

const requiredProps = {
  onSearchPlace: async () => [],
  onSelectPlace: () => {},
  onLocatePlace: () => {},
  onLocateCoordinates: () => {},
}

describe("MapSearch", () => {
  it("renders the place and coordinate workflows as tabs by default", () => {
    const html = renderToStaticMarkup(<MapSearch {...requiredProps} />)

    expect(html).toContain('data-slot="map-search"')
    expect(html).toContain('role="tablist"')
    expect(html).toContain("地名搜索")
    expect(html).toContain("经纬度搜索")
    expect(html).toContain('aria-label="收起"')
    expect(html).toContain('aria-label="清除"')
    expect(html).toContain('aria-label="定位"')
    expect(html).toContain('aria-label="地名"')
  })

  it("keeps place actions on one row with accessible icon buttons", () => {
    const html = renderToStaticMarkup(<MapSearch {...requiredProps} />)

    expect(html).toContain('data-slot="combobox"')
    expect(html).toContain('data-slot="combobox-input"')
    expect(html).toContain('role="combobox"')
    expect(html).toContain("@container/map-search")
    expect(html).toContain("grid-cols-[minmax(0,1fr)_auto_auto]")
    expect(html.match(/data-slot="icon-button"/g)).toHaveLength(3)
  })

  it("keeps tabular coordinate fields and icon actions on one row", () => {
    const html = renderToStaticMarkup(<MapSearch {...requiredProps} defaultTab="coordinates" />)

    expect(html.match(/class="tnum"/g)).toHaveLength(2)
    expect(html).toContain("grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]")
    expect(html.match(/data-slot="icon-button"/g)).toHaveLength(3)
  })

  it("mirrors the collapse chevron in RTL layouts", () => {
    const html = renderToStaticMarkup(<MapSearch {...requiredProps} />)

    expect(html).toContain("rtl:rotate-180")
  })

  it("renders only the expansion trigger when initially collapsed", () => {
    const html = renderToStaticMarkup(<MapSearch {...requiredProps} defaultCollapsed />)

    expect(html).toContain('data-slot="map-search-trigger"')
    expect(html).toContain('aria-label="展开"')
    expect(html).not.toContain('data-slot="map-search"')
    expect(html).not.toContain('role="tablist"')
  })
})

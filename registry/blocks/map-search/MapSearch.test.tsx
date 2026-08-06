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
vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/components/ui/field", () => ({
  Field: "fieldset",
  FieldError: "div",
  FieldGroup: "div",
  FieldLabel: "label",
}))
vi.mock("@/components/ui/icon-button", () => ({ IconButton: "button" }))
vi.mock("@/components/ui/input", () => ({ Input: "input" }))
vi.mock("@/components/ui/input-group", () => ({
  InputGroup: "fieldset",
  InputGroupAddon: "div",
  InputGroupButton: "button",
  InputGroupInput: "input",
}))
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
    expect(html).toContain('aria-label="收起搜索"')
    expect(html).toContain('aria-label="地名"')
  })

  it("renders only the expansion trigger when initially collapsed", () => {
    const html = renderToStaticMarkup(<MapSearch {...requiredProps} defaultCollapsed />)

    expect(html).toContain('data-slot="map-search-trigger"')
    expect(html).toContain('aria-label="展开搜索"')
    expect(html).not.toContain('data-slot="map-search"')
    expect(html).not.toContain('role="tablist"')
  })
})

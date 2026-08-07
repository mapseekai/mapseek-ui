import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@registry/blocks/app-top-bar", () => ({
  AppTopBar: ({ status }: { status?: ReactNode }) => <div data-slot="app-top-bar">{status}</div>,
}))
vi.mock("@registry/blocks/product-logo", () => ({ ProductLogo: () => <span /> }))
vi.mock("@registry/blocks/resource-status", () => ({
  ResourceStatusBadge: ({ tone, label }: { tone: string; label: string }) => (
    <span data-slot="resource-status-badge" data-tone={tone}>
      {label}
    </span>
  ),
}))
vi.mock("@registry/ui/button", () => ({ Button: "button" }))

import { AppTopBarDemo } from "./AppTopBarShowcase"

describe("AppTopBarDemo", () => {
  it("uses the shared neutral status badge for unsaved changes", () => {
    const html = renderToStaticMarkup(<AppTopBarDemo locale="zh-CN" />)

    expect(html).toContain('data-slot="resource-status-badge"')
    expect(html).toContain('data-tone="neutral"')
    expect(html).toContain("未保存的更改")
  })
})

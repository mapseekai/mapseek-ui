import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@registry/blocks/attr-inspector", () => ({
  AttrInspector: ({ className }: { className?: string }) => (
    <div data-slot="attr-inspector" className={className} />
  ),
}))
vi.mock("@registry/ui/toggle-group", () => ({
  ToggleGroup: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  ToggleGroupItem: ({ children }: { children?: ReactNode }) => (
    <button type="button">{children}</button>
  ),
}))

import { AttrInspectorDemo } from "./AttrInspectorShowcase"

describe("AttrInspectorDemo", () => {
  it("leaves extra bottom clearance around the inspector panel", () => {
    const html = renderToStaticMarkup(<AttrInspectorDemo locale="zh-CN" />)

    expect(html).toContain("relative h-[544px] overflow-hidden border border-border bg-muted/20")
  })
})

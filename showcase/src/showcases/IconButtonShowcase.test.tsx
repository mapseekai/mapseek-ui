import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@registry/ui/icon-button", () => ({
  IconButton: ({
    children,
    label,
    size,
    tooltip: _tooltip,
    danger: _danger,
    ...props
  }: {
    children?: ReactNode
    label: string
    size?: string
    tooltip?: boolean | string
    danger?: boolean
  }) => (
    <button {...props} aria-label={label} data-size={size} data-slot="icon-button">
      {children}
    </button>
  ),
}))

import { IconButtonOverviewDemo } from "./IconButtonShowcase"

describe("IconButtonOverviewDemo", () => {
  it("shows the 40px xl IconButton in the size scale", () => {
    const html = renderToStaticMarkup(<IconButtonOverviewDemo locale="zh-CN" />)

    expect(html).toContain('data-demo="icon-button-size-xl"')
    expect(html).toContain('data-size="xl"')
    expect(html).toContain('aria-label="编辑图层（40px）"')
  })
})

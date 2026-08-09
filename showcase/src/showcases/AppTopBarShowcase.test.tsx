import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@registry/blocks/app-top-bar", () => ({
  AppTopBar: ({
    size,
    status,
    centerActions,
    afterSaveActions,
    endActions,
  }: {
    size?: string
    status?: ReactNode
    centerActions?: ReactNode
    afterSaveActions?: ReactNode
    endActions?: ReactNode
  }) => (
    <div data-slot="app-top-bar" data-size={size}>
      {status}
      {centerActions}
      {afterSaveActions}
      {endActions}
    </div>
  ),
}))
vi.mock("@registry/blocks/product-logo", () => ({ ProductLogo: () => <span /> }))
vi.mock("@registry/ui/button", () => ({
  Button: ({ children, size, ...props }: { children?: ReactNode; size?: string }) => (
    <button {...props} data-size={size}>
      {children}
    </button>
  ),
}))
vi.mock("@registry/ui/icon-button", () => ({
  IconButton: ({
    children,
    label,
    size,
    tooltip: _tooltip,
    ...props
  }: {
    children?: ReactNode
    label: string
    size?: string
    tooltip?: boolean | string
  }) => (
    <button {...props} aria-label={label} data-size={size} data-slot="icon-button">
      {children}
    </button>
  ),
}))
vi.mock("@registry/ui/separator", () => ({
  Separator: () => <hr data-slot="separator" />,
}))
vi.mock("@registry/ui/tag", () => ({
  Tag: ({ children, color }: { children?: ReactNode; color: string }) => (
    <span data-slot="tag" data-color={color}>
      {children}
    </span>
  ),
}))

import * as AppTopBarShowcase from "./AppTopBarShowcase"

const { AppTopBarDemo } = AppTopBarShowcase

describe("AppTopBarDemo", () => {
  it("uses a gray Tag for unsaved changes", () => {
    const html = renderToStaticMarkup(<AppTopBarDemo locale="zh-CN" />)

    expect(html).toContain('data-slot="tag"')
    expect(html).toContain('data-color="gray"')
    expect(html).toContain("未保存的更改")
  })

  it("uses standard default Buttons for save-as and snapshot", () => {
    const html = renderToStaticMarkup(<AppTopBarDemo locale="zh-CN" />)

    expect(html).toMatch(
      /<button[^>]*data-demo-action="app-top-bar-save-as"[^>]*data-size="default"[^>]*>/,
    )
    expect(html).toMatch(
      /<button[^>]*data-demo-action="app-top-bar-snapshot"[^>]*data-size="default"[^>]*>/,
    )
  })

  it.each(["xs", "sm", "default", "lg"] as const)(
    "renders an actual %s AppTopBar in the size comparison",
    (size) => {
      const html = renderToStaticMarkup(<AppTopBarDemo locale="zh-CN" />)

      expect(html).toMatch(
        new RegExp(
          `<div[^>]*data-demo-size="${size}"[^>]*><div[^>]*data-slot="app-top-bar"[^>]*data-size="${size}"`,
        ),
      )
    },
  )

  it.each([
    ["xs", "xs"],
    ["sm", "sm"],
    ["default", "default"],
    ["lg", "lg"],
  ] as const)("matches the %s example action Button to its toolbar scale", (size, buttonSize) => {
    const html = renderToStaticMarkup(<AppTopBarDemo locale="zh-CN" />)

    expect(html).toMatch(
      new RegExp(
        `<div[^>]*data-demo-size="${size}"[^>]*>[\\s\\S]*?<button[^>]*data-size="${buttonSize}"`,
      ),
    )
  })

  it("exports a centered icon-action toolbar example", () => {
    const CenterActionsDemo = (
      AppTopBarShowcase as typeof AppTopBarShowcase & {
        AppTopBarCenterActionsDemo?: (props: { locale?: "zh-CN" | "en" }) => ReactNode
      }
    ).AppTopBarCenterActionsDemo

    expect(CenterActionsDemo).toBeTypeOf("function")
    if (!CenterActionsDemo) return

    const html = renderToStaticMarkup(<CenterActionsDemo locale="zh-CN" />)

    expect(html).toContain('data-demo="app-top-bar-center-actions"')
    expect([...html.matchAll(/data-slot="icon-button"/g)]).toHaveLength(5)
    expect(html).toContain('data-size="xl"')
    expect(html).toContain('aria-label="编辑"')
    expect(html).toContain('aria-label="设置"')
  })
})

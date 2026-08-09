import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    size,
    variant,
    ...props
  }: {
    children?: ReactNode
    size?: string
    variant?: string
  }) => (
    <button data-size={size} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}))
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: "div",
  TooltipContent: "div",
  TooltipTrigger: ({ render }: { render?: ReactNode }) => <>{render}</>,
}))
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))
vi.mock("./attr-field", () => ({ EditField: () => <div />, ReadField: () => <div /> }))

import { AttrInspector } from "./AttrInspector"

describe("AttrInspector", () => {
  it("keeps xs panel actions on the base Button sizing contract", () => {
    const html = renderToStaticMarkup(
      <AttrInspector
        feature={{ id: "feature-1", properties: { name: "Road" } }}
        labels={{
          title: "Attributes",
          primaryKey: "Primary key",
          close: "Close",
          addField: "Add field",
          delete: "Delete",
          viewGeoJSON: "GeoJSON",
          cancel: "Cancel",
          confirm: "Confirm",
        }}
        onAddField={() => {}}
        onDelete={() => {}}
        onViewGeoJSON={() => {}}
        onCancel={() => {}}
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )

    const buttons = Array.from(html.matchAll(/<button[^>]*>[\s\S]*?<\/button>/g)).map(
      ([button]) => button,
    )
    for (const label of ["Add field", "Delete", "GeoJSON", "Cancel", "Confirm"]) {
      const action = buttons.find((button) => button.includes(label)) ?? ""
      expect(action).not.toContain("text-body-md-medium")
      expect(action).not.toContain("px-2.5")
    }
    for (const label of ["Add field", "Delete", "GeoJSON", "Cancel", "Confirm"]) {
      const action = buttons.find((button) => button.includes(label)) ?? ""
      expect(action).toContain('data-size="xs"')
    }
    const deleteAction = buttons.find((button) => button.includes("Delete")) ?? ""
    expect(deleteAction).toContain('data-variant="destructive"')
    const closeAction = buttons.find((button) => button.includes('aria-label="Close"')) ?? ""
    expect(closeAction).toContain('data-size="icon"')
    expect(html).not.toContain("text-body-sm")
  })
})

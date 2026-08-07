import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: "div",
  TooltipContent: "div",
  TooltipTrigger: "div",
}))
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))
vi.mock("./attr-field", () => ({ EditField: () => <div />, ReadField: () => <div /> }))

import { AttrInspector } from "./AttrInspector"

describe("AttrInspector", () => {
  it("renders panel actions with the interactive control type scale", () => {
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
      />,
    )

    for (const label of ["Add field", "Delete", "GeoJSON", "Cancel", "Confirm"]) {
      const action = html.match(new RegExp(`<button[^>]*>[\\s\\S]*?${label}</button>`))?.[0] ?? ""
      expect(action).toContain("text-body-md-medium")
    }
    expect(html).not.toContain("text-body-sm")
  })
})

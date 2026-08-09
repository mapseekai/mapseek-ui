import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/badge", () => ({ Badge: "span" }))
vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

import { Toolbar } from "./Toolbar"

describe("Toolbar", () => {
  it("renders editing actions with the interactive control type scale", () => {
    const html = renderToStaticMarkup(
      <Toolbar
        groups={[]}
        activeMode="select"
        activeLayerName="Land use"
        editing
        dirty
        snapping
        canUndo={false}
        canRedo={false}
        onEditingChange={() => {}}
        onModeChange={() => {}}
        onSnappingChange={() => {}}
        onSave={() => {}}
        onUndo={() => {}}
        onRedo={() => {}}
      />,
    )

    for (const label of ["退出编辑", "保存"]) {
      const action = html.match(new RegExp(`<button[^>]*>[\\s\\S]*?${label}</button>`))?.[0] ?? ""
      expect(action).toContain("text-body-md-medium")
    }
    expect(html).not.toContain("text-body-sm")
  })
})

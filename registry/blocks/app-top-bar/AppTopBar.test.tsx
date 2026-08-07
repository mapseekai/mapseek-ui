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

import { AppTopBar } from "./AppTopBar"

describe("AppTopBar", () => {
  it("renders the primary save action with the interactive control type scale", () => {
    const html = renderToStaticMarkup(
      <AppTopBar
        projectName="Land plan"
        labels={{ back: "Back", save: "Save" }}
        onBack={() => {}}
        onSave={() => {}}
      />,
    )

    expect(html).toMatch(/<button[^>]*aria-label="Save"[^>]*class="[^"]*text-body-md-medium[^"]*"/)
    expect(html).not.toMatch(
      /<button[^>]*aria-label="Save"[^>]*class="[^"]*text-body-sm-medium[^"]*"/,
    )
  })
})

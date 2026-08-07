import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/components/ui/calendar", () => ({ Calendar: "div" }))
vi.mock("@/components/ui/input", () => ({ Input: "input" }))
vi.mock("@/components/ui/popover", () => ({
  Popover: "div",
  PopoverContent: "div",
  PopoverTrigger: "div",
}))
vi.mock("@/components/ui/select", () => ({
  Select: "div",
  SelectContent: "div",
  SelectGroup: "div",
  SelectItem: "div",
  SelectTrigger: "button",
  SelectValue: "span",
}))
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: "div",
  TooltipContent: "div",
  TooltipTrigger: "div",
}))
vi.mock("@/lib/utils", () => ({
  cn: (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" "),
}))

import { EditField } from "./attr-field"

describe("EditField", () => {
  it("does not override the shared input surface for editable text fields", () => {
    const html = renderToStaticMarkup(
      <EditField
        name="name"
        value="Road"
        meta={{ name: "name", kind: "text" }}
        primaryKeyLabel="Primary key"
        onChange={() => {}}
      />,
    )

    expect(html).toMatch(/<input[^>]*class="[^"]*w-full[^"]*"/)
    expect(html).toMatch(/<input[^>]*class="[^"]*border-input[^"]*bg-input-surface[^"]*"/)
    expect(html).not.toMatch(/<input[^>]*class="[^"]*(?:border-border|bg-background)[^"]*"/)
  })

  it("does not override the shared select input surface for enum fields", () => {
    const html = renderToStaticMarkup(
      <EditField
        name="type"
        value="road"
        meta={{ name: "type", enumOptions: ["road", "water"] }}
        primaryKeyLabel="Primary key"
        onChange={() => {}}
      />,
    )

    expect(html).toMatch(/<button[^>]*class="[^"]*w-full[^"]*"/)
    expect(html).toMatch(/<button[^>]*class="[^"]*border-input[^"]*bg-input-surface[^"]*"/)
    expect(html).not.toMatch(/<button[^>]*class="[^"]*(?:border-border|bg-background)[^"]*"/)
  })
})

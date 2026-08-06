import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))
vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))
vi.mock("@/lib/mapseek-labels", () => ({
  resolveLabels: <T extends object>(defaults: T, overrides?: Partial<T>) => ({
    ...defaults,
    ...overrides,
  }),
}))
vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/components/ui/input", () => ({ Input: "input" }))
vi.mock("@/components/ui/select", () => ({
  Select: "div",
  SelectContent: "div",
  SelectGroup: "div",
  SelectItem: "div",
  SelectTrigger: "button",
  SelectValue: "span",
}))
vi.mock("@/components/ui/textarea", () => ({ Textarea: "textarea" }))
vi.mock("@/components/ui/tabs", async () => import("../../ui/tabs"))

import { FilterPanel } from "./FilterPanel"

describe("FilterPanel.ModeToggle", () => {
  it("uses tab semantics and marks the current mode as selected", () => {
    const html = renderToStaticMarkup(
      <FilterPanel
        fields={["type"]}
        value={{ mode: "builder", rows: [], sql: "" }}
        onChange={() => {}}
      >
        <FilterPanel.ModeToggle />
      </FilterPanel>,
    )

    expect(html).toContain('role="tablist"')
    expect(html).toContain('data-variant="primary"')
    expect(html).toMatch(/role="tab"[^>]*aria-selected="true"[^>]*>.*构建器/s)
    expect(html).toMatch(/role="tab"[^>]*aria-selected="false"[^>]*>.*SQL/s)
  })
})

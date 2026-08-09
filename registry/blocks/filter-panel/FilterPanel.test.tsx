import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
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
    const tabs = html.match(/<button[^>]*role="tab"[^>]*>/g) ?? []

    expect(tabs).toHaveLength(2)
    for (const tab of tabs) {
      expect(tab).toContain("text-body-md-medium")
      expect(tab).not.toContain("text-body-sm")
    }
  })
})

describe("FilterPanel.Builder", () => {
  it("does not override the shared input surfaces", () => {
    const html = renderToStaticMarkup(
      <FilterPanel
        fields={["type"]}
        value={{
          mode: "builder",
          rows: [{ id: 1, conn: "AND", field: "type", op: "=", value: "road" }],
          sql: "",
        }}
        onChange={() => {}}
      >
        <FilterPanel.Builder ops={["="]} />
      </FilterPanel>,
    )

    expect(html).not.toMatch(/<button[^>]*class="[^"]*(?:border-border|bg-background)[^"]*"/)
    expect(html).toMatch(/<input[^>]*class="[^"]*border-input[^"]*bg-input-surface[^"]*"/)
    expect(html).not.toMatch(/<input[^>]*class="[^"]*(?:border-border|bg-background)[^"]*"/)
  })

  it("uses the standard 24px button size for builder connectors and SQL keywords", async () => {
    const source = await readFile(resolve(import.meta.dirname, "FilterPanel.tsx"), "utf8")
    const builder = source.slice(
      source.indexOf("function FilterPanelBuilder"),
      source.indexOf("function FilterPanelSql"),
    )
    const sql = source.slice(
      source.indexOf("function FilterPanelSql"),
      source.indexOf("function FilterPanelFooter"),
    )

    expect(builder).toContain('size="xs"')
    expect(builder).toContain("text-label-md")
    expect(builder).not.toContain("h-5")
    expect(builder).not.toContain("text-[10px]")
    expect(sql).toContain('size="xs"')
    expect(sql).toContain("text-label-md")
    expect(sql).not.toContain("h-5")
    expect(sql).not.toContain("text-[10px]")
    expect(sql).not.toContain("px-[5px]")
  })
})

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
import type { FilterPanelLabels } from "./labels"
import type { FilterCondition } from "./types"

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
  function renderBuilder(rows: FilterCondition[], labels?: Partial<FilterPanelLabels>) {
    return renderToStaticMarkup(
      <FilterPanel
        fields={["type", "name"]}
        value={{ mode: "builder", rows, sql: "" }}
        onChange={() => {}}
        labels={labels}
      >
        <FilterPanel.Builder ops={["=", "!="]} />
      </FilterPanel>,
    )
  }

  const rows: FilterCondition[] = [
    { id: 4, conn: "AND", field: "type", op: "=", value: "road" },
    { id: 8, conn: "OR", field: "name", op: "!=", value: "Main" },
  ]

  it("gives each condition control a distinct localized accessible name", () => {
    const html = renderBuilder(rows, {
      field: "Field",
      operator: "Operator",
      connection: "Connection",
      value: "Value",
      removeCondition: "Remove condition",
    })

    for (const name of ["Field", "Operator", "Value", "Remove condition"]) {
      for (const rowNumber of [1, 2]) {
        expect(html.match(new RegExp(`aria-label="${name} ${rowNumber}"`, "g"))).toHaveLength(1)
      }
    }
    expect(html).toMatch(/role="radiogroup"[^>]*aria-label="Connection 2"/)
    expect(html).not.toContain('aria-label="Connection 1"')
    expect(html).toContain("添加条件")
  })

  it.each(["AND", "OR"] as const)("exposes %s as the controlled connector selection", (conn) => {
    const html = renderBuilder([rows[0], { ...rows[1], conn }])
    const radios = html.match(/<[^>]*role="radio"[^>]*>[\s\S]*?<\/[^>]+>/g) ?? []

    expect(radios).toHaveLength(2)
    for (const radio of radios) {
      const checked = radio.includes(`>${conn}<`)
      expect(radio).toContain(`aria-checked="${checked}"`)
    }
    expect(html).toContain('aria-label="连接方式 2"')
  })

  it("renumbers accessible names when an earlier condition is removed", () => {
    const html = renderBuilder(rows.slice(1))

    expect(html).toContain('aria-label="字段 1"')
    expect(html).toContain('aria-label="运算符 1"')
    expect(html).toContain('aria-label="值 1"')
    expect(html).toContain('aria-label="删除条件 1"')
    expect(html).not.toContain('aria-label="字段 2"')
    expect(html).not.toContain('role="radiogroup"')
  })

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

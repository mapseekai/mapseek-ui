import { readFile } from "node:fs/promises"
import { type ComponentType, createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { expect, it, vi } from "vitest"
import { rawTypeBadgeClass } from "./columns"
import type { ColumnDef, RowSource } from "./types"
import { VirtualTable } from "./virtual-table"

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => [{ index: 0, key: "row-0", start: 0 }],
    getTotalSize: () => 36,
    measureElement: () => undefined,
  }),
}))

vi.mock("@/components/ui/button", () => ({ Button: () => null }))
vi.mock("@/components/ui/skeleton", () => ({ Skeleton: () => null }))
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: unknown }) => children,
  TooltipContent: () => null,
  TooltipProvider: ({ children }: { children: unknown }) => children,
  TooltipTrigger: ({ render }: { render: unknown }) => render,
}))
vi.mock("@/lib/utils", () => ({
  cn: (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" "),
}))

type TestRow = { value: string }

type TestVirtualTableProps = {
  columns: ColumnDef[]
  source: RowSource<TestRow>
  getRowKey: (row: TestRow | undefined, index: number) => string | number
  renderCell: (row: TestRow, col: ColumnDef) => React.ReactNode
  getCellText: (row: TestRow, col: ColumnDef) => string | undefined
  emptyLabel: string
  errorRetryLabel: string
  indexColLabel: string
}

const VirtualTableWithCellText = VirtualTable as unknown as ComponentType<TestVirtualTableProps>

it.each([
  ["varchar(64)", "border-cat-1/30 bg-cat-1/10 text-cat-1"],
  ["integer", "border-cat-5/30 bg-cat-5/10 text-cat-5"],
  ["boolean", "border-cat-2/30 bg-cat-2/10 text-cat-2"],
  ["timestamptz", "border-cat-3/30 bg-cat-3/10 text-cat-3"],
  ["jsonb", "border-cat-4/30 bg-cat-4/10 text-cat-4"],
])("colors the %s type family", (rawType, expectedClassName) => {
  expect(rawTypeBadgeClass(rawType)).toBe(expectedClassName)
})

it("uses a neutral tag for unknown field types", () => {
  expect(rawTypeBadgeClass("custom_domain")).toContain("border-border bg-muted/50")
})

it("does not attach a native title before a data cell overflows", () => {
  const fullValue = "parcel-2026-08-06-northwest-coastal-protection-corridor"
  const source: RowSource<TestRow> = {
    totalCount: 1,
    getRow: (index) => (index === 0 ? { value: fullValue } : undefined),
    scrollKey: "long-value",
    isInitialLoading: false,
    error: null,
    refetch: () => undefined,
  }

  const html = renderToStaticMarkup(
    createElement(VirtualTableWithCellText, {
      columns: [{ name: "identifier", rawType: "text" }],
      source,
      getRowKey: (row, index) => row?.value ?? index,
      renderCell: (row) => createElement("span", { className: "font-medium" }, row.value),
      getCellText: (row) => row.value,
      emptyLabel: "No rows",
      errorRetryLabel: "Retry",
      indexColLabel: "#",
    }),
  )

  expect(html).not.toContain(`title="${fullValue}"`)
})

it("uses shared controls and square themed scrollbars", async () => {
  const [schemaTable, virtualTable, registry] = await Promise.all([
    readFile("registry/blocks/attr-table/schema-table.tsx", "utf8"),
    readFile("registry/blocks/attr-table/virtual-table.tsx", "utf8"),
    readFile("registry/blocks/registry.json", "utf8"),
  ])

  expect(schemaTable).toContain('import { CopyButton } from "@/components/ui/copy-button"')
  expect(schemaTable).toContain("<CopyButton")
  expect(schemaTable).toContain('import { Badge } from "@/components/ui/badge"')
  expect(schemaTable).toContain("<Badge")
  expect(schemaTable).toContain('variant="outline"')
  expect(schemaTable).toContain("rawTypeBadgeClass(row.rawType)")
  expect(schemaTable).not.toContain("IconCopy")
  expect(virtualTable).toContain("[scrollbar-color:var(--border)_transparent]")
  expect(virtualTable).toContain("[&::-webkit-scrollbar-thumb]:rounded-none")
  expect(virtualTable).toContain("justify-start gap-0")
  expect(virtualTable).toContain(
    "bg-selection-bg text-primary ring-1 ring-primary/40 ring-inset hover:bg-selection-bg hover:text-primary [&>div>span]:text-primary",
  )
  expect(
    JSON.parse(registry).items.find((item: { name: string }) => item.name === "attr-table"),
  ).toHaveProperty(
    "registryDependencies",
    expect.arrayContaining(["@mapseek/badge", "@mapseek/copy-button"]),
  )
})

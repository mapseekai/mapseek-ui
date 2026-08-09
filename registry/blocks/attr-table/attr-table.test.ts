import { readFile } from "node:fs/promises"
import { type ComponentProps, type ComponentType, createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { expect, it, vi } from "vitest"
import { rawTypeTagColor } from "./columns"
import { SchemaTable } from "./schema-table"
import type { ColumnDef, RowSource } from "./types"
import { VirtualTable } from "./virtual-table"

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => [{ index: 0, key: "row-0", start: 0 }],
    getTotalSize: () => 36,
    measureElement: () => undefined,
  }),
}))

const buttonCalls = vi.hoisted(() => vi.fn())

type ButtonMockProps = ComponentProps<"button"> & {
  variant?: string
  size?: string
}

type EmptyMediaMockProps = ComponentProps<"div"> & {
  variant?: string
}

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    type: _type,
    variant = "default",
    size = "default",
    ...props
  }: ButtonMockProps) => {
    buttonCalls({ children, variant, size, ...props })
    return createElement("div", { "data-variant": variant, ...props }, children)
  },
}))
vi.mock("@/components/ui/empty", () => ({
  Empty: ({ children, className, ...props }: ComponentProps<"div">) =>
    createElement("div", { "data-slot": "empty", className, ...props }, children),
  EmptyContent: ({ children, className, ...props }: ComponentProps<"div">) =>
    createElement("div", { "data-slot": "empty-content", className, ...props }, children),
  EmptyHeader: ({ children, className, ...props }: ComponentProps<"div">) =>
    createElement("div", { "data-slot": "empty-header", className, ...props }, children),
  EmptyMedia: ({ children, className, variant = "default", ...props }: EmptyMediaMockProps) =>
    createElement(
      "div",
      { "data-slot": "empty-media", "data-variant": variant, className, ...props },
      children,
    ),
  EmptyTitle: ({ children, className, ...props }: ComponentProps<"div">) =>
    createElement("div", { "data-slot": "empty-title", className, ...props }, children),
}))
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
  className?: string
}

const VirtualTableWithCellText = VirtualTable as unknown as ComponentType<TestVirtualTableProps>

function renderTable(source: RowSource<TestRow>, className?: string) {
  return renderToStaticMarkup(
    createElement(VirtualTableWithCellText, {
      columns: [{ name: "value", rawType: "text" }],
      source,
      getRowKey: (row, index) => row?.value ?? index,
      renderCell: (row) => row.value,
      getCellText: (row) => row.value,
      emptyLabel: "No rows",
      errorRetryLabel: "Retry",
      indexColLabel: "#",
      className,
    }),
  )
}

it.each([
  ["varchar(64)", "green"],
  ["integer", "purple"],
  ["boolean", "blue"],
  ["timestamptz", "yellow"],
  ["jsonb", "orange"],
])("maps the %s type family to the correct Tag color", (rawType, expectedColor) => {
  expect(rawTypeTagColor(rawType)).toBe(expectedColor)
})

it("uses a neutral tag for unknown field types", () => {
  expect(rawTypeTagColor("custom_domain")).toBe("gray")
})

it("renders schema field types with the shared Tag primitive", () => {
  const html = renderToStaticMarkup(
    createElement(SchemaTable, {
      attributes: { name: "varchar(64)" },
      searchPlaceholder: "Search fields",
      emptyLabel: "No fields",
      noMatchLabel: "No matching fields",
      copyActionLabel: "Copy field name",
    }),
  )

  expect(html).toContain('data-slot="tag"')
  expect(html).toContain('data-color="green"')
  expect(html).toContain("varchar(64)")
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

it("renders the shared Empty structure for an empty data source", () => {
  const html = renderTable({
    totalCount: 0,
    getRow: () => undefined,
    scrollKey: "empty",
    isInitialLoading: false,
    error: null,
    refetch: () => undefined,
  })

  expect(html).toContain('data-slot="empty"')
  expect(html).toContain('data-slot="empty-header"')
  expect(html).toContain('data-slot="empty-media"')
  expect(html).toContain('data-slot="empty-title"')
  expect(html).not.toContain('data-slot="empty-content"')
  expect(html).toContain('data-slot="empty" class="w-full max-w-sm min-h-32 flex-none"')
  expect(html).toContain('aria-hidden="true"')
  expect(html).toContain("No rows")
})

it("keeps terminal-state className on the outer layout container", () => {
  const html = renderTable(
    {
      totalCount: 0,
      getRow: () => undefined,
      scrollKey: "empty-with-class-name",
      isInitialLoading: false,
      error: null,
      refetch: () => undefined,
    },
    "empty-state-sentinel",
  )

  expect(html).toContain(
    '<div class="flex h-full min-h-0 items-center justify-center p-4 empty-state-sentinel"><div data-slot="empty"',
  )
  expect(html).not.toContain('data-slot="empty" class="empty-state-sentinel')
})

it("renders a frameless Empty error state with a primary retry action", () => {
  const refetch = vi.fn()
  buttonCalls.mockClear()
  const html = renderTable({
    totalCount: 0,
    getRow: () => undefined,
    scrollKey: "error",
    isInitialLoading: false,
    error: new Error("Network unavailable"),
    refetch,
  })

  expect(html).toContain('data-slot="empty"')
  expect(html).toContain('data-slot="empty-header"')
  expect(html).toContain('data-slot="empty-media"')
  expect(html).toContain('data-slot="empty-title"')
  expect(html).toContain('data-slot="empty-content"')
  expect(html).toContain(
    'data-slot="empty" class="w-full max-w-sm min-h-32 flex-none border-0 bg-transparent"',
  )
  expect(html).toContain("border-destructive")
  expect(html).toContain("text-destructive")
  expect(html).toContain("Network unavailable")
  expect(html).toContain('data-variant="default"')
  expect(html).toContain('role="alert"')
  expect(html).toContain('aria-hidden="true"')

  const retryProps = buttonCalls.mock.calls.at(-1)?.[0] as
    | { onClick?: () => void; size?: string }
    | undefined
  expect(retryProps?.size).toBe("default")
  retryProps?.onClick?.()

  expect(refetch).toHaveBeenCalledOnce()
})

it("keeps the virtualized data layout in div containers", () => {
  const html = renderTable({
    totalCount: 1,
    getRow: (index) => (index === 0 ? { value: "feature-0" } : undefined),
    scrollKey: "table-semantics",
    isInitialLoading: false,
    error: null,
    refetch: () => undefined,
  })

  expect(html).toContain(
    '<div style="min-width:224px" class="relative w-full font-mono text-body-md">',
  )
  expect(html).toContain('<div data-index="0"')
  expect(html).not.toContain("<table")
  expect(html).not.toContain("<thead")
  expect(html).not.toContain("<tbody")
})

it("renders square styling for every visible table scrollbar surface", () => {
  const html = renderTable({
    totalCount: 1,
    getRow: (index) => (index === 0 ? { value: "feature-0" } : undefined),
    scrollKey: "square-scrollbar",
    isInitialLoading: false,
    error: null,
    refetch: () => undefined,
  })

  expect(html).toContain("[&amp;::-webkit-scrollbar]:rounded-none")
  expect(html).toContain("[&amp;::-webkit-scrollbar-track]:rounded-none")
  expect(html).toContain("[&amp;::-webkit-scrollbar-thumb]:rounded-none")
  expect(html).toContain("[&amp;::-webkit-scrollbar-corner]:rounded-none")
})

it("uses shared controls and square themed scrollbars", async () => {
  const [schemaTable, virtualTable, registry] = await Promise.all([
    readFile("registry/blocks/attr-table/schema-table.tsx", "utf8"),
    readFile("registry/blocks/attr-table/virtual-table.tsx", "utf8"),
    readFile("registry/blocks/registry.json", "utf8"),
  ])

  expect(schemaTable).toContain('import { CopyButton } from "@/components/ui/copy-button"')
  expect(schemaTable).toContain("<CopyButton")
  expect(schemaTable).toContain('import { Tag } from "@/components/ui/tag"')
  expect(schemaTable).toContain("<Tag")
  expect(schemaTable).toContain("rawTypeTagColor(row.rawType)")
  expect(schemaTable).not.toContain("components/ui/badge")
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
    expect.arrayContaining(["@mapseek/copy-button", "@mapseek/empty", "@mapseek/tag"]),
  )
})

it("renders a labelled semantic schema search input", () => {
  const html = renderToStaticMarkup(
    createElement(SchemaTable, {
      attributes: { name: "varchar(64)" },
      searchPlaceholder: "Search fields",
      emptyLabel: "No fields",
      noMatchLabel: "No matching fields",
      copyActionLabel: "Copy field name",
    }),
  )

  expect(html).toMatch(/<label class="sr-only" for="[^"]+">Search fields<\/label>/)
  expect(html).toContain('type="search"')
  expect(html).toContain('name="schema-field-search"')
  expect(html).toContain('autoComplete="off"')
  expect(html).toContain("h-8 w-[200px] rounded-none pl-7 text-body-md")
})

it("disables the sheet height transition when reduced motion is preferred", async () => {
  const sheet = await readFile("registry/blocks/attr-table/attr-table-sheet.tsx", "utf8")

  expect(sheet).toContain("motion-reduce:transition-none")
})

it("keeps the sheet showcase scrim light and free of a decorative background", async () => {
  const showcase = await readFile("showcase/src/showcases/AttrTableShowcase.tsx", "utf8")

  expect(showcase).toContain('className="fixed inset-0 z-50 bg-black/10"')
  expect(showcase).not.toContain("repeating-linear-gradient")
})

it("requires a full-text accessor for data table cells", async () => {
  const [dataTable, virtualTable] = await Promise.all([
    readFile("registry/blocks/attr-table/data-table.tsx", "utf8"),
    readFile("registry/blocks/attr-table/virtual-table.tsx", "utf8"),
  ])

  expect(dataTable).toContain("getCellText: (row: TRow, col: ColumnDef) => string | undefined")
  expect(virtualTable).toContain("getCellText: (row: TRow, col: ColumnDef) => string | undefined")
})

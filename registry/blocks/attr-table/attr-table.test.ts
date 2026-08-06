import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"
import { rawTypeBadgeClass } from "./columns"

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

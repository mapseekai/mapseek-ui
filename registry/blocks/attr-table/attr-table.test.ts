import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"

it("uses the shared copy control and square themed scrollbars", async () => {
  const [schemaTable, virtualTable, registry] = await Promise.all([
    readFile("registry/blocks/attr-table/schema-table.tsx", "utf8"),
    readFile("registry/blocks/attr-table/virtual-table.tsx", "utf8"),
    readFile("registry/blocks/registry.json", "utf8"),
  ])

  expect(schemaTable).toContain('import { CopyButton } from "@/components/ui/copy-button"')
  expect(schemaTable).toContain("<CopyButton")
  expect(schemaTable).not.toContain("IconCopy")
  expect(virtualTable).toContain("[scrollbar-color:var(--border)_transparent]")
  expect(virtualTable).toContain("[&::-webkit-scrollbar-thumb]:rounded-none")
  expect(
    JSON.parse(registry).items.find((item: { name: string }) => item.name === "attr-table"),
  ).toHaveProperty("registryDependencies", expect.arrayContaining(["@mapseek/copy-button"]))
})

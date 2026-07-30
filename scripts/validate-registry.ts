import { fileURLToPath } from "node:url"
import { assertValidCatalog, BASE_COMPONENTS, BLOCKS, type RegistryItem } from "./registry-model"

export function assertCompleteInventory(items: readonly RegistryItem[]): void {
  const expectedTypeByName = new Map<string, RegistryItem["type"]>([
    ...BASE_COMPONENTS.map((name) => [name, "registry:ui"] as const),
    ...BLOCKS.map((name) => [name, "registry:block"] as const),
  ])
  const actualByName = new Map(items.map((item) => [item.name, item]))
  const missing = [...expectedTypeByName].filter(([name]) => !actualByName.has(name)).map(([name]) => name)
  const unexpected = [...actualByName].filter(([name]) => !expectedTypeByName.has(name)).map(([name]) => name)
  const wrongType = [...expectedTypeByName].filter(([name, type]) => actualByName.get(name)?.type !== type).map(([name]) => name)
  if (missing.length || unexpected.length || wrongType.length) throw new Error(`inventory mismatch: missing ${missing.join(", ")}; unexpected ${unexpected.join(", ")}; wrong type ${wrongType.join(", ")}`)
}

if (import.meta.main) {
  const repoRoot = fileURLToPath(new URL("..", import.meta.url))
  const items = await assertValidCatalog(repoRoot)
  if (Bun.argv.includes("--complete")) assertCompleteInventory(items)
}

import blockRegistry from "@registry/blocks/registry.json"
import uiRegistry from "@registry/ui/registry.json"

export type RegistryDocItem = {
  readonly name: string
  readonly type: string
  readonly title: string
  readonly description: string
  readonly dependencies: readonly string[]
  readonly registryDependencies: readonly string[]
}

type ManifestItem = {
  readonly name: string
  readonly type: string
  readonly title?: string
  readonly description?: string
  readonly dependencies?: readonly string[]
  readonly registryDependencies?: readonly string[]
}

function titleFromName(name: string) {
  return name
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ")
}

const items = new Map<string, ManifestItem>(
  [...uiRegistry.items, ...blockRegistry.items].map((item) => [item.name, item as ManifestItem]),
)

export function getRegistryDocItem(name: string): RegistryDocItem {
  const item = items.get(name)

  if (!item) {
    throw new Error(`Unknown registry item: ${name}`)
  }

  return {
    name: item.name,
    type: item.type,
    title: item.title ?? titleFromName(item.name),
    description: item.description ?? "",
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
  }
}

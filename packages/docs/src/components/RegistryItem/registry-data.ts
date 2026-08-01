import blockRegistry from "@registry/blocks/registry.json"
import uiRegistry from "@registry/ui/registry.json"

export type RegistryDocItem = {
  readonly name: string
  readonly type: string
  readonly category: "block" | "primitive"
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

function hasManifestName(item: Partial<ManifestItem>): item is ManifestItem {
  return typeof item.name === "string" && item.name.length > 0 && typeof item.type === "string"
}

const manifestItems = [...uiRegistry.items, ...blockRegistry.items]
  .map((item) => item as Partial<ManifestItem>)
  .filter(hasManifestName)

const items = new Map<string, ManifestItem>(manifestItems.map((item) => [item.name, item]))

function toRegistryDocItem(item: ManifestItem): RegistryDocItem {
  return {
    name: item.name,
    type: item.type,
    category: item.type === "registry:block" ? "block" : "primitive",
    title: item.title ?? titleFromName(item.name),
    description: item.description ?? "",
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
  }
}

export function getRegistryDocItem(name: string): RegistryDocItem {
  const item = items.get(name)

  if (!item) {
    throw new Error(`Unknown registry item: ${name}`)
  }

  return toRegistryDocItem(item)
}

export function getRegistryDocItems(
  category: RegistryDocItem["category"],
): readonly RegistryDocItem[] {
  return Array.from(items.values())
    .map(toRegistryDocItem)
    .filter((item) => item.category === category)
    .sort((left, right) => left.title.localeCompare(right.title, "en"))
}

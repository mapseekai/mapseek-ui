import { describe, expect, it } from "vitest"
import { collectLocalizedDocs } from "../check-docs-i18n"
import { requiredRegistryDocs } from "../docs-required-registry-docs"
import { loadCatalog, type RegistryItem } from "../registry-model"

function registryCategory(item: RegistryItem): "block" | "primitive" | undefined {
  if (item.type === "registry:ui") return "primitive"
  if (item.type === "registry:block") return "block"
  return undefined
}

function docsIdentity(category: "block" | "primitive", registryName: string): string {
  return `${category}:${registryName}`
}

const promotedShowcaseBlocks = [
  "custom-colormap",
  "layer-panel",
  "toolbox",
  "toolbar",
] as const

describe("docs coverage", () => {
  it("publishes promoted showcase components as registry blocks", async () => {
    const catalog = await loadCatalog(process.cwd())
    const publishedBlocks = new Set(
      catalog.filter((item) => item.type === "registry:block").map((item) => item.name),
    )

    for (const registryName of promotedShowcaseBlocks) {
      expect(publishedBlocks.has(registryName), `${registryName} should be a registry block`).toBe(
        true,
      )
    }
  })

  it("covers every published primitive and block with one bilingual docs page", async () => {
    const catalog = await loadCatalog(process.cwd())
    const registryItems = catalog
      .flatMap((item) => {
        const category = registryCategory(item)
        return category ? [docsIdentity(category, item.name)] : []
      })
      .sort()
    const { zh, en } = await collectLocalizedDocs("packages/docs")

    const zhDocs = [...zh.values()]
      .filter((doc) => doc.metadata.registryName !== "theme")
      .map((doc) => docsIdentity(doc.metadata.category, doc.metadata.registryName))
      .sort()
    const enDocs = [...en.values()]
      .filter((doc) => doc.metadata.registryName !== "theme")
      .map((doc) => docsIdentity(doc.metadata.category, doc.metadata.registryName))
      .sort()

    expect(zhDocs).toEqual(registryItems)
    expect(enDocs).toEqual(registryItems)
  })

  it("keeps registry docs metadata aligned to the Showcase catalog", async () => {
    const { zh, en } = await collectLocalizedDocs("packages/docs")

    for (const [registryName, required] of requiredRegistryDocs) {
      const zhDoc = [...zh.values()].find((doc) => doc.metadata.registryName === registryName)
      const enDoc = [...en.values()].find((doc) => doc.metadata.registryName === registryName)

      expect(zhDoc?.metadata.category).toBe(required.category)
      expect(enDoc?.metadata.category).toBe(required.category)
      expect(zhDoc?.metadata.showcase).toBe(registryName)
      expect(enDoc?.metadata.showcase).toBe(registryName)
    }
  })
})

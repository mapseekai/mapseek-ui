import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { loadCatalog } from "../registry-model"

const foundationalPrimitives = [
  "accordion", "avatar", "badge", "button", "card", "collapsible", "dialog",
  "empty", "icon-button", "label", "separator", "skeleton", "tooltip",
] as const

const repoRoot = fileURLToPath(new URL("../..", import.meta.url))

describe("foundational primitive inventory", () => {
  it("registers every foundational primitive as portable themed UI", async () => {
    const items = await loadCatalog(repoRoot)
    const itemsByName = new Map(items.map((item) => [item.name, item]))

    for (const name of foundationalPrimitives) {
      const item = itemsByName.get(name)
      expect(item, `missing ${name}`).toBeDefined()
      expect(item?.type).toBe("registry:ui")
      expect(item?.files).toHaveLength(1)
      expect(item?.files[0]?.target).toMatch(/^@ui\//)
      expect(item?.registryDependencies).toContain("@mapseek/theme")
    }
  })
})

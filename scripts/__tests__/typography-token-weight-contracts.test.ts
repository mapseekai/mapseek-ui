import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const repoRoot = resolve(import.meta.dirname, "../..")

describe("typography token weight contract", () => {
  it("does not override the listed typography tokens with font-normal", async () => {
    const [resourceSidebar, resourceDetailDrawer, styleEditorModal] = await Promise.all([
      readFile(resolve(repoRoot, "registry/blocks/resource-sidebar/ResourceSidebar.tsx"), "utf8"),
      readFile(
        resolve(repoRoot, "registry/blocks/resource-detail-drawer/ResourceDetailDrawer.tsx"),
        "utf8",
      ),
      readFile(
        resolve(repoRoot, "registry/blocks/style-editor-modal/StyleEditorModal.tsx"),
        "utf8",
      ),
    ])

    expect(resourceSidebar).not.toContain("text-label-sm font-normal")
    expect(resourceDetailDrawer).not.toContain("text-label-sm font-normal")
    expect(resourceDetailDrawer).not.toContain("text-headline-lg font-normal")
    expect(styleEditorModal).not.toContain("text-headline-lg font-normal")
  })
})

import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const repoRoot = resolve(import.meta.dirname, "../..")

describe("card hover contract", () => {
  it("uses a primary border and primary surface fill on hover", async () => {
    const [resourceGrid, styleSourcePicker, styleEditorModal] = await Promise.all([
      readFile(resolve(repoRoot, "registry/blocks/resource-grid/ResourceGrid.tsx"), "utf8"),
      readFile(
        resolve(repoRoot, "registry/blocks/style-source-picker-dialog/StyleSourcePickerDialog.tsx"),
        "utf8",
      ),
      readFile(
        resolve(repoRoot, "registry/blocks/style-editor-modal/StyleEditorModal.tsx"),
        "utf8",
      ),
    ])

    expect(resourceGrid).toContain("hover:border-primary hover:bg-primary/5")
    expect(styleSourcePicker).toContain("hover:border-primary hover:bg-primary/5")
    expect(styleEditorModal).toContain("hover:border-primary hover:bg-primary/5")
  })

  it("uses the same surface and border for selected source cards", async () => {
    const source = await readFile(
      resolve(repoRoot, "registry/blocks/style-source-picker-dialog/StyleSourcePickerDialog.tsx"),
      "utf8",
    )

    expect(source).toMatch(
      /selected\s*\?\s*"border-primary bg-primary\/5 hover:border-primary hover:bg-primary\/5"/,
    )
  })
})

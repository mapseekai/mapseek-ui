import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("ResourceGrid", () => {
  it("uses auto-fill for the fixed-width icon card grid", async () => {
    const source = await readFile(resolve(import.meta.dirname, "ResourceGrid.tsx"), "utf8")

    expect(source).toContain("grid-cols-[repeat(auto-fill,minmax(96px,1fr))]")
    expect(source).not.toContain("grid-cols-[repeat(auto-fit,minmax(96px,1fr))]")
  })
})

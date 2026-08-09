import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const repoRoot = resolve(import.meta.dirname, "../..")

describe("tabular numerals contract", () => {
  it("marks detailed storage values and coordinate fallbacks as tabular", async () => {
    const [storageMeter, mapSearch] = await Promise.all([
      readFile(resolve(repoRoot, "registry/blocks/storage-meter/StorageMeter.tsx"), "utf8"),
      readFile(resolve(repoRoot, "registry/blocks/map-search/MapSearch.tsx"), "utf8"),
    ])

    expect(storageMeter).toContain("font-mono text-body-sm text-muted-foreground tnum")
    expect(mapSearch).toMatch(
      /place\.description\s*\?\?\s*\([\s\S]*<span className="tnum">[\s\S]*place\.longitude[\s\S]*place\.latitude/,
    )
  })
})

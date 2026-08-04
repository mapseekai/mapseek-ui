import { readdir, readFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { describe, expect, it } from "vitest"

import { SHADCN_PACKAGE, SHADCN_VERSION } from "../../shared/shadcn"

const repoRoot = resolve(import.meta.dirname, "../..")

async function tsxFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
    .map((entry) => join(entry.parentPath, entry.name))
}

describe("migration guardrails", () => {
  it("keeps business-facing components on registry form controls", async () => {
    const roots = ["registry/blocks", "showcase/src", "packages/docs/src"].map((path) =>
      join(repoRoot, path),
    )
    const files = (await Promise.all(roots.map(tsxFiles))).flat()
    const violations: string[] = []

    for (const file of files) {
      if (file.endsWith("source-catalog.generated.tsx")) continue
      const source = await readFile(file, "utf8")
      if (/<(?:button|input|select|textarea)\b/.test(source)) {
        violations.push(file.slice(repoRoot.length + 1))
      }
    }

    expect(violations).toEqual([])
  })

  it("keeps the shadcn CLI constant aligned with the installed dependency", async () => {
    const packageJson = JSON.parse(await readFile(join(repoRoot, "package.json"), "utf8")) as {
      devDependencies?: Record<string, string>
    }

    expect(SHADCN_PACKAGE).toBe(`shadcn@${SHADCN_VERSION}`)
    expect(packageJson.devDependencies?.shadcn?.replace(/^[~^]/, "")).toBe(SHADCN_VERSION)
  })
})

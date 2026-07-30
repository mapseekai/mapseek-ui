import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import type { RegistryItem } from "../registry-model"
import { assertGeneratedOutputMatchesCatalog, validateCatalog } from "../registry-model"

let fixtureRoot: string

function item(name: string, overrides: Partial<RegistryItem> = {}): RegistryItem {
  return {
    name,
    type: "registry:ui",
    files: [{ path: `registry/ui/${name}.tsx`, type: "registry:ui", target: `@ui/${name}.tsx` }],
    ...overrides,
  }
}

async function writeFixture(path: string, content: string): Promise<void> {
  const target = join(fixtureRoot, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "mapseek-registry-"))
  await writeFixture("registry.json", JSON.stringify({ include: ["registry/ui/registry.json"] }))
  await writeFixture("registry/ui/registry.json", JSON.stringify({ items: [] }))
})
afterEach(async () => rm(fixtureRoot, { recursive: true, force: true }))

async function codes(items: readonly RegistryItem[]) {
  return (await validateCatalog(fixtureRoot, items)).map((issue) => issue.code)
}

describe("validateCatalog", () => {
  it("rejects duplicate names", async () => {
    expect(await codes([item("demo"), item("demo")])).toContain("duplicate-name")
  })

  it("rejects missing files", async () => {
    expect(await codes([item("demo")])).toContain("missing-file")
  })

  it("rejects a missing namespaced dependency", async () => {
    const issues = await validateCatalog(fixtureRoot, [item("demo", { registryDependencies: ["@mapseek/missing"] })])
    expect(issues).toContainEqual({ code: "missing-registry-dependency", item: "demo", detail: "@mapseek/missing" })
  })

  it("rejects dependency cycles", async () => {
    await writeFixture("registry/ui/a.tsx", "export {}")
    await writeFixture("registry/ui/b.tsx", "export {}")
    expect(await codes([item("a", { registryDependencies: ["@mapseek/b"] }), item("b", { registryDependencies: ["@mapseek/a"] })])).toContain("dependency-cycle")
  })

  it("rejects undeclared bare imports", async () => {
    await writeFixture("registry/ui/demo.tsx", 'import "lodash/debounce"')
    expect(await codes([item("demo")])).toContain("undeclared-dependency")
  })

  it("rejects workspace imports", async () => {
    await writeFixture("registry/ui/demo.tsx", 'import { cn } from "@workspace/ui/lib/utils"')
    expect(await codes([item("demo")])).toContain("forbidden-import")
  })

  it("rejects repository escapes", async () => {
    await writeFixture("registry/ui/demo.tsx", "export {}")
    expect(await codes([item("demo", { files: [{ path: "../escape.ts", type: "registry:ui" }] })])).toContain("repository-escape")
  })

  it("rejects target collisions", async () => {
    await writeFixture("registry/ui/a.tsx", "export {}")
    await writeFixture("registry/ui/b.tsx", "export {}")
    expect(await codes([item("a"), item("b", { files: [{ path: "registry/ui/b.tsx", type: "registry:ui", target: "@ui/a.tsx" }] })])).toContain("target-collision")
  })
})

describe("assertGeneratedOutputMatchesCatalog", () => {
  it("rejects stale output", async () => {
    await writeFixture("public/r/registry.json", JSON.stringify({ items: [{ name: "stale" }] }))
    await expect(assertGeneratedOutputMatchesCatalog(fixtureRoot)).rejects.toThrow("stale")
  })
})

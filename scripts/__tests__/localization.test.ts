import { afterEach, beforeEach, expect, it } from "vitest"
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import type { RegistryItem } from "../registry-model"
import { validateCatalog } from "../registry-model"

let fixtureRoot: string

async function writeFixture(path: string, content: string): Promise<void> {
  const target = join(fixtureRoot, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "mapseek-localization-"))
})
afterEach(async () => rm(fixtureRoot, { recursive: true, force: true }))

it("rejects Han string literals outside labels and defaults", async () => {
  await writeFixture("registry/ui/demo.tsx", 'export const label = "地图"')
  const items: readonly RegistryItem[] = [{
    name: "demo",
    type: "registry:ui",
    files: [{ path: "registry/ui/demo.tsx", type: "registry:ui" }],
  }]
  expect((await validateCatalog(fixtureRoot, items)).some((issue) => issue.code === "unlocalized-string")).toBe(true)
})

it("allows Han string literals in labels and defaults", async () => {
  await writeFixture("registry/ui/labels.ts", 'export const label = "地图"')
  await writeFixture("registry/ui/defaults.ts", 'export const label = "地图"')
  const items: readonly RegistryItem[] = [{
    name: "demo",
    type: "registry:ui",
    files: [
      { path: "registry/ui/labels.ts", type: "registry:ui" },
      { path: "registry/ui/defaults.ts", type: "registry:ui" },
    ],
  }]
  expect(await validateCatalog(fixtureRoot, items)).toEqual([])
})

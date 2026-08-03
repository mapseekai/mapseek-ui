import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, beforeEach, expect, it } from "vitest"
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
  await writeFixture("registry/blocks/demo.tsx", 'export const label = "地图"')
  const items: readonly RegistryItem[] = [
    {
      name: "demo",
      type: "registry:block",
      files: [{ path: "registry/blocks/demo.tsx", type: "registry:block" }],
    },
  ]
  expect(
    (await validateCatalog(fixtureRoot, items)).some(
      (issue) => issue.code === "unlocalized-string",
    ),
  ).toBe(true)
})

it("rejects Han text in every template literal AST form", async () => {
  await writeFixture(
    "registry/blocks/demo.tsx",
    "const x = 1; const y = 2; export const labels = [`地图`, `首" +
      "$" +
      "{x}中" +
      "$" +
      "{y}尾`]",
  )
  const items: readonly RegistryItem[] = [
    {
      name: "demo",
      type: "registry:block",
      files: [{ path: "registry/blocks/demo.tsx", type: "registry:block" }],
    },
  ]
  expect(
    (await validateCatalog(fixtureRoot, items)).some(
      (issue) => issue.code === "unlocalized-string",
    ),
  ).toBe(true)
})

it("allows Han string literals in labels and defaults", async () => {
  await writeFixture("registry/blocks/labels.ts", 'export const label = "地图"')
  await writeFixture("registry/blocks/defaults.ts", 'export const label = "地图"')
  const items: readonly RegistryItem[] = [
    {
      name: "demo",
      type: "registry:block",
      files: [
        { path: "registry/blocks/labels.ts", type: "registry:block" },
        { path: "registry/blocks/defaults.ts", type: "registry:block" },
      ],
    },
  ]
  expect(await validateCatalog(fixtureRoot, items)).toEqual([])
})

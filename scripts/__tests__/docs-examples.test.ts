import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, beforeEach, expect, it } from "vitest"
import { validateExampleCoverage } from "../check-docs-examples"
import type { RegistryItem } from "../registry-model"

let fixtureRoot: string

const catalog: readonly RegistryItem[] = [
  {
    name: "button",
    type: "registry:ui",
    files: [],
  },
]

async function writeFixture(path: string, content: string): Promise<void> {
  const target = join(fixtureRoot, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

function doc(examples: readonly string[] = ["button/basic"], registryName = "button"): string {
  return [
    "---",
    "id: button",
    "slug: /components/button",
    `registryName: ${registryName}`,
    "category: primitive",
    "stability: stable",
    "examples:",
    ...examples.map((example) => `  - ${example}`),
    "---",
    "# Button",
  ].join("\n")
}

async function writeLocalizedDocs(source = doc()): Promise<void> {
  await writeFixture("docs/components/button.mdx", source)
  await writeFixture("i18n/en/docusaurus-plugin-content-docs/current/components/button.mdx", source)
}

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "mapseek-docs-examples-"))
})

afterEach(async () => rm(fixtureRoot, { recursive: true, force: true }))

it("accepts localized docs with an existing example and valid registry item", async () => {
  await writeLocalizedDocs()
  await writeFixture("src/examples/button/basic.tsx", "export function BasicButtonDemo() {}")

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toEqual([])
})

it("reports declared examples without source files", async () => {
  await writeLocalizedDocs()

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toContainEqual({
    code: "missing-example",
    item: "button",
    detail: "button/basic",
  })
})

it("reports pages without examples and unknown registry names", async () => {
  await writeLocalizedDocs(doc([], "missing"))

  const issues = await validateExampleCoverage(fixtureRoot, catalog)

  expect(issues).toContainEqual({
    code: "missing-examples",
    item: "button",
    detail: "examples",
  })
  expect(issues).toContainEqual({
    code: "unknown-registry-name",
    item: "button",
    detail: "missing",
  })
})

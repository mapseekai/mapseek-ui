import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, beforeEach, expect, it } from "vitest"
import { collectLocalizedDocs, validateDocParity } from "../check-docs-i18n"

let fixtureRoot: string

async function writeFixture(path: string, content: string): Promise<void> {
  const target = join(fixtureRoot, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

function doc(examples: readonly string[] = ["button/basic"]): string {
  return [
    "---",
    "id: button",
    "slug: /components/button",
    "registryName: button",
    "category: primitive",
    "stability: stable",
    "examples:",
    ...examples.map((example) => `  - ${example}`),
    "---",
    "# Button",
  ].join("\n")
}

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "mapseek-docs-i18n-"))
})

afterEach(async () => rm(fixtureRoot, { recursive: true, force: true }))

it("collects Chinese and English documentation from Docusaurus locale roots", async () => {
  await writeFixture("docs/components/button.mdx", doc())
  await writeFixture("i18n/en/docusaurus-plugin-content-docs/current/components/button.mdx", doc())

  const localized = await collectLocalizedDocs(fixtureRoot)

  expect(localized.zh.has("button")).toBe(true)
  expect(localized.en.has("button")).toBe(true)
})

it("reports mismatched structural examples between locales", async () => {
  await writeFixture("docs/components/button.mdx", doc(["button/basic"]))
  await writeFixture(
    "i18n/en/docusaurus-plugin-content-docs/current/components/button.mdx",
    doc(["button/variants"]),
  )

  const { zh, en } = await collectLocalizedDocs(fixtureRoot)

  expect(validateDocParity(zh, en)).toContainEqual({
    code: "metadata-mismatch",
    item: "button",
    detail: "examples",
  })
})

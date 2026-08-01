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

async function runCli(
  path: string,
): Promise<{ readonly exitCode: number; readonly stdout: string }> {
  const process = Bun.spawn(["bun", "scripts/check-docs-i18n.ts", path], {
    cwd: join(import.meta.dir, "../.."),
    stdout: "pipe",
    stderr: "pipe",
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ])
  expect(stderr).toBe("")
  return { exitCode, stdout }
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

it("keeps Task 8 guide and index pages paired across locales", async () => {
  const localized = await collectLocalizedDocs(join(import.meta.dir, "../../packages/docs"))
  const expectedIds = [
    "getting-started-installation",
    "getting-started-theming",
    "getting-started-registry",
    "components-index",
    "blocks-index",
  ] as const

  for (const id of expectedIds) {
    expect(localized.zh.get(id)?.metadata).toEqual(localized.en.get(id)?.metadata)
    expect(localized.zh.get(id)?.metadata.examples).toEqual([])
  }
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

it("prints one issue per line and exits non-zero from the CLI", async () => {
  await writeFixture("docs/components/button.mdx", doc(["button/basic"]))
  await writeFixture(
    "i18n/en/docusaurus-plugin-content-docs/current/components/button.mdx",
    doc(["button/variants"]),
  )

  const result = await runCli(fixtureRoot)

  expect(result.exitCode).toBe(1)
  expect(result.stdout.trim().split("\n")).toEqual([
    JSON.stringify({ code: "metadata-mismatch", item: "button", detail: "examples" }),
  ])
})

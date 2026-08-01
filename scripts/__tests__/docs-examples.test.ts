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
  {
    name: "theme",
    type: "registry:theme",
    files: [],
  },
]

async function writeFixture(path: string, content: string): Promise<void> {
  const target = join(fixtureRoot, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

async function runCli(
  repoRoot: string,
  docsRoot: string,
): Promise<{
  readonly exitCode: number
  readonly stdout: string
}> {
  const process = Bun.spawn(["bun", "scripts/check-docs-examples.ts", repoRoot, docsRoot], {
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

function guideDoc(id = "intro"): string {
  return [
    "---",
    `id: ${id}`,
    "slug: /",
    "registryName: theme",
    "category: primitive",
    "stability: stable",
    "examples: []",
    "---",
    "# Intro",
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

it("reports examples declared only by the English page without source files", async () => {
  await writeFixture("docs/components/button.mdx", doc(["button/basic"]))
  await writeFixture(
    "i18n/en/docusaurus-plugin-content-docs/current/components/button.mdx",
    doc(["button/missing-english"]),
  )
  await writeFixture("src/examples/button/basic.tsx", "export function BasicButtonDemo() {}")

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toContainEqual({
    code: "missing-example",
    item: "button",
    detail: "button/missing-english",
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

it("allows localized guide pages without component examples", async () => {
  await writeLocalizedDocs()
  await writeFixture("docs/intro.mdx", guideDoc())
  await writeFixture("i18n/en/docusaurus-plugin-content-docs/current/intro.mdx", guideDoc())
  await writeFixture("docs/getting-started/install.mdx", guideDoc("getting-started-install"))
  await writeFixture(
    "i18n/en/docusaurus-plugin-content-docs/current/getting-started/install.mdx",
    guideDoc("getting-started-install"),
  )
  await writeFixture("src/examples/button/basic.tsx", "export function BasicButtonDemo() {}")

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toEqual([])
})

it("prints one issue per line and exits non-zero from the CLI", async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), "mapseek-docs-examples-repo-"))
  try {
    await writeLocalizedDocs()
    await mkdir(join(repoRoot, "registry/ui"), { recursive: true })
    await writeFile(
      join(repoRoot, "registry.json"),
      JSON.stringify({ include: ["registry/ui/registry.json"] }),
    )
    await writeFile(
      join(repoRoot, "registry/ui/registry.json"),
      JSON.stringify({ items: [{ name: "button", type: "registry:ui", files: [] }] }),
    )

    const result = await runCli(repoRoot, fixtureRoot)

    expect(result.exitCode).toBe(1)
    expect(result.stdout.trim().split("\n")).toEqual([
      JSON.stringify({ code: "missing-example", item: "button", detail: "button/basic" }),
    ])
  } finally {
    await rm(repoRoot, { recursive: true, force: true })
  }
})

import { spawn } from "node:child_process"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, beforeEach, expect, it } from "vitest"
import { validateExampleCoverage } from "../check-docs-examples"
import { tsxCommand } from "../pnpm-command"
import type { RegistryItem } from "../registry-model"

let fixtureRoot: string

const catalog: readonly RegistryItem[] = [
  { name: "button", type: "registry:ui", files: [] },
  { name: "theme", type: "registry:theme", files: [] },
]

async function writeFixture(path: string, content: string): Promise<void> {
  const target = join(fixtureRoot, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

function doc(showcase = "button", registryName = "button"): string {
  return [
    "---",
    "title: Button",
    `registryName: ${registryName}`,
    "category: primitive",
    "stability: stable",
    `showcase: ${showcase}`,
    "---",
    "# Button",
  ].join("\n")
}

function guideDoc(): string {
  return [
    "---",
    "title: Intro",
    "registryName: theme",
    "category: primitive",
    "stability: stable",
    "showcase: none",
    "---",
    "# Intro",
  ].join("\n")
}

async function writeLocalizedDocs(source = doc()): Promise<void> {
  await writeFixture("content/docs/components/button.mdx", source)
  await writeFixture("content/docs/components/button.en.mdx", source)
}

async function writeShowcaseCatalog(names: readonly string[]): Promise<void> {
  const entries = names.map((name) => `  "${name}": ButtonShowcaseSource,`).join("\n")
  await writeFixture(
    "src/components/ShowcaseDemo/source-catalog.generated.ts",
    `export const showcaseSources = {\n${entries}\n}\n`,
  )
}

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "mapseek-docs-showcase-"))
})

afterEach(async () => rm(fixtureRoot, { recursive: true, force: true }))

it("accepts bilingual docs mapped to an existing Showcase", async () => {
  await writeLocalizedDocs()
  await writeShowcaseCatalog(["button"])

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toEqual([])
})

it("reports components missing from the Showcase source catalog", async () => {
  await writeLocalizedDocs()

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toContainEqual({
    code: "missing-showcase",
    item: "components/button.mdx",
    detail: "button",
  })
})

it("reports docs whose Showcase metadata does not match the registry name", async () => {
  await writeLocalizedDocs(doc("other"))
  await writeShowcaseCatalog(["button"])

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toContainEqual({
    code: "metadata-mismatch",
    item: "components/button.mdx",
    detail: "showcase",
  })
})

it("reports missing localized docs for published registry items", async () => {
  await writeFixture("content/docs/intro.mdx", guideDoc())
  await writeFixture("content/docs/intro.en.mdx", guideDoc())
  await writeShowcaseCatalog(["button"])

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toContainEqual({
    code: "registry-doc-count",
    item: "button",
    detail: "zh",
  })
})

it("allows guide pages to declare that they have no Showcase", async () => {
  await writeLocalizedDocs()
  await writeFixture("content/docs/intro.mdx", guideDoc())
  await writeFixture("content/docs/intro.en.mdx", guideDoc())
  await writeShowcaseCatalog(["button"])

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toEqual([])
})

it("reports unknown registry names independently of Showcase coverage", async () => {
  await writeLocalizedDocs(doc("missing", "missing"))
  await writeShowcaseCatalog(["button"])

  expect(await validateExampleCoverage(fixtureRoot, catalog)).toContainEqual({
    code: "unknown-registry-name",
    item: "components/button.mdx",
    detail: "missing",
  })
})

it("prints Showcase coverage failures and exits non-zero from the CLI", async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), "mapseek-docs-showcase-repo-"))
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

    const [executable, ...args] = tsxCommand(
      "scripts/check-docs-examples.ts",
      repoRoot,
      fixtureRoot,
    )
    const child = spawn(executable, args, {
      cwd: join(import.meta.dirname, "../.."),
      stdio: ["ignore", "pipe", "pipe"],
    })
    const output = await new Promise<{ stdout: string; stderr: string; exitCode: number }>(
      (resolve, reject) => {
        let stdout = ""
        let stderr = ""
        child.stdout.setEncoding("utf8").on("data", (chunk) => (stdout += chunk))
        child.stderr.setEncoding("utf8").on("data", (chunk) => (stderr += chunk))
        child.once("error", reject)
        child.once("exit", (exitCode) => resolve({ stdout, stderr, exitCode: exitCode ?? 1 }))
      },
    )

    expect(output.stderr).toBe("")
    expect(output.exitCode).toBe(1)
    expect(output.stdout.trim().split("\n")).toEqual([
      JSON.stringify({
        code: "missing-showcase",
        item: "components/button.mdx",
        detail: "button",
      }),
      JSON.stringify({
        code: "missing-showcase",
        item: "components/button.en.mdx",
        detail: "button",
      }),
    ])
  } finally {
    await rm(repoRoot, { recursive: true, force: true })
  }
})

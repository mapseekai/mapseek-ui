import { spawn } from "node:child_process"
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
  const child = spawn("tsx", ["scripts/check-docs-i18n.ts", path], {
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
  return { exitCode: output.exitCode, stdout: output.stdout }
}

function doc(showcase = "button"): string {
  return [
    "---",
    "title: Button",
    "registryName: button",
    "category: primitive",
    "stability: stable",
    `showcase: ${showcase}`,
    "---",
    "# Button",
  ].join("\n")
}

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "mapseek-docs-i18n-"))
})

afterEach(async () => rm(fixtureRoot, { recursive: true, force: true }))

it("collects Chinese docs and English .en.mdx pairs from content/docs", async () => {
  await writeFixture("content/docs/components/button.mdx", doc())
  await writeFixture("content/docs/components/button.en.mdx", doc())

  const localized = await collectLocalizedDocs(fixtureRoot)

  expect(localized.zh.has("components/button")).toBe(true)
  expect(localized.en.has("components/button")).toBe(true)
})

it("keeps guide and index pages paired across locales", async () => {
  const localized = await collectLocalizedDocs(join(import.meta.dirname, "../../packages/docs"))
  const expectedIds = [
    "getting-started/installation",
    "getting-started/theming",
    "getting-started/registry",
    "components/index",
    "blocks/index",
  ] as const

  for (const id of expectedIds) {
    const zhMeta = localized.zh.get(id)?.metadata
    const enMeta = localized.en.get(id)?.metadata
    expect({
      registryName: zhMeta?.registryName,
      category: zhMeta?.category,
      stability: zhMeta?.stability,
      showcase: zhMeta?.showcase,
    }).toEqual({
      registryName: enMeta?.registryName,
      category: enMeta?.category,
      stability: enMeta?.stability,
      showcase: enMeta?.showcase,
    })
    expect(zhMeta?.showcase).toBe("none")
  }
})

it("reports mismatched Showcase mappings between locales", async () => {
  await writeFixture("content/docs/components/button.mdx", doc("button"))
  await writeFixture("content/docs/components/button.en.mdx", doc("other"))

  const { zh, en } = await collectLocalizedDocs(fixtureRoot)

  expect(validateDocParity(zh, en)).toContainEqual({
    code: "metadata-mismatch",
    item: "components/button",
    detail: "showcase",
  })
})

it("prints one issue per line and exits non-zero from the CLI", async () => {
  await writeFixture("content/docs/components/button.mdx", doc("button"))
  await writeFixture("content/docs/components/button.en.mdx", doc("other"))

  const result = await runCli(fixtureRoot)

  expect(result.exitCode).toBe(1)
  expect(result.stdout.trim().split("\n")).toEqual([
    JSON.stringify({ code: "metadata-mismatch", item: "components/button", detail: "showcase" }),
  ])
})

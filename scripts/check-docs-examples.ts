import { access, readdir } from "node:fs/promises"
import { extname, join, relative } from "node:path"
import { collectLocalizedDocs } from "./check-docs-i18n"
import type { ParsedDoc } from "./docs-check-utils"
import { loadCatalog, type RegistryItem, type ValidationIssue } from "./registry-model"

function docsForRegistryName(
  docs: ReadonlyMap<string, ParsedDoc>,
  registryName: string,
): readonly ParsedDoc[] {
  return [...docs.values()].filter((doc) => doc.metadata.registryName === registryName)
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function collectExampleIds(root: string): Promise<readonly string[]> {
  type DirectoryEntry = {
    readonly name: string
    isDirectory(): boolean
    isFile(): boolean
  }

  async function walk(directory: string): Promise<readonly string[]> {
    let entries: readonly DirectoryEntry[]
    try {
      entries = await readdir(directory, { withFileTypes: true })
    } catch {
      return []
    }
    const ids = await Promise.all(
      entries.map(async (entry) => {
        const path = join(directory, entry.name)
        if (entry.isDirectory()) return walk(path)
        if (entry.isFile() && extname(entry.name) === ".tsx")
          return [relative(root, path).replace(/\.tsx$/u, "")]
        return []
      }),
    )
    return ids.flat()
  }
  return walk(root)
}

export async function validateExampleCoverage(
  root: string,
  catalog: readonly RegistryItem[],
): Promise<readonly ValidationIssue[]> {
  const issues: ValidationIssue[] = []
  const { zh, en } = await collectLocalizedDocs(root)
  const registryNames = new Set(catalog.map((item) => item.name))
  const exampleOwners = new Map<string, string[]>()

  for (const item of catalog) {
    const zhDocs = docsForRegistryName(zh, item.name)
    const enDocs = docsForRegistryName(en, item.name)
    if (zhDocs.length !== 1)
      issues.push({ code: "registry-doc-count", item: item.name, detail: "zh" })
    if (enDocs.length !== 1)
      issues.push({ code: "registry-doc-count", item: item.name, detail: "en" })
  }

  for (const doc of zh.values()) {
    const { id, registryName, examples } = doc.metadata
    if (!registryNames.has(registryName))
      issues.push({ code: "unknown-registry-name", item: id, detail: registryName })
    if (examples.length === 0)
      issues.push({ code: "missing-examples", item: id, detail: "examples" })
    for (const example of examples) {
      const owners = exampleOwners.get(example) ?? []
      owners.push(id)
      exampleOwners.set(example, owners)
      if (!(await fileExists(join(root, "src/examples", `${example}.tsx`))))
        issues.push({ code: "missing-example", item: id, detail: example })
    }
  }

  for (const [example, owners] of exampleOwners) {
    if (owners.length !== 1)
      issues.push({ code: "example-owner-count", item: example, detail: owners.join(",") })
  }
  for (const example of await collectExampleIds(join(root, "src/examples"))) {
    if (!exampleOwners.has(example))
      issues.push({ code: "example-owner-count", item: example, detail: "0" })
  }

  return issues
}

async function main(): Promise<void> {
  const repoRoot = process.argv[2] ?? process.cwd()
  const docsRoot = process.argv[3] ?? join(repoRoot, "packages/docs")
  const issues = await validateExampleCoverage(docsRoot, await loadCatalog(repoRoot))
  for (const issue of issues) console.log(JSON.stringify(issue))
  if (issues.length > 0) process.exitCode = 1
}

if (import.meta.main) await main()

import { access, readdir } from "node:fs/promises"
import { extname, join, relative } from "node:path"
import { collectLocalizedDocs } from "./check-docs-i18n"
import type { ParsedDoc } from "./docs-check-utils"
import { loadCatalog, type RegistryItem, type ValidationIssue } from "./registry-model"

type RequiredRegistryDoc = {
  readonly category: "primitive" | "block"
  readonly examples: readonly string[]
}

const requiredRegistryDocs: ReadonlyMap<string, RequiredRegistryDoc> = new Map([
  [
    "button",
    {
      category: "primitive",
      examples: ["button/basic", "button/variants", "button/sizes"],
    },
  ],
  [
    "dialog",
    {
      category: "primitive",
      examples: ["dialog/basic", "dialog/confirmation", "dialog/long-content"],
    },
  ],
  [
    "layer-panel",
    {
      category: "block",
      examples: ["layer-panel/basic", "layer-panel/groups"],
    },
  ],
] as const)

function docsForRegistryName(
  docs: ReadonlyMap<string, ParsedDoc>,
  registryName: string,
): readonly ParsedDoc[] {
  return [...docs.values()].filter(
    (doc) => !isGuideDoc(doc) && doc.metadata.registryName === registryName,
  )
}

function addIssue(issues: ValidationIssue[], seen: Set<string>, issue: ValidationIssue): void {
  const key = `${issue.code}\0${issue.item ?? ""}\0${issue.detail}`
  if (seen.has(key)) return
  seen.add(key)
  issues.push(issue)
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

function isGuideDoc(doc: ParsedDoc): boolean {
  return doc.metadata.id === "intro" || doc.metadata.id.startsWith("getting-started")
}

export async function validateExampleCoverage(
  root: string,
  catalog: readonly RegistryItem[],
): Promise<readonly ValidationIssue[]> {
  const issues: ValidationIssue[] = []
  const seenIssues = new Set<string>()
  const { zh, en } = await collectLocalizedDocs(root)
  const componentCatalog = catalog.filter((item) => item.type !== "registry:theme")
  const registryNames = new Set(catalog.map((item) => item.name))
  const exampleOwners = new Map<string, Set<string>>()

  for (const item of componentCatalog.filter((item) => requiredRegistryDocs.has(item.name))) {
    const zhDocs = docsForRegistryName(zh, item.name)
    const enDocs = docsForRegistryName(en, item.name)
    if (zhDocs.length !== 1)
      addIssue(issues, seenIssues, { code: "registry-doc-count", item: item.name, detail: "zh" })
    if (enDocs.length !== 1)
      addIssue(issues, seenIssues, { code: "registry-doc-count", item: item.name, detail: "en" })
    for (const doc of [...zhDocs, ...enDocs]) {
      const requiredDoc = requiredRegistryDocs.get(item.name)
      if (!requiredDoc) continue
      if (doc.metadata.category !== requiredDoc.category)
        addIssue(issues, seenIssues, {
          code: "metadata-mismatch",
          item: doc.metadata.id,
          detail: "category",
        })
      for (const example of requiredDoc.examples) {
        if (!doc.metadata.examples.includes(example))
          addIssue(issues, seenIssues, {
            code: "missing-required-example",
            item: doc.metadata.id,
            detail: example,
          })
      }
    }
  }

  for (const doc of [...zh.values(), ...en.values()]) {
    if (isGuideDoc(doc)) continue
    const { id, registryName, examples } = doc.metadata
    if (!registryNames.has(registryName))
      addIssue(issues, seenIssues, {
        code: "unknown-registry-name",
        item: id,
        detail: registryName,
      })
    if (examples.length === 0)
      addIssue(issues, seenIssues, { code: "missing-examples", item: id, detail: "examples" })
    for (const example of examples) {
      const owners = exampleOwners.get(example) ?? new Set<string>()
      owners.add(id)
      exampleOwners.set(example, owners)
      if (!(await fileExists(join(root, "src/examples", `${example}.tsx`))))
        addIssue(issues, seenIssues, { code: "missing-example", item: id, detail: example })
    }
  }

  for (const [example, owners] of exampleOwners) {
    if (owners.size !== 1)
      addIssue(issues, seenIssues, {
        code: "example-owner-count",
        item: example,
        detail: [...owners].sort().join(","),
      })
  }
  for (const example of await collectExampleIds(join(root, "src/examples"))) {
    if (!exampleOwners.has(example))
      addIssue(issues, seenIssues, { code: "example-owner-count", item: example, detail: "0" })
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

import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { collectLocalizedDocs } from "./check-docs-i18n"
import type { ParsedDoc } from "./docs-check-utils"
import { requiredRegistryDocs } from "./docs-required-registry-docs"
import { loadCatalog, type RegistryItem, type ValidationIssue } from "./registry-model"

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

function isGuideDoc(doc: ParsedDoc): boolean {
  return doc.metadata.registryName === "theme"
}

async function collectShowcaseNames(root: string): Promise<ReadonlySet<string>> {
  try {
    const source = await readFile(
      join(root, "src/components/ShowcaseDemo/source-catalog.generated.ts"),
      "utf8",
    )
    return new Set([...source.matchAll(/^ {2}"([^"]+)":/gmu)].map((match) => match[1]))
  } catch {
    return new Set()
  }
}

export async function validateExampleCoverage(
  root: string,
  catalog: readonly RegistryItem[],
): Promise<readonly ValidationIssue[]> {
  const issues: ValidationIssue[] = []
  const seenIssues = new Set<string>()
  const { zh, en } = await collectLocalizedDocs(root)
  const showcaseNames = await collectShowcaseNames(root)
  const componentCatalog = catalog.filter((item) => item.type !== "registry:theme")
  const registryNames = new Set(catalog.map((item) => item.name))

  for (const item of componentCatalog.filter((item) => requiredRegistryDocs.has(item.name))) {
    const zhDocs = docsForRegistryName(zh, item.name)
    const enDocs = docsForRegistryName(en, item.name)
    if (zhDocs.length !== 1)
      addIssue(issues, seenIssues, { code: "registry-doc-count", item: item.name, detail: "zh" })
    if (enDocs.length !== 1)
      addIssue(issues, seenIssues, { code: "registry-doc-count", item: item.name, detail: "en" })
    for (const doc of [...zhDocs, ...enDocs]) {
      const requiredDoc = requiredRegistryDocs.get(item.name)
      if (requiredDoc && doc.metadata.category !== requiredDoc.category)
        addIssue(issues, seenIssues, {
          code: "metadata-mismatch",
          item: doc.relativePath,
          detail: "category",
        })
    }
  }

  for (const doc of [...zh.values(), ...en.values()]) {
    if (isGuideDoc(doc)) continue
    const { registryName, showcase } = doc.metadata
    if (!registryNames.has(registryName))
      addIssue(issues, seenIssues, {
        code: "unknown-registry-name",
        item: doc.relativePath,
        detail: registryName,
      })
    if (showcase !== registryName)
      addIssue(issues, seenIssues, {
        code: "metadata-mismatch",
        item: doc.relativePath,
        detail: "showcase",
      })
    if (!showcaseNames.has(registryName))
      addIssue(issues, seenIssues, {
        code: "missing-showcase",
        item: doc.relativePath,
        detail: registryName,
      })
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

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main()

import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { collectDocs, type ParsedDoc } from "./docs-check-utils"
import type { ValidationIssue } from "./registry-model"

export type LocalizedDocs = {
  readonly zh: ReadonlyMap<string, ParsedDoc>
  readonly en: ReadonlyMap<string, ParsedDoc>
}

const parityFields = ["registryName", "category", "stability", "showcase"] as const

function sameValue(left: unknown, right: unknown): boolean {
  if (Array.isArray(left) && Array.isArray(right))
    return left.length === right.length && left.every((value, index) => value === right[index])
  return left === right
}

export async function collectLocalizedDocs(root: string): Promise<LocalizedDocs> {
  const contentRoot = join(root, "content/docs")
  return {
    zh: await collectDocs(contentRoot, "zh"),
    en: await collectDocs(contentRoot, "en"),
  }
}

export function validateDocParity(
  zh: ReadonlyMap<string, ParsedDoc>,
  en: ReadonlyMap<string, ParsedDoc>,
): readonly ValidationIssue[] {
  const issues: ValidationIssue[] = []
  for (const [id, zhDoc] of zh) {
    const enDoc = en.get(id)
    if (!enDoc) {
      issues.push({ code: "missing-locale", item: id, detail: "en" })
      continue
    }
    for (const field of parityFields) {
      if (!sameValue(zhDoc.metadata[field], enDoc.metadata[field]))
        issues.push({ code: "metadata-mismatch", item: id, detail: field })
    }
  }
  for (const id of en.keys()) {
    if (!zh.has(id)) issues.push({ code: "missing-locale", item: id, detail: "zh" })
  }
  return issues
}

async function main(): Promise<void> {
  const root = process.argv[2] ?? join(process.cwd(), "packages/docs")
  const { zh, en } = await collectLocalizedDocs(root)
  const issues = validateDocParity(zh, en)
  for (const issue of issues) console.log(JSON.stringify(issue))
  if (issues.length > 0) process.exitCode = 1
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main()

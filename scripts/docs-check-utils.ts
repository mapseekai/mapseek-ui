import { readdir, readFile } from "node:fs/promises"
import { extname, join, relative } from "node:path"

export type DocMetadata = {
  readonly title: string
  readonly registryName: string
  readonly category: "primitive" | "block"
  readonly stability: "stable" | "experimental" | "deprecated"
  readonly showcase: string
}

export type ParsedDoc = {
  readonly path: string
  readonly relativePath: string
  readonly metadata: DocMetadata
}

type MutableDocMetadata = {
  title?: string
  registryName?: string
  category?: "primitive" | "block"
  stability?: "stable" | "experimental" | "deprecated"
  showcase?: string
}

const categories = new Set(["primitive", "block"])
const stabilities = new Set(["stable", "experimental", "deprecated"])
const requiredFields = ["title", "registryName", "category", "stability", "showcase"] as const

function assignScalar(metadata: MutableDocMetadata, key: string, value: string): void {
  if (key === "title") metadata.title = value.replace(/^"|"$/g, "")
  else if (key === "registryName") metadata.registryName = value
  else if (key === "showcase") metadata.showcase = value
  else if (key === "category") {
    if (!categories.has(value)) throw new Error(`unknown category: ${value}`)
    metadata.category = value as MutableDocMetadata["category"]
  } else if (key === "stability") {
    if (!stabilities.has(value)) throw new Error(`unknown stability: ${value}`)
    metadata.stability = value as MutableDocMetadata["stability"]
  }
}

export function parseDocSource(source: string): DocMetadata {
  const lines = source.split(/\r?\n/u)
  if (lines[0] !== "---") throw new Error("missing frontmatter delimiters")
  const end = lines.indexOf("---", 1)
  if (end === -1) throw new Error("missing frontmatter delimiters")
  const metadata: MutableDocMetadata = {}
  const seen = new Set<string>()

  for (let index = 1; index < end; index++) {
    const line = lines[index]
    if (line.trim() === "") continue
    const separator = line.indexOf(":")
    if (separator === -1) throw new Error(`invalid frontmatter line: ${line}`)
    const key = line.slice(0, separator)
    const value = line.slice(separator + 1).trim()
    if (seen.has(key)) throw new Error(`duplicate field: ${key}`)
    seen.add(key)
    assignScalar(metadata, key, value)
  }

  for (const field of requiredFields) {
    if (!seen.has(field)) throw new Error(`missing field: ${field}`)
  }

  return {
    title: metadata.title ?? "",
    registryName: metadata.registryName ?? "",
    category: metadata.category ?? "primitive",
    stability: metadata.stability ?? "stable",
    showcase: metadata.showcase ?? "",
  }
}

export async function parseDocFile(path: string): Promise<ParsedDoc> {
  return {
    path,
    relativePath: path,
    metadata: parseDocSource(await readFile(path, "utf8")),
  }
}

async function collectDocPaths(root: string): Promise<readonly string[]> {
  const entries = await readdir(root, { withFileTypes: true })
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const path = join(root, entry.name)
      if (entry.isDirectory()) return collectDocPaths(path)
      if (entry.isFile() && [".md", ".mdx"].includes(extname(entry.name))) return [path]
      return []
    }),
  )
  return paths.flat()
}

const englishSuffix = /\.en\.(md|mdx)$/u

function toPortablePath(path: string): string {
  return path.replaceAll("\\", "/")
}

/** Collect docs keyed by locale-independent relative path (without extension). */
export async function collectDocs(
  root: string,
  locale: "zh" | "en" = "zh",
): Promise<ReadonlyMap<string, ParsedDoc>> {
  const docs = new Map<string, ParsedDoc>()
  for (const path of await collectDocPaths(root)) {
    const isEnglish = englishSuffix.test(path)
    if (locale === "en" ? !isEnglish : isEnglish) continue
    const rel = toPortablePath(relative(root, path))
    const key = rel.replace(englishSuffix, "").replace(/\.(md|mdx)$/u, "")
    docs.set(key, {
      path,
      relativePath: rel,
      metadata: parseDocSource(await readFile(path, "utf8")),
    })
  }
  return docs
}

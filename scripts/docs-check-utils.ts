import { readdir, readFile } from "node:fs/promises"
import { extname, join, relative } from "node:path"

export type DocMetadata = {
  readonly id: string
  readonly slug: string
  readonly registryName: string
  readonly category: "primitive" | "block"
  readonly stability: "stable" | "experimental" | "deprecated"
  readonly examples: readonly string[]
}

export type ParsedDoc = {
  readonly path: string
  readonly relativePath: string
  readonly metadata: DocMetadata
}

type MutableDocMetadata = {
  id?: string
  slug?: string
  registryName?: string
  category?: "primitive" | "block"
  stability?: "stable" | "experimental" | "deprecated"
  examples?: string[]
}

const categories = new Set(["primitive", "block"])
const stabilities = new Set(["stable", "experimental", "deprecated"])
const requiredFields = ["id", "slug", "registryName", "category", "stability", "examples"] as const

function assignScalar(metadata: MutableDocMetadata, key: string, value: string): void {
  if (key === "id") metadata.id = value
  else if (key === "slug") metadata.slug = value
  else if (key === "registryName") metadata.registryName = value
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
    if (line === "examples:") {
      if (seen.has("examples")) throw new Error("duplicate field: examples")
      seen.add("examples")
      const examples: string[] = []
      while (lines[index + 1]?.startsWith("  - ")) {
        index++
        examples.push(lines[index].slice("  - ".length))
      }
      metadata.examples = examples
      continue
    }
    const separator = line.indexOf(":")
    if (separator === -1) throw new Error(`invalid frontmatter line: ${line}`)
    const key = line.slice(0, separator)
    const value = line.slice(separator + 1).trim()
    if (key === "examples") {
      if (value === "[]") {
        if (seen.has(key)) throw new Error(`duplicate field: ${key}`)
        seen.add(key)
        metadata.examples = []
        continue
      }
      throw new Error("examples must be a list")
    }
    if (seen.has(key)) throw new Error(`duplicate field: ${key}`)
    seen.add(key)
    assignScalar(metadata, key, value)
  }

  for (const field of requiredFields) {
    if (!seen.has(field)) throw new Error(`missing field: ${field}`)
  }
  const slug = metadata.slug ?? ""
  if (!slug.startsWith("/")) throw new Error("slug must be absolute")
  const examples = metadata.examples ?? []

  return {
    id: metadata.id ?? "",
    slug,
    registryName: metadata.registryName ?? "",
    category: metadata.category ?? "primitive",
    stability: metadata.stability ?? "stable",
    examples,
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

export async function collectDocs(root: string): Promise<ReadonlyMap<string, ParsedDoc>> {
  const docs = new Map<string, ParsedDoc>()
  for (const path of await collectDocPaths(root)) {
    const parsed = {
      path,
      relativePath: relative(root, path),
      metadata: parseDocSource(await readFile(path, "utf8")),
    }
    docs.set(parsed.metadata.id, parsed)
  }
  return docs
}

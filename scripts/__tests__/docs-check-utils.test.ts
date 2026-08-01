import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { collectDocs, parseDocSource } from "../docs-check-utils"
import { requiredRegistryDocs } from "../docs-required-registry-docs"

let fixtureRoot: string

async function writeFixture(path: string, content: string): Promise<void> {
  const target = join(fixtureRoot, path)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

function doc(overrides: readonly string[] = []): string {
  return [
    "---",
    "id: button",
    "slug: /components/button",
    "registryName: button",
    "category: primitive",
    "stability: stable",
    "examples:",
    "  - button/basic",
    ...overrides,
    "---",
    "# Button",
  ].join("\n")
}

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "mapseek-docs-"))
})

afterEach(async () => rm(fixtureRoot, { recursive: true, force: true }))

it("parses scalar and list documentation metadata", () => {
  const source = doc(["  - button/variants"])

  expect(parseDocSource(source)).toEqual({
    id: "button",
    slug: "/components/button",
    registryName: "button",
    category: "primitive",
    stability: "stable",
    examples: ["button/basic", "button/variants"],
  })
})

describe("parseDocSource", () => {
  it("rejects missing frontmatter delimiters", () => {
    expect(() => parseDocSource("# Button")).toThrow("frontmatter delimiters")
  })

  it("rejects duplicate metadata fields", () => {
    expect(() => parseDocSource(doc(["id: duplicate"]))).toThrow("duplicate field: id")
  })

  it("rejects non-absolute slugs", () => {
    expect(() => parseDocSource(doc().replace("/components/button", "components/button"))).toThrow(
      "slug must be absolute",
    )
  })

  it("rejects examples written as a scalar", () => {
    expect(() =>
      parseDocSource(doc().replace("examples:\n  - button/basic", "examples: basic")),
    ).toThrow("examples must be a list")
  })

  it("rejects unknown category and stability values", () => {
    expect(() => parseDocSource(doc().replace("category: primitive", "category: guide"))).toThrow(
      "unknown category: guide",
    )
    expect(() => parseDocSource(doc().replace("stability: stable", "stability: preview"))).toThrow(
      "unknown stability: preview",
    )
  })
})

it("collects markdown docs by metadata id", async () => {
  await writeFixture("components/button.mdx", doc())
  await writeFixture("components/button.txt", doc(["id: ignored"]))

  const docs = await collectDocs(fixtureRoot)

  expect(docs.get("button")).toMatchObject({
    relativePath: "components/button.mdx",
    metadata: { id: "button" },
  })
  expect(docs.has("ignored")).toBe(false)
})

it("keeps Task9A primitive coverage in the shared required docs manifest", () => {
  expect([...requiredRegistryDocs.keys()]).toEqual(
    expect.arrayContaining([
      "accordion",
      "avatar",
      "badge",
      "card",
      "chart",
      "collapsible",
      "empty",
      "json-viewer",
      "progress",
      "separator",
      "skeleton",
      "table",
    ]),
  )
  expect(requiredRegistryDocs.get("accordion")?.examples).toEqual(["accordion/overview"])
  expect(requiredRegistryDocs.get("table")?.examples).toEqual(["table/overview"])
})

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
    "title: Button",
    "registryName: button",
    "category: primitive",
    "stability: stable",
    "showcase: button",
    ...overrides,
    "---",
    "# Button",
  ].join("\n")
}

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "mapseek-docs-"))
})

afterEach(async () => rm(fixtureRoot, { recursive: true, force: true }))

it("parses documentation metadata with its Showcase mapping", () => {
  expect(parseDocSource(doc())).toEqual({
    title: "Button",
    registryName: "button",
    category: "primitive",
    stability: "stable",
    showcase: "button",
  })
})

describe("parseDocSource", () => {
  it("rejects missing frontmatter delimiters", () => {
    expect(() => parseDocSource("# Button")).toThrow("frontmatter delimiters")
  })

  it("rejects duplicate metadata fields", () => {
    expect(() => parseDocSource(doc(["title: Duplicate"]))).toThrow("duplicate field: title")
  })

  it("requires a title", () => {
    expect(() => parseDocSource(doc().replace("title: Button\n", ""))).toThrow(
      "missing field: title",
    )
  })

  it("requires Showcase metadata", () => {
    expect(() => parseDocSource(doc().replace("showcase: button\n", ""))).toThrow(
      "missing field: showcase",
    )
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

it("collects markdown docs by locale-independent relative path", async () => {
  await writeFixture("components/button.mdx", doc())
  await writeFixture(
    "components/button.en.mdx",
    doc().replace("title: Button", "title: Button (en)"),
  )
  await writeFixture("components/button.txt", doc().replace("title: Button", "title: Ignored"))

  const zhDocs = await collectDocs(fixtureRoot)
  const enDocs = await collectDocs(fixtureRoot, "en")

  expect(zhDocs.get("components/button")).toMatchObject({
    relativePath: "components/button.mdx",
    metadata: { title: "Button" },
  })
  expect(enDocs.get("components/button")).toMatchObject({
    relativePath: "components/button.en.mdx",
    metadata: { title: "Button (en)" },
  })
  expect(zhDocs.has("components/ignored")).toBe(false)
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
  expect(requiredRegistryDocs.get("accordion")?.category).toBe("primitive")
  expect(requiredRegistryDocs.get("table")?.category).toBe("primitive")
})

it("keeps Task9B form and input primitive coverage in the shared required docs manifest", () => {
  expect([...requiredRegistryDocs.keys()]).toEqual(
    expect.arrayContaining([
      "checkbox",
      "combobox",
      "command",
      "field",
      "icon-button",
      "input",
      "input-group",
      "label",
      "select",
      "slider",
      "switch",
      "textarea",
      "toggle",
      "toggle-group",
    ]),
  )
  expect(requiredRegistryDocs.get("checkbox")?.category).toBe("primitive")
  expect(requiredRegistryDocs.get("toggle-group")?.category).toBe("primitive")
})

it("keeps Task9C navigation feedback and overlay primitive coverage in the shared required docs manifest", () => {
  expect([...requiredRegistryDocs.keys()]).toEqual(
    expect.arrayContaining([
      "confirm-dialog",
      "context-menu",
      "dropdown-menu",
      "pagination",
      "popover",
      "sheet",
      "sonner",
      "tabs",
      "tooltip",
    ]),
  )
  expect(requiredRegistryDocs.get("confirm-dialog")?.category).toBe("primitive")
  expect(requiredRegistryDocs.get("tooltip")?.category).toBe("primitive")
})

it("keeps Task10D style block coverage in the shared required docs manifest", () => {
  expect([...requiredRegistryDocs.keys()]).toEqual(
    expect.arrayContaining([
      "raster-style-panel",
      "style-color-input",
      "style-editor-modal",
      "style-editor-panel",
      "style-filter-editor",
      "style-function-editor",
      "style-panel",
      "style-source-picker-dialog",
      "toggle-config-popover",
    ]),
  )
  expect(requiredRegistryDocs.get("raster-style-panel")?.category).toBe("block")
  expect(requiredRegistryDocs.get("toggle-config-popover")?.category).toBe("block")
})

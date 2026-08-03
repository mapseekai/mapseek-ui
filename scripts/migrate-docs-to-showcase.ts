import { readdir, readFile, rm, writeFile } from "node:fs/promises"
import { join, relative } from "node:path"

const root = process.cwd()
const showcaseRoot = join(root, "showcase/src/showcases")
const examplesRoot = join(root, "packages/docs/src/examples")
const sourceCatalogPath = join(root, "packages/docs/src/components/ShowcaseDemo/source-catalog.ts")
const requiredDocsPath = join(root, "scripts/docs-required-registry-docs.ts")
const docsRoots = [
  join(root, "packages/docs/docs"),
  join(root, "packages/docs/i18n/en/docusaurus-plugin-content-docs/current"),
]

async function filesUnder(directory: string, extension: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory()
        ? filesUnder(path, extension)
        : Promise.resolve(entry.name.endsWith(extension) ? [path] : [])
    }),
  )
  return nested.flat()
}

function showcaseNameByRegistryName(catalogSource: string): ReadonlyMap<string, string> {
  const matches = catalogSource.matchAll(
    /(?:block|primitive)\(\s*"([^"]+)"[\s\S]*?import\("\.\/([^"]+Showcase)"\)/gu,
  )
  return new Map([...matches].map((match) => [match[1], match[2]]))
}

function migrateMdx(source: string, registryName: string): string {
  const showcase = registryName === "theme" ? "none" : registryName
  const withShowcaseMetadata = source
    .replace(/^examples:\n(?: {2}- .*\n)*/mu, `showcase: ${showcase}\n`)
    .replace(/^examples: \[\]$/mu, `showcase: ${showcase}`)
  if (registryName === "theme") return withShowcaseMetadata

  const withoutExampleImports = withShowcaseMetadata
    .replace(/^import .* from "@site\/src\/examples\/.*"\n/gmu, "")
    .replace(
      'import { ComponentDemo } from "@site/src/components/ComponentDemo"',
      'import { ShowcaseDemo } from "@site/src/components/ShowcaseDemo"',
    )

  let replaced = withoutExampleImports.includes(`registryName="${registryName}"`)
  const migrated = withoutExampleImports.replace(
    /<ComponentDemo([^>]*)>[\s\S]*?<\/ComponentDemo>/gu,
    (_block, attributes: string) => {
      if (replaced) return ""
      replaced = true
      const migratedAttributes = attributes.replace(/\s+source=\{[^}]+\}/u, "")
      return `<ShowcaseDemo registryName="${registryName}"${migratedAttributes} />`
    },
  )
  return migrated.replace(/^## [^\n]+\n(?:[ \t]*\n)+(?=## )/gmu, "")
}

const catalogSource = [
  await readFile(join(showcaseRoot, "primitive-catalog.ts"), "utf8"),
  await readFile(join(showcaseRoot, "block-catalog.ts"), "utf8"),
].join("\n")
const showcaseNames = showcaseNameByRegistryName(catalogSource)

const requiredDocsSource = await readFile(requiredDocsPath, "utf8")
await writeFile(requiredDocsPath, requiredDocsSource.replace(/^\s+examples: \[[^\n]*\],\n/gmu, ""))

const orderedShowcases = [...showcaseNames].sort(([left], [right]) => left.localeCompare(right))
const sourceImports = orderedShowcases
  .map(
    ([, showcaseName]) =>
      `import ${showcaseName}Source from "../../../../../showcase/src/showcases/${showcaseName}.tsx?raw"\n`,
  )
  .join("")
const sourceEntries = orderedShowcases
  .map(([registryName, showcaseName]) => `  "${registryName}": ${showcaseName}Source,\n`)
  .join("")
await writeFile(
  sourceCatalogPath,
  `${sourceImports}\nexport const showcaseSources: Readonly<Record<string, string>> = {\n${sourceEntries}}\n`,
)

for (const docsRoot of docsRoots) {
  for (const path of await filesUnder(docsRoot, ".mdx")) {
    const source = await readFile(path, "utf8")
    const registryName = source.match(/^registryName:\s*(\S+)$/mu)?.[1]
    if (!registryName) continue
    if (registryName !== "theme" && !showcaseNames.has(registryName)) {
      throw new Error(`No Showcase implementation for ${registryName} (${relative(root, path)})`)
    }
    const migrated = migrateMdx(source, registryName)
    if (registryName !== "theme" && !migrated.includes(`registryName="${registryName}"`)) {
      throw new Error(`No ComponentDemo found in ${relative(root, path)}`)
    }
    await writeFile(path, migrated)
  }
}

await rm(examplesRoot, { recursive: true, force: true })

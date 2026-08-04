import { access, readdir, readFile, readlink } from "node:fs/promises"
import { join } from "node:path"
import { expect, it } from "vitest"
import { requiredRegistryDocs } from "../docs-required-registry-docs"

function expectOrderedCommand(command: string, steps: string[]): void {
  let cursor = -1

  for (const step of steps) {
    const index = command.indexOf(step, cursor + 1)
    expect(index).toBeGreaterThan(cursor)
    cursor = index
  }
}

async function readBuiltCss(): Promise<string> {
  const chunksDir = "packages/docs/out/_next/static/chunks"
  const files = (await readdir(chunksDir)).filter((file) => file.endsWith(".css"))
  const contents = await Promise.all(files.map((file) => readFile(join(chunksDir, file), "utf8")))

  return contents.join("\n")
}

async function readBuiltJs(): Promise<string> {
  const chunksDir = "packages/docs/out/_next/static/chunks"
  const files = (await readdir(chunksDir)).filter((file) => file.endsWith(".js"))
  const contents = await Promise.all(files.map((file) => readFile(join(chunksDir, file), "utf8")))

  return contents.join("\n")
}

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

it("declares the Fumadocs docs workspace contract", async () => {
  const root = JSON.parse(await readFile("package.json", "utf8"))
  const docs = JSON.parse(await readFile("packages/docs/package.json", "utf8"))

  expectOrderedCommand(root.scripts["docs:build"], [
    "registry:build",
    "docs:theme",
    "docs:sources",
    "@mapseek/docs build",
  ])
  expectOrderedCommand(root.scripts["docs:dev"], [
    "registry:build",
    "docs:theme",
    "docs:sources",
    "@mapseek/docs dev",
  ])
  expect(root.scripts["docs:theme"]).toBe("tsx scripts/generate-docs-theme.ts")
  expect(root.scripts["docs:sources"]).toBe("tsx scripts/generate-showcase-sources.ts")
  expect(docs.dependencies).toMatchObject({
    "fumadocs-core": expect.any(String),
    "fumadocs-ui": expect.any(String),
    next: expect.any(String),
  })
})

it("typechecks docs against real registry source aliases", async () => {
  const docsTsconfig = JSON.parse(await readFile("packages/docs/tsconfig.json", "utf8"))

  expect(docsTsconfig.compilerOptions.paths).toMatchObject({
    "@registry/*": ["../../registry/*"],
  })
})

it("scans the real registry and showcase sources for Tailwind utilities", async () => {
  const globals = await readFile("packages/docs/app/globals.css", "utf8")

  expect(globals).toContain('@source "../../../registry/**/*.{ts,tsx}";')
  expect(globals).toContain('@source "../../../showcase/src/showcases/**/*.{ts,tsx}";')
  expect(globals).not.toContain('@source "../../../../registry/')
  expect(globals).not.toContain('@source "../../../../showcase/')
})

it("publishes installable registry artifacts and compiled theme utilities", async () => {
  await expect(access("public/r/button.json")).resolves.toBeUndefined()
  await expect(access("packages/docs/public/r/button.json")).resolves.toBeUndefined()
  await expect(access("packages/docs/out/r/button.json")).resolves.toBeUndefined()

  const css = await readBuiltCss()

  expect(css).toContain("--primary:")
})

it("serves the generated registry from the docs public directory", async () => {
  await expect(readlink("packages/docs/public/r")).resolves.toBe("../../../public/r")
})

it("renders manifest-derived component and block indexes in the static build", async () => {
  const components = await readFile("packages/docs/out/components/index.html", "utf8")
  const blocks = await readFile("packages/docs/out/blocks/index.html", "utf8")
  const enComponents = await readFile("packages/docs/out/en/components/index.html", "utf8")
  const enBlocks = await readFile("packages/docs/out/en/blocks/index.html", "utf8")

  expect(components).toContain("搜索组件")
  expect(components).toContain("Button")
  expect(components).toContain("/components/button")
  expect(blocks).toContain("搜索区块")
  expect(blocks).toContain("Layer Panel")
  expect(blocks).toContain("/blocks/layer-panel")
  expect(enComponents).toContain("Search components")
  expect(enComponents).toContain("/en/components/button")
  expect(enBlocks).toContain("Search blocks")
  expect(enBlocks).toContain("/en/blocks/layer-panel")
})

it("includes every public docs route in sidebar navigation", async () => {
  const componentPage = await readFile("packages/docs/out/components/button/index.html", "utf8")
  const blockPage = await readFile("packages/docs/out/blocks/layer-panel/index.html", "utf8")

  for (const [name, doc] of requiredRegistryDocs) {
    const route = doc.category === "primitive" ? `/components/${name}/` : `/blocks/${name}/`
    const page = doc.category === "primitive" ? componentPage : blockPage
    expect(page).toContain(`href="${route}"`)
  }
})

it("keeps component and block summary pages first in localized sidebar metadata", async () => {
  for (const file of [
    "packages/docs/content/docs/components/meta.json",
    "packages/docs/content/docs/components/meta.en.json",
    "packages/docs/content/docs/blocks/meta.json",
    "packages/docs/content/docs/blocks/meta.en.json",
  ]) {
    const meta = JSON.parse(await readFile(file, "utf8"))
    expect(meta.pages[0]).toBe("index")
  }
})

it("keeps index routing derived from docs metadata instead of MDX whitelists", async () => {
  const files = [
    "packages/docs/content/docs/components/index.mdx",
    "packages/docs/content/docs/blocks/index.mdx",
    "packages/docs/content/docs/components/index.en.mdx",
    "packages/docs/content/docs/blocks/index.en.mdx",
    "packages/docs/src/components/ComponentIndex/ComponentIndex.tsx",
  ]
  const sources = await Promise.all(files.map((file) => readFile(file, "utf8")))

  for (const source of sources) {
    expect(source).not.toContain("documentedNames")
  }
})

it("maps the docs shell to the generated Mapseek UI tokens", async () => {
  const globalsCss = await readFile("packages/docs/app/globals.css", "utf8")
  const generatedTheme = await readFile("packages/docs/app/theme.generated.css", "utf8")
  const componentDemoSource = await readFile(
    "packages/docs/src/components/ComponentDemo/ComponentDemo.tsx",
    "utf8",
  )
  const registryInstallSource = await readFile(
    "packages/docs/src/components/RegistryItem/RegistryInstall.tsx",
    "utf8",
  )
  const componentCss = await Promise.all(
    [
      "packages/docs/src/components/ComponentDemo/styles.module.css",
      "packages/docs/src/components/ComponentIndex/styles.module.css",
      "packages/docs/src/components/RegistryItem/styles.module.css",
    ].map((path) => readFile(path, "utf8")),
  )

  expect(globalsCss).toContain('@import "./theme.generated.css"')
  expect(globalsCss).toContain("@custom-variant dark")
  expect(globalsCss).toContain("[data-showcase-root] :where(ol, ul, menu)")
  expect(globalsCss).toContain("[data-showcase-root] table")
  expect(globalsCss).toMatch(
    /\[data-showcase-root\]\s+\[data-slot="table-container"\]\s*>\s*\[data-slot="table"\]\s*\{[^}]*border:\s*0;/su,
  )
  expect(globalsCss).toContain("[data-showcase-root] pre")
  expect(globalsCss).toMatch(
    /article figure\.shiki\s*\{[^}]*border-width:\s*1px;[^}]*box-shadow:\s*none;/su,
  )
  expect(globalsCss).toMatch(
    /article figure\.shiki button\[data-checked\]\s*\{[^}]*color:\s*var\(--primary\);/su,
  )
  expect(globalsCss).toMatch(
    /article > div\[class~="@container"\] > a:is\(:hover, :focus-visible\)\s*\{[^}]*border-color:\s*var\(--primary\);/su,
  )
  expect(globalsCss).not.toMatch(/#[\da-f]{3,8}\b/iu)
  expect(generatedTheme).toContain("--primary:")
  expect(generatedTheme).toContain('[data-theme="dark"]')
  for (const source of componentCss) expect(source).not.toMatch(/border-radius:\s*[1-9]/u)
  expect(componentCss.join("\n")).toMatch(/\.demo\s*\{[^}]*margin-inline:\s*0;/su)
  expect(componentCss.join("\n")).toMatch(
    /\.demo\s*\{[^}]*border:\s*1px solid var\(--border\);[^}]*box-shadow:\s*none;/su,
  )
  expect(componentCss.join("\n")).toMatch(/\.preview\s*\{[^}]*justify-items:\s*center;/su)
  expect(componentCss.join("\n")).toMatch(
    /\.preview\s*>\s*div\s*\{[^}]*display:\s*flex;[^}]*justify-content:\s*center;/su,
  )
  expect(componentCss.join("\n")).toMatch(
    /\.preview\s*>\s*div\s*>\s*div\s*\{[^}]*display:\s*flex;[^}]*justify-content:\s*center;/su,
  )
  expect(componentCss.join("\n")).toMatch(
    /\.preview\s*>\s*div\s*>\s*div\s*>\s*\[class\*="max-w-"\][^{]*\{[^}]*width:\s*100%;[^}]*flex-shrink:\s*0;/su,
  )
  expect(componentCss.join("\n")).toMatch(
    /\.card\s*\{[^}]*border:\s*1px solid var\(--border\);[^}]*border-radius:\s*0;/su,
  )
  expect(componentCss.join("\n")).toMatch(
    /\.card:hover,\s*\.card:focus-visible\s*\{[^}]*border-color:\s*var\(--primary\);/su,
  )
  expect(componentCss.join("\n")).toMatch(
    /\.searchInput\s*\{[^}]*height:\s*2rem;[^}]*padding:\s*0 0\.75rem;/su,
  )
  expect(componentCss.join("\n")).toMatch(
    /\.card:hover,\s*\.card:focus-visible\s*\{[^}]*background-color:\s*color-mix\(in oklab, var\(--accent\) 80%, transparent\);[^}]*color:\s*var\(--accent-foreground\);/su,
  )
  expect(componentCss.join("\n")).toMatch(
    /\.actions\s*\{[^}]*flex:\s*none;[^}]*flex-wrap:\s*nowrap;/su,
  )
  expect(componentDemoSource).toContain('from "fumadocs-ui/components/dynamic-codeblock"')
  expect(componentDemoSource).toContain('import { CopyButton } from "@registry/ui/copy-button"')
  expect(componentDemoSource).toContain('lang="tsx"')
  expect(componentDemoSource).toContain("copiedLabel={labels.copyDone}")
  expect(componentDemoSource).toContain('textSize="default"')
  expect(componentDemoSource).toContain('size="default"')
  expect(componentDemoSource).toContain('variant="outline"')
  expect(registryInstallSource).toContain('import { CopyButton } from "@registry/ui/copy-button"')
  expect(registryInstallSource).toContain("className={styles.copyButton}")
  expect(componentCss.join("\n")).toMatch(
    /\.copyButton\s*\{[^}]*width:\s*1\.5rem;[^}]*height:\s*1\.5rem;[^}]*flex:\s*none;/su,
  )
  expect(componentCss.join("\n")).toMatch(
    /\.copyButton svg\s*\{[^}]*width:\s*1rem;[^}]*height:\s*1rem;/su,
  )
  expect(registryInstallSource).toContain("<CopyButton")
  expect(registryInstallSource).not.toContain("@tabler/icons-react")
  expect(componentCss.join("\n")).toMatch(/\.commandRow code\s*\{[^}]*border:\s*0;/su)
})

it("omits obsolete registry JSON related-link sections", async () => {
  const docs = (
    await Promise.all(
      ["packages/docs/content/docs/components", "packages/docs/content/docs/blocks"].map(
        (directory) => filesUnder(directory, ".mdx"),
      ),
    )
  ).flat()
  const sources = await Promise.all(docs.map((file) => readFile(file, "utf8")))

  for (const source of sources) {
    expect(source).not.toMatch(/^## (?:Related Links|相关链接)$/mu)
    expect(source).not.toMatch(/\[[^\]]+ registry JSON\]\(\/r\/[^)]+\.json\)/u)
  }
})

it("uses direct demo descriptions and readable showcase section headings", async () => {
  const docs = await filesUnder("packages/docs/content/docs", ".mdx")
  const showcaseFiles = await filesUnder("showcase/src/showcases", ".tsx")
  const docSources = await Promise.all(docs.map((file) => readFile(file, "utf8")))
  const showcaseSources = await Promise.all(showcaseFiles.map((file) => readFile(file, "utf8")))

  for (const source of docSources) {
    for (const match of source.matchAll(/<ShowcaseDemo[^>]*description="([^"]*)"/gu)) {
      expect(match[1]).not.toMatch(/保留原示例|reference example|\bpreserv(?:e|es|ed|ing)\b/iu)
    }
  }

  const combinedShowcases = showcaseSources.join("\n")
  expect(combinedShowcases).not.toContain(
    '<h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">',
  )
  expect(combinedShowcases).toContain(
    '<h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">',
  )

  const dialogShowcase = await readFile("showcase/src/showcases/DialogShowcase.tsx", "utf8")
  expect(dialogShowcase).toContain('<div className="flex flex-col items-start gap-3">')

  const avatarShowcase = await readFile("showcase/src/showcases/AvatarShowcase.tsx", "utf8")
  expect(avatarShowcase).toContain('<div className="w-full space-y-8">')

  const emptyShowcase = await readFile("showcase/src/showcases/EmptyShowcase.tsx", "utf8")
  expect(emptyShowcase).toContain('<div className="grid w-full max-w-xl gap-5">')
  expect(emptyShowcase).not.toContain("md:grid-cols-3")

  const fieldShowcase = await readFile("showcase/src/showcases/FieldShowcase.tsx", "utf8")
  expect(fieldShowcase).toContain('<div className="grid w-full max-w-sm gap-8">')

  const inputGroupShowcase = await readFile("showcase/src/showcases/InputGroupShowcase.tsx", "utf8")
  expect(inputGroupShowcase).toContain('<div className="grid w-full max-w-sm gap-8">')

  const labelShowcase = await readFile("showcase/src/showcases/LabelShowcase.tsx", "utf8")
  expect(labelShowcase).toContain('<div className="grid w-full max-w-sm gap-8">')

  const selectShowcase = await readFile("showcase/src/showcases/SelectShowcase.tsx", "utf8")
  expect(selectShowcase).toContain('<div className="grid w-full max-w-xs gap-8">')

  const accordionShowcase = await readFile("showcase/src/showcases/AccordionShowcase.tsx", "utf8")
  expect(accordionShowcase).toContain('<div className="grid w-full max-w-lg gap-8">')

  const skeletonShowcase = await readFile("showcase/src/showcases/SkeletonShowcase.tsx", "utf8")
  expect(skeletonShowcase).toContain('<div className="grid w-full max-w-sm gap-8">')
  expect(skeletonShowcase).not.toContain("md:grid-cols-2")
})

it("lets JsonViewer content use the available preview width", async () => {
  const source = await readFile("registry/ui/json-viewer.tsx", "utf8")

  expect(source).toContain('<code className="min-w-0 flex-1 rounded-none">')
})

it("uses the theme primary color for active Tabs states", async () => {
  const source = await readFile("registry/ui/tabs.tsx", "utf8")

  expect(source).toContain("data-active:text-primary")
  expect(source).toContain("after:bg-primary")
  expect(source).not.toContain("data-active:text-foreground")
  expect(source).not.toContain("after:bg-foreground")
})

it("keeps displayed example source as exact TSX source", async () => {
  const js = await readBuiltJs()

  expect(js).toContain('import { Button } from "@registry/ui/button"')
  expect(js).toContain("export function ButtonBasicDemo")
  expect(js).not.toContain('import{Button}from"@registry/ui/button"')
  expect(js).not.toContain('from"react/jsx-runtime"')
})

it("renders documentation examples from the original Showcase source", async () => {
  const docs = await filesUnder("packages/docs/content/docs", ".mdx")
  const componentDocs = await Promise.all(docs.map((file) => readFile(file, "utf8")))

  await expect(access("packages/docs/src/examples")).rejects.toThrow()

  for (const source of componentDocs.filter((source) => source.includes("registryName:"))) {
    if (source.includes("registryName: theme")) continue
    expect(source).toContain("<ShowcaseDemo")
    expect(source).toMatch(/^showcase: \S+$/mu)
    expect(source).not.toContain('from "@site/src/examples/')
    expect(source).not.toContain("<ComponentDemo")
  }
})

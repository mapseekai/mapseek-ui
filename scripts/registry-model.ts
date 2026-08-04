import { access, readFile, realpath } from "node:fs/promises"
import { dirname, isAbsolute, join, relative, resolve } from "node:path"
import ts from "typescript"

export type RegistryItem = {
  readonly name: string
  readonly type: string
  readonly files: ReadonlyArray<{
    readonly path: string
    readonly type: string
    readonly target?: string
  }>
  readonly registryDependencies?: readonly string[]
  readonly dependencies?: readonly string[]
}
export type ValidationIssue = {
  readonly code: string
  readonly item?: string
  readonly detail: string
}

export const BASE_COMPONENTS = [
  "accordion",
  "avatar",
  "badge",
  "button",
  "card",
  "chart",
  "checkbox",
  "color-input",
  "collapsible",
  "combobox",
  "command",
  "confirm-dialog",
  "context-menu",
  "dialog",
  "dropdown-menu",
  "empty",
  "field",
  "icon-button",
  "input",
  "input-group",
  "json-viewer",
  "label",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "sonner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
] as const
export const BLOCKS = [
  "add-field-form",
  "app-top-bar",
  "attr-inspector",
  "attr-table",
  "band-stat",
  "crs-picker",
  "custom-colormap",
  "filter-panel",
  "form-inputs",
  "geojson-view",
  "json-editor",
  "layer-editor-group",
  "layer-panel",
  "layer-style-editor",
  "layout",
  "linked-ref-list",
  "loading-screen",
  "loom-layer-panel",
  "loom-toolbox",
  "loom-toolbar",
  "map-controls",
  "map-coordinate-status",
  "map-switcher",
  "notification-center",
  "number-range-input",
  "pixel-probe",
  "placeholder-glyph",
  "processing-timeline",
  "product-logo",
  "raster-style-panel",
  "resource-detail-drawer",
  "resource-grid",
  "resource-sidebar",
  "resource-status",
  "schema-form",
  "service-endpoint-row",
  "service-status",
  "split-tool-picker",
  "stat-strip",
  "storage-meter",
  "style-color-input",
  "style-editor-modal",
  "style-editor-panel",
  "style-filter-editor",
  "style-function-editor",
  "style-panel",
  "style-source-picker-dialog",
  "toggle-config-popover",
] as const

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"))
}

function toPortablePath(path: string): string {
  return path.replaceAll("\\", "/")
}

async function loadManifest(repoRoot: string, manifestPath: string): Promise<RegistryItem[]> {
  const manifest = (await readJson(join(repoRoot, manifestPath))) as {
    include?: string[]
    items?: RegistryItem[]
  }
  const included = await Promise.all(
    (manifest.include ?? []).map((include) => loadManifest(repoRoot, include)),
  )
  const directory = dirname(manifestPath)
  const items = (manifest.items ?? []).map((item) => ({
    ...item,
    files: item.files.map((file) => ({
      ...file,
      path: isAbsolute(file.path) ? file.path : toPortablePath(join(directory, file.path)),
    })),
  }))
  return [...items, ...included.flat()]
}

export async function loadCatalog(repoRoot: string): Promise<readonly RegistryItem[]> {
  return loadManifest(repoRoot, "registry.json")
}

function packageRoot(specifier: string): string {
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/")
  return specifier.split("/")[0]
}

function imports(source: string, fileName: string): readonly string[] {
  const program = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true)
  const found: string[] = []
  const visit = (node: ts.Node): void => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      found.push(node.moduleSpecifier.text)
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    )
      found.push(node.arguments[0].text)
    ts.forEachChild(node, visit)
  }
  visit(program)
  return found
}

function hasHanString(source: string, fileName: string): boolean {
  const program = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true)
  let found = false
  const visit = (node: ts.Node): void => {
    if (ts.isStringLiteral(node) || ts.isTemplateLiteralToken(node)) {
      if (/[\u3400-\u9fff]/u.test(node.text)) found = true
    }
    ts.forEachChild(node, visit)
  }
  visit(program)
  return found
}

function insideRoot(repoRoot: string, path: string): boolean {
  const remainder = relative(resolve(repoRoot), resolve(path))
  return remainder !== "" && !remainder.startsWith("..") && !isAbsolute(remainder)
}

export async function validateCatalog(
  repoRoot: string,
  items: readonly RegistryItem[],
): Promise<readonly ValidationIssue[]> {
  const issues: ValidationIssue[] = []
  const byName = new Map<string, RegistryItem>()
  const targets = new Map<string, string>()
  const realRepoRoot = await realpath(repoRoot)
  for (const item of items) {
    if (byName.has(item.name))
      issues.push({ code: "duplicate-name", item: item.name, detail: item.name })
    else byName.set(item.name, item)
  }
  for (const item of items) {
    for (const file of item.files) {
      const sourcePath = resolve(repoRoot, file.path)
      if (!insideRoot(repoRoot, sourcePath)) {
        issues.push({ code: "repository-escape", item: item.name, detail: file.path })
        continue
      }
      if (file.target) {
        const owner = targets.get(file.target)
        if (owner) issues.push({ code: "target-collision", item: item.name, detail: file.target })
        else targets.set(file.target, item.name)
      }
      try {
        await access(sourcePath)
      } catch {
        issues.push({ code: "missing-file", item: item.name, detail: file.path })
        continue
      }
      const resolvedSourcePath = await realpath(sourcePath)
      if (!insideRoot(realRepoRoot, resolvedSourcePath)) {
        issues.push({ code: "repository-escape", item: item.name, detail: file.path })
        continue
      }
      const source = await readFile(resolvedSourcePath, "utf8")
      if (
        file.path.startsWith("registry/blocks/") &&
        !/(?:^|\/)(?:labels|defaults)\.ts$/.test(file.path) &&
        hasHanString(source, resolvedSourcePath)
      )
        issues.push({ code: "unlocalized-string", item: item.name, detail: file.path })
      for (const specifier of imports(source, resolvedSourcePath)) {
        if (specifier.startsWith("@workspace/ui")) {
          issues.push({ code: "forbidden-import", item: item.name, detail: specifier })
          continue
        }
        if (
          specifier.startsWith(".") ||
          specifier.startsWith("@/") ||
          specifier.startsWith("node:")
        )
          continue
        const dependency = packageRoot(specifier)
        if (dependency.startsWith("@mapseek/")) {
          if (!(item.registryDependencies ?? []).includes(dependency))
            issues.push({
              code: "missing-registry-dependency",
              item: item.name,
              detail: dependency,
            })
        } else if (dependency !== "react" && !(item.dependencies ?? []).includes(dependency))
          issues.push({ code: "undeclared-dependency", item: item.name, detail: dependency })
      }
    }
    for (const dependency of item.registryDependencies ?? []) {
      if (!byName.has(dependency.slice("@mapseek/".length)))
        issues.push({ code: "missing-registry-dependency", item: item.name, detail: dependency })
    }
  }
  const states = new Map<string, "unvisited" | "visiting" | "visited">()
  const visit = (name: string, stack: readonly string[]): void => {
    const state = states.get(name) ?? "unvisited"
    if (state === "visiting") {
      issues.push({ code: "dependency-cycle", item: name, detail: [...stack, name].join(" -> ") })
      return
    }
    if (state === "visited") return
    states.set(name, "visiting")
    for (const dependency of byName.get(name)?.registryDependencies ?? [])
      visit(dependency.slice("@mapseek/".length), [...stack, name])
    states.set(name, "visited")
  }
  for (const name of byName.keys()) visit(name, [])
  return issues
}

export async function assertValidCatalog(repoRoot: string): Promise<readonly RegistryItem[]> {
  const items = await loadCatalog(repoRoot)
  const issues = await validateCatalog(repoRoot, items)
  if (issues.length > 0)
    throw new Error(
      issues
        .map((issue) => `${issue.code}: ${issue.item ?? "catalog"}: ${issue.detail}`)
        .join("\n"),
    )
  return items
}

export async function assertGeneratedOutputMatchesCatalog(repoRoot: string): Promise<void> {
  const output = (await readJson(join(repoRoot, "public/r/registry.json"))) as
    | { items?: Array<{ name?: string }> }
    | Array<{ name?: string }>
  const generatedItems = Array.isArray(output) ? output : (output.items ?? [])
  const generated = new Set(
    generatedItems
      .map((item) => item.name)
      .filter((name): name is string => typeof name === "string"),
  )
  const catalog = new Set((await loadCatalog(repoRoot)).map((item) => item.name))
  const stale = [...generated].filter((name) => !catalog.has(name))
  const missing = [...catalog].filter((name) => !generated.has(name))
  if (stale.length || missing.length)
    throw new Error(`stale generated output: ${[...stale, ...missing].join(", ")}`)
}

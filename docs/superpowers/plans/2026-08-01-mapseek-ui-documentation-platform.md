# Mapseek UI Documentation Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Replace the custom Vite Showcase with a bilingual static Docusaurus site that embeds every registry example and serves the shadcn registry from the same build.

**Architecture:** Add a private packages/docs Docusaurus workspace with Chinese as the default locale and English under /en. Import registry source directly for interactive MDX examples, validate bilingual page and example parity against registry manifests, and copy public/r into the static output. Keep the existing Showcase until all pages, behaviors, installation checks, and visual checks pass.

**Tech Stack:** Bun workspaces, Docusaurus 3.10.2, React 19, MDX, Tailwind CSS 4 via PostCSS, Vitest, Playwright, Biome, shadcn registry.

## Global Constraints

- Treat docs/superpowers/specs/2026-08-01-mapseek-ui-documentation-platform-design.md as authoritative.
- Preserve all pre-existing uncommitted work. Inspect overlapping files before editing and stage only task-owned hunks.
- Work in the current worktree unless the uncommitted Showcase and registry migration are first made available in an isolated worktree.
- Chinese is the default locale with no path prefix; English uses /en.
- Documentation and public/r must be emitted by one static build.
- Do not change registry component behavior to make examples work.
- Do not remove showcase/ until full bilingual, behavioral, build, install, and visual parity passes.
- Do not add hosted search in this migration.
- Every commit must follow the repository Lore commit protocol.
- Run dependent tasks sequentially. Tasks 9 and 10 may be split into non-overlapping component batches during execution.

## Planned File Structure

~~~text
packages/docs/
├── docs/
│   ├── intro.mdx
│   ├── getting-started/
│   ├── components/
│   └── blocks/
├── i18n/en/docusaurus-plugin-content-docs/current/
├── src/
│   ├── components/
│   │   ├── ComponentDemo/
│   │   ├── ComponentIndex/
│   │   └── RegistryItem/
│   ├── examples/
│   ├── css/
│   ├── theme/Root.tsx
│   └── types/raw.d.ts
├── static/
├── docusaurus.config.ts
├── sidebars.ts
├── postcss.config.mjs
├── package.json
└── tsconfig.json

scripts/
├── docs-check-utils.ts
├── check-docs-i18n.ts
├── check-docs-examples.ts
└── docs-visual-qa.ts

scripts/__tests__/
├── docs-check-utils.test.ts
├── docs-i18n.test.ts
├── docs-examples.test.ts
└── docs-build.test.ts
~~~

The responsibilities are:

- packages/docs/docs and packages/docs/i18n: localized prose and structural frontmatter.
- packages/docs/src/examples: executable example source shared by both locales.
- ComponentDemo: preview, source, reset, error isolation, and demo chrome.
- RegistryItem: installation and dependency presentation derived from registry manifests.
- docs-check-utils: focused frontmatter and file collection utilities.
- check-docs-i18n: Chinese/English parity.
- check-docs-examples: registry/page/example bijection.
- docs-visual-qa: browser interaction and responsive visual evidence.

---

### Task 1: Add frontmatter and documentation validation primitives

**Files:**
- Create: scripts/docs-check-utils.ts
- Create: scripts/check-docs-i18n.ts
- Create: scripts/check-docs-examples.ts
- Create: scripts/__tests__/docs-check-utils.test.ts
- Create: scripts/__tests__/docs-i18n.test.ts
- Create: scripts/__tests__/docs-examples.test.ts

**Interfaces:**
- Consumes: loadCatalog(repoRoot) from scripts/registry-model.ts.
- Produces: parseDocFile(path), collectLocalizedDocs(root), validateDocParity(zh, en), and validateExampleCoverage(root, catalog).

- [ ] **Step 1: Write the failing frontmatter parser test**

~~~ts
import { expect, it } from "vitest"
import { parseDocSource } from "../docs-check-utils"

it("parses scalar and list documentation metadata", () => {
  const source = [
    "---",
    "id: button",
    "slug: /components/button",
    "registryName: button",
    "category: primitive",
    "stability: stable",
    "examples:",
    "  - button/basic",
    "  - button/variants",
    "---",
    "# Button",
  ].join("\n")

  expect(parseDocSource(source)).toEqual({
    id: "button",
    slug: "/components/button",
    registryName: "button",
    category: "primitive",
    stability: "stable",
    examples: ["button/basic", "button/variants"],
  })
})
~~~

- [ ] **Step 2: Run the focused test and verify the missing module failure**

Run:

~~~bash
bun test scripts/__tests__/docs-check-utils.test.ts
~~~

Expected: FAIL because scripts/docs-check-utils.ts does not exist.

- [ ] **Step 3: Implement the minimal parser and document collector**

Define:

~~~ts
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

export function parseDocSource(source: string): DocMetadata
export async function collectDocs(root: string): Promise<ReadonlyMap<string, ParsedDoc>>
~~~

The parser must reject missing delimiters, unknown category or stability values, duplicate fields,
non-absolute slugs, and non-list examples. It must not introduce a YAML dependency.

- [ ] **Step 4: Add failing parity and coverage fixture tests**

Use mkdtemp fixtures containing one Chinese page, one English page, one example file, and a minimal
registry manifest. Assert these exact codes:

~~~ts
expect(issues).toContainEqual({
  code: "metadata-mismatch",
  item: "button",
  detail: "examples",
})

expect(issues).toContainEqual({
  code: "missing-example",
  item: "button",
  detail: "button/basic",
})
~~~

- [ ] **Step 5: Implement validators and CLI entry points**

The i18n validator compares id, slug, registryName, category, stability, and examples. The example
validator enforces one Chinese page, one English page, at least one example, existing example files,
one owning registry page per example, and a valid registryName.

Both CLI files print one issue per line and exit non-zero when issues exist.

- [ ] **Step 6: Run validator tests**

Run:

~~~bash
bun test scripts/__tests__/docs-check-utils.test.ts scripts/__tests__/docs-i18n.test.ts scripts/__tests__/docs-examples.test.ts
~~~

Expected: all tests pass.

- [ ] **Step 7: Commit the validation foundation**

Stage only the six new files and commit with:

~~~text
Make documentation drift fail before publication

Constraint: Bilingual pages and examples must remain aligned with registry manifests
Confidence: high
Scope-risk: narrow
Tested: Documentation parser, locale parity, and example coverage unit tests
~~~

---

### Task 2: Scaffold the bilingual Docusaurus workspace

**Files:**
- Modify: package.json
- Modify: bun.lock
- Create: packages/docs/package.json
- Create: packages/docs/tsconfig.json
- Create: packages/docs/docusaurus.config.ts
- Create: packages/docs/sidebars.ts
- Create: packages/docs/docs/intro.mdx
- Create: packages/docs/i18n/en/docusaurus-plugin-content-docs/current/intro.mdx
- Create: packages/docs/src/css/custom.css
- Create: packages/docs/static/img/mapseek.svg
- Create: scripts/__tests__/docs-build.test.ts

**Interfaces:**
- Consumes: validation CLI files from Task 1.
- Produces: docs:dev, docs:dev:en, docs:build, docs:serve, docs:check-i18n, docs:check-examples, and docs:verify root scripts.

- [ ] **Step 1: Add a failing workspace contract test**

The test reads root and docs package JSON and asserts:

~~~ts
expect(root.workspaces).toEqual(["packages/*"])
expect(root.scripts["docs:build"]).toContain("registry:build")
expect(docs.dependencies).toMatchObject({
  "@docusaurus/core": "3.10.2",
  "@docusaurus/preset-classic": "3.10.2",
  "@docusaurus/types": "3.10.2",
})
~~~

- [ ] **Step 2: Verify the test fails**

Run:

~~~bash
bun test scripts/__tests__/docs-build.test.ts
~~~

Expected: FAIL because the workspace and docs package are absent.

- [ ] **Step 3: Add the workspace and docs package**

Add root workspaces and these scripts without replacing existing scripts:

~~~json
{
  "workspaces": ["packages/*"],
  "scripts": {
    "docs:dev": "bun run registry:build && bun --cwd packages/docs run start",
    "docs:dev:en": "bun run registry:build && bun --cwd packages/docs run start -- --locale en",
    "docs:build": "bun run registry:build && bun --cwd packages/docs run build",
    "docs:serve": "bun --cwd packages/docs run serve",
    "docs:check-i18n": "bun scripts/check-docs-i18n.ts",
    "docs:check-examples": "bun scripts/check-docs-examples.ts"
  }
}
~~~

Use exact Docusaurus version 3.10.2 in packages/docs/package.json. Keep the docs package private.

- [ ] **Step 4: Configure routes, locales, and strict links**

The Docusaurus config must set:

~~~ts
i18n: {
  defaultLocale: "zh-CN",
  locales: ["zh-CN", "en"],
  localeConfigs: {
    "zh-CN": { label: "简体中文" },
    en: { label: "English" },
  },
},
onBrokenLinks: "throw",
markdown: { hooks: { onBrokenMarkdownLinks: "throw" } },
~~~

Disable the blog, set routeBasePath to "/", and add the locale dropdown.

- [ ] **Step 5: Add matching introduction pages and sidebars**

The Chinese and English intro pages must explain that components are installed as source with shadcn,
not consumed as a runtime package. Their frontmatter uses registryName: theme, category: primitive,
and examples: [] only for this non-component guide. Update validators to exclude getting-started and
intro pages from the component bijection while still checking locale parity.

- [ ] **Step 6: Install dependencies and run the first static build**

Run:

~~~bash
bun install
bun test scripts/__tests__/docs-build.test.ts
bun --cwd packages/docs run build
~~~

Expected: workspace test passes and Docusaurus emits packages/docs/build.

- [ ] **Step 7: Commit the static bilingual shell**

Use interactive staging for package.json if it contains pre-existing edits. Commit with:

~~~text
Give Mapseek UI a static bilingual documentation shell

Constraint: Chinese is the unprefixed default locale and English uses /en
Confidence: high
Scope-risk: moderate
Tested: Workspace contract test and Docusaurus production build
~~~

---

### Task 3: Integrate registry output, Tailwind, and theme state

**Files:**
- Modify: packages/docs/package.json
- Modify: packages/docs/docusaurus.config.ts
- Create: packages/docs/postcss.config.mjs
- Modify: packages/docs/src/css/custom.css
- Create: packages/docs/src/theme/Root.tsx
- Create: packages/docs/src/types/raw.d.ts
- Modify: scripts/generate-showcase-theme.ts
- Modify: package.json
- Modify: scripts/__tests__/docs-build.test.ts

**Interfaces:**
- Consumes: registry:build output under public/r and registry/theme/registry.json.
- Produces: @registry alias, ?raw imports, root public static composition, Tailwind output, and theme synchronization.

- [ ] **Step 1: Extend the build test with failing static-output assertions**

After docs:build, assert:

~~~ts
await expect(access("packages/docs/build/r/button.json")).resolves.toBeUndefined()
const css = await readBuiltCss("packages/docs/build/assets")
expect(css).toContain("--primary:")
expect(css).toContain(".bg-primary")
~~~

- [ ] **Step 2: Run the test and verify missing registry/theme output**

Run:

~~~bash
bun test scripts/__tests__/docs-build.test.ts
~~~

Expected: FAIL because /r and Tailwind theme output are not composed.

- [ ] **Step 3: Configure PostCSS and Docusaurus plugins**

Add @tailwindcss/postcss and postcss. Configure:

~~~ts
staticDirectories: ["static", "../../public"]
~~~

Add one local Docusaurus plugin that:

~~~ts
configurePostCss(options) {
  options.plugins.push(tailwindcss())
  return options
}

configureWebpack() {
  return {
    resolve: {
      alias: {
        "@registry": path.resolve(__dirname, "../../registry"),
      },
    },
    module: {
      rules: [{ resourceQuery: /raw/, type: "asset/source" }],
    },
  }
}
~~~

- [ ] **Step 4: Generate theme CSS for both migration surfaces**

Refactor scripts/generate-showcase-theme.ts so the same serialized theme is written to:

~~~text
showcase/src/theme.generated.css
packages/docs/src/css/theme.generated.css
~~~

Keep both outputs until Task 12 removes Showcase. Add docs:theme and make docs:dev/docs:build run it before
Docusaurus.

- [ ] **Step 5: Add Tailwind sources and Docusaurus theme bridge**

custom.css must import Tailwind, shadcn CSS, fonts, and theme.generated.css, then scan:

~~~css
@source "../../../../registry/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";
@source "../../docs/**/*.{md,mdx}";
@source "../../i18n/**/*.{md,mdx}";
~~~

Root.tsx observes html[data-theme] and mirrors dark state to html.dark without replacing Docusaurus
attributes or classes. It renders ConfirmProvider and one Toaster around the site.

- [ ] **Step 6: Run static integration checks**

Run:

~~~bash
bun run docs:build
bun test scripts/__tests__/docs-build.test.ts
~~~

Expected: docs build succeeds, /r/button.json exists, and built CSS includes Mapseek tokens/utilities.

- [ ] **Step 7: Commit registry and theme composition**

~~~text
Publish documentation and installable registry as one artifact

Constraint: Registry JSON and both locales must share a static deployment
Rejected: Separate registry deployment | would permit docs and install output to drift
Confidence: high
Scope-risk: moderate
Tested: Docusaurus build, registry artifact assertion, and compiled theme assertion
~~~

---

### Task 4: Build the reusable embedded example surface

**Files:**
- Create: packages/docs/src/components/ComponentDemo/ComponentDemo.tsx
- Create: packages/docs/src/components/ComponentDemo/DemoErrorBoundary.tsx
- Create: packages/docs/src/components/ComponentDemo/index.ts
- Create: packages/docs/src/components/ComponentDemo/styles.module.css
- Create: packages/docs/src/components/RegistryItem/RegistryInstall.tsx
- Create: packages/docs/src/components/RegistryItem/RegistryDependencies.tsx
- Create: packages/docs/src/components/RegistryItem/registry-data.ts
- Create: packages/docs/src/components/RegistryItem/index.ts
- Create: packages/docs/src/examples/smoke/basic.tsx
- Create: packages/docs/docs/components/_smoke.mdx
- Create: packages/docs/i18n/en/docusaurus-plugin-content-docs/current/components/_smoke.mdx
- Create: scripts/docs-visual-qa.ts

**Interfaces:**
- Produces ComponentDemoProps:

~~~ts
export type ComponentDemoProps = {
  readonly title: string
  readonly description?: string
  readonly source: string
  readonly children: React.ReactNode
  readonly minHeight?: number
}
~~~

- Produces RegistryInstallProps and RegistryDependenciesProps with registryName: string.

- [ ] **Step 1: Add a failing Playwright smoke scenario**

docs-visual-qa.ts starts from an already running docs preview and verifies:

~~~ts
await page.goto("/components/_smoke")
await expect(page.getByRole("button", { name: "Show source" })).toBeVisible()
await page.getByRole("button", { name: "Show source" }).click()
await expect(page.getByText("export function SmokeDemo")).toBeVisible()
await page.getByRole("button", { name: "Reset example" }).click()
~~~

- [ ] **Step 2: Verify the scenario fails because the page is absent**

Run docs preview and then:

~~~bash
bun scripts/docs-visual-qa.ts --base-url http://127.0.0.1:3000 --case smoke
~~~

- [ ] **Step 3: Implement ComponentDemo and error isolation**

Use Docusaurus BrowserOnly for the preview. Key the preview subtree by a revision counter for reset.
Use an Error Boundary with a localized fallback slot. Source view uses pre/code and navigator.clipboard.
Do not use eval or execute displayed source.

- [ ] **Step 4: Implement registry-derived installation and dependency blocks**

registry-data.ts imports UI and block manifests and exposes:

~~~ts
export type RegistryDocItem = {
  readonly name: string
  readonly type: string
  readonly title: string
  readonly description: string
  readonly dependencies: readonly string[]
  readonly registryDependencies: readonly string[]
}

export function getRegistryDocItem(name: string): RegistryDocItem
~~~

RegistryInstall renders bunx shadcn@4.8.0 add @mapseek/name. RegistryDependencies renders registry and
npm dependencies separately.

- [ ] **Step 5: Add bilingual smoke MDX using a ?raw import**

Both pages import the same SmokeDemo and source. Localize only prose and labels.

- [ ] **Step 6: Run build and browser smoke checks**

~~~bash
bun run docs:build
bun run docs:serve
bun scripts/docs-visual-qa.ts --base-url http://127.0.0.1:3000 --case smoke
~~~

Expected: preview, source, copy, reset, and theme switching work.

- [ ] **Step 7: Remove smoke-only pages and example after the harness passes**

Delete _smoke MDX files and src/examples/smoke. Retain the reusable components and QA harness.

- [ ] **Step 8: Commit the embedded example system**

~~~text
Keep component guidance and executable examples on one page

Constraint: Preview and displayed source must come from the same TSX file
Confidence: high
Scope-risk: moderate
Tested: Static build and Playwright preview/source/reset/theme smoke scenario
~~~

---

### Task 5: Migrate the Button pilot

**Files:**
- Create: packages/docs/src/examples/button/basic.tsx
- Create: packages/docs/src/examples/button/variants.tsx
- Create: packages/docs/src/examples/button/sizes.tsx
- Create: packages/docs/docs/components/button.mdx
- Create: packages/docs/i18n/en/docusaurus-plugin-content-docs/current/components/button.mdx
- Test: scripts/__tests__/docs-i18n.test.ts
- Test: scripts/__tests__/docs-examples.test.ts

**Interfaces:**
- Consumes ComponentDemo, RegistryInstall, RegistryDependencies, and @registry/ui/button.
- Produces example ids button/basic, button/variants, and button/sizes.

- [ ] **Step 1: Add Button to parity fixture expectations and verify failure**

The coverage test must expect primitive:button with all three example ids. Run the two docs tests and
confirm missing-page failures.

- [ ] **Step 2: Extract focused examples from ButtonShowcase**

Each file exports one named React component and imports Button directly from @registry/ui/button.
Preserve every existing Button variant and size without Showcase navigation chrome.

- [ ] **Step 3: Write complete Chinese and English Button pages**

Use identical frontmatter and include installation, import, three demos, exports, Base UI prop
inheritance, disabled behavior, icon-button distinction, accessibility, dependencies, and related
links.

- [ ] **Step 4: Run content, build, and interaction checks**

~~~bash
bun run docs:check-i18n
bun run docs:check-examples
bun run docs:build
bun scripts/docs-visual-qa.ts --base-url http://127.0.0.1:3000 --case button
~~~

- [ ] **Step 5: Commit the primitive pilot**

~~~text
Prove the documentation model with a foundational primitive

Confidence: high
Scope-risk: narrow
Tested: Button bilingual parity, example coverage, docs build, and browser interactions
~~~

---

### Task 6: Migrate the Dialog portal pilot

**Files:**
- Create: packages/docs/src/examples/dialog/basic.tsx
- Create: packages/docs/src/examples/dialog/confirmation.tsx
- Create: packages/docs/src/examples/dialog/long-content.tsx
- Create: packages/docs/docs/components/dialog.mdx
- Create: packages/docs/i18n/en/docusaurus-plugin-content-docs/current/components/dialog.mdx
- Modify: scripts/docs-visual-qa.ts

**Interfaces:**
- Produces dialog/basic, dialog/confirmation, dialog/long-content.

- [ ] **Step 1: Add failing Dialog coverage and browser cases**

Verify the dialog page is missing, then define a browser case that opens and closes each dialog,
checks focus return, verifies Escape close, and confirms no clipped portal content.

- [ ] **Step 2: Extract Dialog examples**

Preserve controlled/uncontrolled state and confirmation behavior from DialogShowcase and
LoomDialogExamples. Keep all labels inside the example so both localized pages can supply translated
props rather than duplicating example implementations.

- [ ] **Step 3: Write bilingual Dialog pages**

Document DialogContent, DialogHeader, DialogBody, DialogFooter, accessible title requirements,
confirmation flow, Sheet guidance, and portal behavior.

- [ ] **Step 4: Run parity, build, and portal QA**

Run docs checks, docs build, and the Dialog Playwright case in both locales and themes.

- [ ] **Step 5: Commit the overlay pilot**

~~~text
Prove portal components inside the static documentation surface

Constraint: Documentation wrappers must not alter Dialog behavior
Confidence: high
Scope-risk: moderate
Tested: Bilingual build, keyboard close, focus return, and portal visual checks
~~~

---

### Task 7: Migrate the LayerPanel complex-block pilot

**Files:**
- Create: packages/docs/src/examples/layer-panel/basic.tsx
- Create: packages/docs/src/examples/layer-panel/groups.tsx
- Create: packages/docs/docs/blocks/layer-panel.mdx
- Create: packages/docs/i18n/en/docusaurus-plugin-content-docs/current/blocks/layer-panel.mdx
- Modify: scripts/docs-visual-qa.ts

**Interfaces:**
- Produces layer-panel/basic and layer-panel/groups.

- [ ] **Step 1: Add failing LayerPanel coverage and responsive scenarios**

The browser case must exercise visibility, selection, group collapse, rename/menu operations already
present in LayerPanelShowcase, at desktop and mobile widths.

- [ ] **Step 2: Extract the complex examples without registry edits**

Move demo state, fixtures, and localized labels into example files. Import the block from
@registry/blocks/layer-panel. Do not copy LayerPanel implementation into docs.

- [ ] **Step 3: Write bilingual LayerPanel pages**

Document controlled state, layer/group models, required handlers, accessibility labels, scrolling,
responsive constraints, and related blocks.

- [ ] **Step 4: Run all pilot gates**

~~~bash
bun run docs:check-i18n
bun run docs:check-examples
bun run docs:build
bun scripts/docs-visual-qa.ts --base-url http://127.0.0.1:3000 --case pilots
~~~

Expected: Button, Dialog, and LayerPanel pass in Chinese/English, light/dark, desktop/mobile.

- [ ] **Step 5: Commit the block pilot**

~~~text
Prove complex controlled blocks in bilingual documentation

Confidence: high
Scope-risk: moderate
Tested: Layer interactions, responsive layouts, both locales, and production build
~~~

---

### Task 8: Add guides, component indexes, and local filtering

**Files:**
- Create: packages/docs/docs/getting-started/installation.mdx
- Create: packages/docs/docs/getting-started/theming.mdx
- Create: packages/docs/docs/getting-started/registry.mdx
- Create: matching English files
- Create: packages/docs/docs/components/index.mdx
- Create: packages/docs/docs/blocks/index.mdx
- Create: matching English files
- Create: packages/docs/src/components/ComponentIndex/ComponentIndex.tsx
- Create: packages/docs/src/components/ComponentIndex/index.ts
- Modify: packages/docs/sidebars.ts
- Modify: packages/docs/docusaurus.config.ts

**Interfaces:**
- ComponentIndex props: category and localized search labels.

- [ ] **Step 1: Add failing guide parity and index-render tests**

Extend i18n fixtures for non-component guides and add Playwright checks for filtering button and
layer-panel cards by localized title.

- [ ] **Step 2: Write installation, theming, and registry guides in both languages**

Installation must include components.json registries configuration, @mapseek install commands,
installed file destinations, imports, and source-ownership explanation. Theming must explain
@mapseek/theme and src/app.css. Registry must explain same-domain /r/name.json delivery.

- [ ] **Step 3: Implement manifest-derived component indexes**

ComponentIndex reads registry-data, filters client-side by title/name/description, and links to the
current locale route. It must not duplicate catalog metadata.

- [ ] **Step 4: Run localized navigation and filtering QA**

Build both locales; verify guide links, locale switch preservation, component filters, and no broken
links.

- [ ] **Step 5: Commit the user onboarding surface**

~~~text
Let external users discover, install, and navigate Mapseek UI

Confidence: high
Scope-risk: moderate
Tested: Bilingual guide parity, local filtering, locale navigation, and broken-link build
~~~

---

### Task 9: Migrate all remaining primitives

**Files:**
- Create one or more example TSX files under packages/docs/src/examples/<name>/.
- Create one Chinese and one English MDX page under components/ for each item.
- Modify: scripts/docs-visual-qa.ts

**Interfaces:**
- Every page consumes the shared demo and registry components.
- Every example id is <registryName>/<exampleName>.

- [ ] **Step 1: Migrate display and layout primitives**

Items:

~~~text
accordion avatar badge card chart collapsible empty json-viewer progress separator skeleton table
~~~

For each item, first add expected example ids to coverage tests, verify failure, extract the current
Showcase behavior, write both pages, then run docs checks and build.

- [ ] **Step 2: Migrate form and input primitives**

Items:

~~~text
checkbox combobox command field icon-button input input-group label select slider switch textarea
toggle toggle-group
~~~

Preserve controlled state, validation, keyboard behavior, and all existing visible states.

- [ ] **Step 3: Migrate navigation, feedback, and overlay primitives**

Items:

~~~text
confirm-dialog context-menu dropdown-menu pagination popover sheet sonner tabs tooltip
~~~

Add browser interaction cases for menu keyboard navigation, portal placement, toasts, tabs, and focus
return.

- [ ] **Step 4: Run complete primitive verification**

~~~bash
bun run docs:check-i18n
bun run docs:check-examples
bun run docs:build
bun scripts/docs-visual-qa.ts --base-url http://127.0.0.1:3000 --category primitive
~~~

Expected: every registry/ui item has exactly one bilingual page and at least one rendered example.

- [ ] **Step 5: Commit each of the three primitive batches**

Use one Lore commit per batch, recording exact tests and any intentionally preserved Showcase
behavior. Do not combine all primitive migrations into one commit.

---

### Task 10: Migrate all remaining blocks

**Files:**
- Create example TSX files under packages/docs/src/examples/<block>/.
- Create Chinese and English MDX pages under blocks/.
- Modify: scripts/docs-visual-qa.ts

- [ ] **Step 1: Migrate forms, data, and editing blocks**

~~~text
add-field-form attr-inspector attr-table filter-panel form-inputs geojson-view json-editor
number-range-input schema-form
~~~

- [ ] **Step 2: Migrate application, map, and layer blocks**

~~~text
app-top-bar crs-picker layer-editor-group layer-style-editor layout map-controls
map-coordinate-status map-switcher pixel-probe split-tool-picker
~~~

- [ ] **Step 3: Migrate resource, status, and feedback blocks**

~~~text
band-stat linked-ref-list loading-screen notification-center placeholder-glyph processing-timeline
product-logo resource-detail-drawer resource-grid resource-sidebar resource-status
service-endpoint-row service-status stat-strip storage-meter
~~~

- [ ] **Step 4: Migrate style blocks**

~~~text
raster-style-panel style-color-input style-editor-modal style-editor-panel style-filter-editor
style-function-editor style-panel style-source-picker-dialog toggle-config-popover
~~~

For every batch: add failing coverage expectations, preserve all existing Showcase interactions,
write complete localized guidance, run docs parity/coverage/build, and add browser cases for
stateful/portal-heavy examples.

- [ ] **Step 5: Run complete block verification**

~~~bash
bun run docs:check-i18n
bun run docs:check-examples
bun run docs:build
bun scripts/docs-visual-qa.ts --base-url http://127.0.0.1:3000 --category block
~~~

Expected: every registry/blocks item has exactly one bilingual page and at least one rendered example.

- [ ] **Step 6: Commit each block batch separately**

Use four Lore commits so each reviewer can approve or reject one coherent migration group.

---

### Task 11: Prove installation, output, and visual release readiness

**Files:**
- Modify: scripts/__tests__/showcase.test.ts
- Modify or rename: scripts/showcase-visual-qa.ts
- Modify: package.json
- Modify: README.md
- Create: scripts/__tests__/docs-release.test.ts

**Interfaces:**
- Produces docs:visual and the final docs:verify release gate.

- [ ] **Step 1: Replace Showcase catalog assertions with documentation parity assertions**

The existing public-item coverage test must use registry manifests plus docs metadata. Retain the
exact one-to-one guarantee that every published item has one interactive example.

- [ ] **Step 2: Rename and extend visual QA**

Rename the Showcase-specific visual script to scripts/docs-visual-qa.ts if not already complete.
Require Chinese/English, light/dark, desktop/mobile pilot evidence and one render smoke per page.

- [ ] **Step 3: Add a static release artifact test**

After docs:build, assert:

~~~ts
await access("packages/docs/build/index.html")
await access("packages/docs/build/en/index.html")
await access("packages/docs/build/components/button/index.html")
await access("packages/docs/build/en/components/button/index.html")
await access("packages/docs/build/r/registry.json")
await access("packages/docs/build/r/button.json")
await access("packages/docs/build/r/layer-panel.json")
~~~

- [ ] **Step 4: Run real shadcn installs**

~~~bash
bun run verify:items button layout layer-panel
~~~

Expected: each clean Vite fixture receives source in the configured src paths, typechecks, and builds.

- [ ] **Step 5: Update README in Chinese-facing concise form**

Document docs:dev, docs:dev:en, docs:build, docs:verify, the eventual public URL shape, and the
external @mapseek installation command. Link to the design and plan only from maintainer guidance,
not end-user setup.

- [ ] **Step 6: Run the complete pre-removal gate**

~~~bash
bun run lint
bun run typecheck
bun test
bun run registry:validate
bun run docs:check-i18n
bun run docs:check-examples
bun run docs:build
bun run docs:visual
bun run verify:items button layout layer-panel
~~~

Expected: all commands exit zero. Fix failures in documentation-owned files; report unrelated
pre-existing failures without changing unrelated source.

- [ ] **Step 7: Commit release verification**

~~~text
Make the bilingual documentation artifact releasable with the registry

Confidence: high
Scope-risk: moderate
Tested: Full docs gate, visual matrix, static artifacts, and real shadcn installs
~~~

---

### Task 12: Remove the superseded Showcase

**Files:**
- Delete: showcase/
- Delete or rename: scripts/generate-showcase-theme.ts
- Delete obsolete Showcase-only scripts and package scripts
- Modify: package.json
- Modify: biome.json only if it contains Showcase exclusions
- Modify: scripts/__tests__/showcase.test.ts only if its final name still references Showcase
- Modify: DESIGN.md

**Interfaces:**
- Consumes the green pre-removal gate from Task 11.
- Produces one documentation surface and no Showcase references.

- [ ] **Step 1: Capture the green pre-removal evidence**

Do not begin deletion unless Task 11 evidence exists for the current full commit SHA.

- [ ] **Step 2: Delete the old app and rename remaining generic utilities**

Remove showcase/. Rename generate-showcase-theme.ts to generate-docs-theme.ts and update callers.
Rename showcase.test.ts to docs-coverage.test.ts if it now validates docs. Remove obsolete
showcase:dev, showcase:build, showcase:preview, showcase:doctor, and showcase:visual scripts.

- [ ] **Step 3: Update design ownership documentation**

DESIGN.md must state that packages/docs directly consumes registry source and that every public item
requires bilingual documentation plus an embedded example.

- [ ] **Step 4: Prove no stale references remain**

Run:

~~~bash
rg -n "showcase/|showcase:" --glob "!docs/superpowers/**" .
~~~

Expected: no implementation or command references remain. Historical design references under
docs/superpowers are intentionally retained.

- [ ] **Step 5: Run the full post-removal gate**

Run every Task 11 command again because inputs changed. Also preview the final static build and
manually open Chinese Button, English Dialog, LayerPanel mobile, and /r/button.json.

- [ ] **Step 6: Commit the removal**

~~~text
Retire the duplicate Showcase after documentation reaches parity

Constraint: Removal is permitted only after bilingual, behavioral, visual, and installation gates pass
Rejected: Keep both documentation apps | duplicate examples would drift
Confidence: high
Scope-risk: broad
Directive: New public registry items require paired docs and an embedded example
Tested: Full post-removal docs, registry, install, and visual gates
~~~

---

### Task 13: Final independent review and handoff

**Files:**
- Create: docs/superpowers/verification/2026-08-01-mapseek-ui-documentation-platform.md

- [ ] **Step 1: Review the final diff against the approved design**

Confirm every goal, non-goal, locale rule, route, example, build output, and removal gate has evidence.
Verify no registry behavior was changed for documentation.

- [ ] **Step 2: Run final verification once**

Run the complete Task 12 gate without changing inputs afterward. Record exact commands, exit codes,
representative URLs, screenshots, and any pre-existing issue in the verification document.

- [ ] **Step 3: Review commit history**

Confirm commits are batch-sized, follow Lore trailers, and do not include unrelated user changes.

- [ ] **Step 4: Commit verification evidence**

~~~text
Record release evidence for the documentation migration

Confidence: high
Scope-risk: narrow
Tested: Final static docs, bilingual content, registry output, shadcn installs, and visual QA
Not-tested: Production CDN cache behavior until deployment
~~~

## Execution Order and Checkpoints

Tasks 1 through 8 run sequentially. Task 9 primitive batches and Task 10 block batches may use
non-overlapping execution lanes, but their shared validators and visual script require leader-owned
integration. Task 11 is the hard pre-removal checkpoint. Task 12 cannot start until Task 11 is green
at the current commit. Task 13 is the final evidence gate.

## Plan Self-Review

- Spec coverage: framework, locales, routes, embedded examples, exact source, theme, registry
  composition, migration pilots, full parity, visual QA, installation QA, and Showcase removal all
  map to explicit tasks.
- Completeness scan: every step names concrete files, commands, expected results, and follow-up work.
- Type consistency: DocMetadata, ComponentDemoProps, RegistryDocItem, example ids, locale paths, and
  root script names are defined before use and remain consistent.
- Scope: full-text hosted search and generated exhaustive API docs remain excluded as specified.

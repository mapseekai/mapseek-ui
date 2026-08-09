# Toolbox Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public `LoomToolbox` block with the canonical `Toolbox` block and correct the design issues accepted in the specification.

**Architecture:** Preserve the existing controlled component boundary and interaction flow. First lock the visual/accessibility contract with focused component tests, then perform the breaking source rename, then update registry, Showcase, documentation, generated catalogs, and visual-QA identities as one integration unit.

**Tech Stack:** React 19, TypeScript 5.9, Vitest 4, Tailwind CSS 4, shadcn/Base UI primitives, pnpm 10, Next.js documentation app, Playwright.

## Global Constraints

- The rename is breaking: retain no `LoomToolbox`, `LoomTool`, `LOOM_TOOLBOX_*`, `loom-toolbox`, compatibility alias, duplicate registry entry, or redirect.
- The canonical API is `Toolbox`, `ToolboxProps`, `ToolboxLabels`, `ToolboxTab`, `ToolboxTool`, `TOOLBOX_LABELS_ZH_CN`, and `TOOLBOX_LABELS_EN`.
- The canonical registry slug, documentation route, Showcase key, and `data-slot` are `toolbox`.
- Use a stable 360px default width with `min-w-0` and `max-w-full`; preserve the existing 560px default height and independent scrolling.
- Preserve controlled state ownership and all current callback semantics.
- Use semantic tokens, zero radius, no shadows, no new z-index, and no raw colors.
- Preserve every unrelated working-tree change. Stage only Toolbox-specific hunks when an edited file already contains user changes.

---

### Task 1: Lock and implement the design-compliance contract

**Files:**
- Create: `registry/blocks/loom-toolbox/LoomToolbox.test.tsx`
- Create: `registry/blocks/loom-toolbox/labels.test.ts`
- Modify: `registry/blocks/loom-toolbox/ToolList.test.tsx`
- Modify: `registry/blocks/loom-toolbox/LoomToolbox.tsx`
- Modify: `registry/blocks/loom-toolbox/ToolList.tsx`
- Modify: `registry/blocks/loom-toolbox/ToolDetail.tsx`
- Modify: `registry/blocks/loom-toolbox/labels.ts`
- Modify: `showcase/src/showcases/LoomToolboxShowcase.tsx`

**Interfaces:**
- Consumes: the existing `LoomToolboxProps`, `LoomToolboxLabels`, and `LoomTool` contracts.
- Produces: the verified 360px panel, neutral passive icons, discoverable truncated copy, tabular counts, compliant quick-card hover, and search metadata that Task 2 renames without behavioral changes.

- [ ] **Step 1: Add a failing panel-width test**

Create a server-rendering test that mocks `Button`, `ToolList`, `ToolDetail`, and `cn`, renders the open panel, and asserts the desired layout contract:

```tsx
const html = renderToStaticMarkup(<LoomToolbox {...openProps} />)

expect(html).toContain('data-slot="loom-toolbox"')
expect(html).toContain("w-[360px]")
expect(html).toContain("min-w-0")
expect(html).toContain("max-w-full")
```

- [ ] **Step 2: Extend `ToolList.test.tsx` with failing design assertions**

Render one tool with a long label, group, and description. Assert complete-value discovery, neutral passive icon treatment, card hover treatment, count numerals, and search attributes:

```tsx
expect(html).toContain('name="toolbox-search"')
expect(html).toContain('autoComplete="off"')
expect(html).toContain('title="Buffer analysis"')
expect(html).toContain('title="Analysis · Create a buffer around selected features"')
expect(html).toContain("hover:border-primary")
expect(html).toContain("hover:bg-primary/5")
expect(html).toContain("tnum")
expect(html).toContain("bg-muted text-muted-foreground")
```

- [ ] **Step 3: Add a failing localized-placeholder test**

```ts
expect(LOOM_TOOLBOX_LABELS_ZH_CN.search.endsWith("…")).toBe(true)
expect(LOOM_TOOLBOX_LABELS_EN.search.endsWith("…")).toBe(true)
```

- [ ] **Step 4: Run focused tests and verify RED**

Run:

```bash
pnpm exec vitest run registry/blocks/loom-toolbox/LoomToolbox.test.tsx registry/blocks/loom-toolbox/ToolList.test.tsx registry/blocks/loom-toolbox/labels.test.ts
```

Expected: FAIL because the current panel uses `w-80`, truncated values have no `title`, the count lacks `tnum`, passive icons use primary green, quick cards lack the primary card hover treatment, and placeholders lack `…`.

- [ ] **Step 5: Implement the minimal design changes**

Apply these exact contracts:

```tsx
// LoomToolbox.tsx
data-slot="loom-toolbox"
className={cn(
  "flex h-[560px] w-[360px] min-w-0 max-w-full flex-col overflow-hidden border border-border bg-card",
  className,
)}

// ToolList.tsx search
<InputGroupInput
  aria-label={labels.search}
  name="toolbox-search"
  autoComplete="off"
  value={query}
  onChange={(event) => onQueryChange(event.target.value)}
  placeholder={labels.search}
/>

// Quick card
className="border border-border p-2.5 transition-colors hover:border-primary hover:bg-primary/5"

// Count
className="tnum text-body-sm text-muted-foreground"
```

Use `bg-muted text-muted-foreground` for passive icon tiles. Add `title={tool.label}`, `title={tool.description}`, and `title={`${tool.group} · ${tool.description}`}` to the corresponding truncated/clamped text. Remove explicit sizing classes from icons that are direct `Button` children; keep standalone icon-tile sizes.

Update the Showcase wrapper to `style={{ width: "min(100%, 360px)" }}`. Change both search labels to end with the Unicode ellipsis.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run the Step 4 command.

Expected: all three test files pass with no warnings.

- [ ] **Step 7: Commit only the self-contained design changes**

```bash
git add registry/blocks/loom-toolbox showcase/src/showcases/LoomToolboxShowcase.tsx
git diff --cached --check
git commit -m "fix(toolbox): align panel with design rules"
```

Before committing, confirm `git diff --cached --name-only` contains only the Task 1 files.

---

### Task 2: Perform the breaking source and API rename

**Files:**
- Create: `scripts/__tests__/toolbox-rename.test.ts`
- Rename: `registry/blocks/loom-toolbox/` → `registry/blocks/toolbox/`
- Rename: `registry/blocks/toolbox/LoomToolbox.tsx` → `registry/blocks/toolbox/Toolbox.tsx`
- Rename: `registry/blocks/toolbox/LoomToolbox.test.tsx` → `registry/blocks/toolbox/Toolbox.test.tsx`
- Rename: `showcase/src/showcases/LoomToolboxShowcase.tsx` → `showcase/src/showcases/ToolboxShowcase.tsx`
- Rename: `scripts/__tests__/loom-toolbox-detail-styles.test.ts` → `scripts/__tests__/toolbox-detail-styles.test.ts`
- Modify: every renamed source/test file listed above.

**Interfaces:**
- Consumes: the green design-compliance implementation from Task 1.
- Produces: `Toolbox`, `ToolboxProps`, `ToolboxLabels`, `ToolboxTab`, `ToolboxTool`, `TOOLBOX_LABELS_ZH_CN`, `TOOLBOX_LABELS_EN`, and `ToolboxDemo` from canonical `toolbox` paths.

- [ ] **Step 1: Add a failing rename-contract test**

The test checks the new paths/exports and removal of old paths:

```ts
it("publishes only the canonical toolbox source contract", async () => {
  await expect(access("registry/blocks/toolbox/Toolbox.tsx")).resolves.toBeUndefined()
  await expect(access("registry/blocks/loom-toolbox")).rejects.toThrow()

  const barrel = await readFile("registry/blocks/toolbox/index.ts", "utf8")
  expect(barrel).toContain('export { Toolbox } from "./Toolbox"')
  expect(barrel).toContain("ToolboxProps")
  expect(barrel).toContain("ToolboxTool")
  expect(barrel).not.toMatch(/LoomToolbox|LoomTool|LOOM_TOOLBOX/)
})
```

- [ ] **Step 2: Run the contract test and verify RED**

Run:

```bash
pnpm exec vitest run scripts/__tests__/toolbox-rename.test.ts
```

Expected: FAIL because `registry/blocks/toolbox/Toolbox.tsx` does not exist.

- [ ] **Step 3: Rename files and replace public identifiers**

Rename the directory/files, then make these replacements only within Toolbox source, Showcase, and Toolbox tests:

```text
LoomToolboxProps      → ToolboxProps
LoomToolboxLabels     → ToolboxLabels
LoomToolboxTab        → ToolboxTab
LoomToolbox           → Toolbox
LoomTool              → ToolboxTool
LOOM_TOOLBOX_LABELS_  → TOOLBOX_LABELS_
LoomToolboxDemo       → ToolboxDemo
loom-toolbox          → toolbox
```

Update the barrel to:

```ts
export type { ToolboxProps } from "./Toolbox"
export { Toolbox } from "./Toolbox"
export { TOOLBOX_LABELS_EN, TOOLBOX_LABELS_ZH_CN } from "./labels"
export type { ToolboxLabels, ToolboxTab, ToolboxTool } from "./types"
```

Update test descriptions and the detail-style test path to use `toolbox` terminology.

- [ ] **Step 4: Run source tests and verify GREEN**

Run:

```bash
pnpm exec vitest run scripts/__tests__/toolbox-rename.test.ts registry/blocks/toolbox/Toolbox.test.tsx registry/blocks/toolbox/ToolList.test.tsx registry/blocks/toolbox/labels.test.ts scripts/__tests__/toolbox-detail-styles.test.ts
```

Expected: all listed tests pass and no renamed source file imports an old public identifier.

- [ ] **Step 5: Commit the canonical source rename**

```bash
git add registry/blocks/toolbox registry/blocks/loom-toolbox showcase/src/showcases/ToolboxShowcase.tsx showcase/src/showcases/LoomToolboxShowcase.tsx scripts/__tests__/toolbox-rename.test.ts scripts/__tests__/toolbox-detail-styles.test.ts scripts/__tests__/loom-toolbox-detail-styles.test.ts
git diff --cached --check
git commit -m "refactor(toolbox): remove loom naming"
```

Confirm the cached name-status output contains only Task 2 paths.

---

### Task 3: Migrate registry, documentation, Showcase, and QA identities

**Files:**
- Rename: `packages/docs/content/docs/blocks/loom-toolbox.mdx` → `packages/docs/content/docs/blocks/toolbox.mdx`
- Rename: `packages/docs/content/docs/blocks/loom-toolbox.en.mdx` → `packages/docs/content/docs/blocks/toolbox.en.mdx`
- Modify: `registry/blocks/registry.json`
- Modify: `showcase/src/showcases/block-catalog.ts`
- Modify: `packages/docs/content/docs/blocks/toolbox.mdx`
- Modify: `packages/docs/content/docs/blocks/toolbox.en.mdx`
- Modify: `packages/docs/content/docs/blocks/meta.json`
- Modify: `packages/docs/content/docs/blocks/meta.en.json`
- Modify: `scripts/registry-model.ts`
- Modify: `scripts/docs-required-registry-docs.ts`
- Modify: `scripts/docs-visual-qa.ts`
- Modify: `scripts/__tests__/docs-coverage.test.ts`
- Modify: `scripts/__tests__/registry-component-composition.test.ts`
- Regenerate: `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`

**Interfaces:**
- Consumes: `ToolboxDemo` from `showcase/src/showcases/ToolboxShowcase.tsx` and the `@registry/blocks/toolbox` barrel from Task 2.
- Produces: installable registry item `toolbox`, docs route `/blocks/toolbox/`, Showcase key `toolbox`, generated source entry `toolbox`, and visual-QA case `ToolboxDemo`.

- [ ] **Step 1: Change integration expectations first**

Update the promoted-block and composition tests to expect `toolbox` and canonical paths:

```ts
const promotedShowcaseBlocks = ["custom-colormap", "layer-panel", "toolbox", "loom-toolbar"] as const

const toolDetail = await readFile("registry/blocks/toolbox/ToolDetail.tsx", "utf8")
const registryItem = await blockRegistryItem("toolbox")
```

Extend `toolbox-rename.test.ts` to read the registry, Showcase catalog, both docs metadata files, docs requirements, registry model, and visual-QA source and assert none of those scoped sources contain `loom-toolbox` or `LoomToolbox`.

- [ ] **Step 2: Run integration tests and verify RED**

Run:

```bash
pnpm exec vitest run scripts/__tests__/toolbox-rename.test.ts scripts/__tests__/docs-coverage.test.ts scripts/__tests__/registry-component-composition.test.ts
```

Expected: FAIL because registry, docs, catalog, and QA identities still use the old slug.

- [ ] **Step 3: Update the registry item and repository allowlists**

Change the registry item to:

```json
{
  "name": "toolbox",
  "type": "registry:block",
  "files": [
    {
      "path": "toolbox/Toolbox.tsx",
      "type": "registry:block",
      "target": "@components/blocks/toolbox/Toolbox.tsx"
    }
  ]
}
```

Keep the existing dependencies and migrate every remaining item path to `toolbox/...`. Replace the slug in `registry-model.ts`, `docs-required-registry-docs.ts`, `docs-coverage.test.ts`, and the composition tests.

Update the visual-QA record to:

```ts
{
  name: "toolbox",
  demo: "toolbox",
  sourceFunction: "ToolboxDemo",
  importPath: "@registry/blocks/toolbox",
}
```

- [ ] **Step 4: Rename and update the Showcase and bilingual docs**

Use this catalog entry:

```ts
block("toolbox", "Toolbox 编辑工具箱", () => import("./ToolboxShowcase"))
```

Both docs pages use `title: "Toolbox"`, `registryName: toolbox`, `showcase: toolbox`, imports from `@/components/blocks/toolbox`, and the new `Toolbox`/`ToolboxTool` symbols. Replace `loom-toolbox` with `toolbox` in both navigation metadata files while preserving their existing ordering and unrelated edits.

- [ ] **Step 5: Regenerate the Showcase source catalog**

Run:

```bash
pnpm run docs:sources
```

Expected: reports a generated source catalog whose key is `toolbox` and whose content imports `@registry/blocks/toolbox`.

- [ ] **Step 6: Run integration checks and verify GREEN**

Run:

```bash
pnpm exec vitest run scripts/__tests__/toolbox-rename.test.ts scripts/__tests__/docs-coverage.test.ts scripts/__tests__/registry-component-composition.test.ts
pnpm run registry:validate
pnpm run docs:check-i18n
pnpm run docs:check-examples
```

Expected: every command exits 0.

- [ ] **Step 7: Stage only Toolbox hunks and commit**

Because several files contain unrelated user changes, inspect and stage only Toolbox-specific hunks. Verify with `git diff --cached` before committing:

```bash
git diff --cached --check
git commit -m "docs(toolbox): publish canonical block"
```

The cached diff must not contain layer-panel, JSON editor, or other unrelated changes.

---

### Task 4: Complete repository and browser verification

**Files:**
- Modify only if verification finds a Toolbox regression: files from Tasks 1–3.
- Create outside the repository: `/private/tmp/mapseek-toolbox-audit/*` screenshots and inspection scripts.

**Interfaces:**
- Consumes: the complete `toolbox` registry/docs integration.
- Produces: fresh automated and visual evidence that the new route, component interactions, themes, responsive width, and absence of the old public name meet the specification.

- [ ] **Step 1: Prove no old public name remains in scoped product sources**

Run a repository search excluding the historical design specification and implementation plan. Expected: no `loom-toolbox`, `LoomToolbox`, `LoomTool`, or `LOOM_TOOLBOX` match in `registry`, `showcase`, `packages/docs`, or `scripts`.

- [ ] **Step 2: Run the focused regression suite**

```bash
pnpm exec vitest run registry/blocks/toolbox scripts/__tests__/toolbox-rename.test.ts scripts/__tests__/toolbox-detail-styles.test.ts scripts/__tests__/docs-coverage.test.ts scripts/__tests__/registry-component-composition.test.ts
```

Expected: all focused tests pass with zero failures.

- [ ] **Step 3: Run static and integration verification**

```bash
pnpm run typecheck
pnpm run lint
pnpm run registry:validate
pnpm run registry:build
pnpm run docs:check-i18n
pnpm run docs:check-examples
pnpm run docs:sources
```

Expected: every command exits 0. If an unrelated pre-existing working-tree failure occurs, record the exact command and failure separately; do not modify unrelated code.

- [ ] **Step 4: Verify the local documentation route in Playwright**

Use the running docs server at `http://localhost:3000`. Navigate to `/blocks/toolbox/`, wait for `networkidle`, and assert:

```ts
await expect(page.getByRole("heading", { name: "Toolbox", exact: true })).toBeVisible()
const toolbox = page.locator('[data-slot="toolbox"]').first()
await expect(toolbox).toBeVisible()
expect((await toolbox.boundingBox())?.width).toBeLessThanOrEqual(360)
```

At 1440×1000 and 390×844, capture full-page screenshots, verify no horizontal component overflow, open a tool detail, return to the list, toggle a favorite, switch tabs, type a query, close/reopen the panel, and verify visible keyboard focus. Repeat the visual inspection in dark mode.

- [ ] **Step 5: Check the removed route**

Request `/blocks/loom-toolbox/` and confirm it no longer renders the old component documentation. Do not add a redirect.

- [ ] **Step 6: Review final diff and commits**

Run:

```bash
git status --short
git diff --check
git log -4 --oneline
```

Confirm all Toolbox requirements map to verified changes, unrelated working-tree edits remain intact, and no completion claim is made without the fresh command outputs above.

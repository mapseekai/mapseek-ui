# Toolbar Complete Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public `loom-toolbar` / `LoomToolbar*` contract with the single canonical `toolbar` / `Toolbar*` contract while preserving the existing controlled map-editing behavior and styling.

**Architecture:** Perform a coordinated breaking rename across the block source, registry, Showcase, documentation, generated source catalog, QA metadata, and tests. Add a filesystem/registry contract test before production edits so the old implementation fails, then complete the rename and verify the new route and API without applying any of the separately reported design fixes.

**Tech Stack:** React 19, TypeScript 5.9, Vitest, shadcn/Base UI registry conventions, Fumadocs/Next.js documentation, Playwright, pnpm.

## Global Constraints

- This is a complete breaking rename: do not retain deprecated exports, duplicate registry entries, redirects, or compatibility routes.
- Preserve all existing props, callbacks, state ownership, labels, control order, styling, responsive behavior, and map scaffold.
- Do not fix the five design-audit findings in this implementation.
- Rename only this block; do not rename `loom-toolbox` or other `Loom*` blocks.
- Regenerate `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts` with `pnpm run docs:sources`.
- Preserve and exclude unrelated working-tree changes from Toolbar commits.

---

### Task 1: Rename the Core Block and Registry Contract

**Files:**
- Create: `scripts/__tests__/toolbar-rename.test.ts`
- Move: `registry/blocks/loom-toolbar/LoomToolbar.tsx` → `registry/blocks/toolbar/Toolbar.tsx`
- Move: `registry/blocks/loom-toolbar/LoomToolbar.test.tsx` → `registry/blocks/toolbar/Toolbar.test.tsx`
- Move: `registry/blocks/loom-toolbar/index.ts` → `registry/blocks/toolbar/index.ts`
- Move: `registry/blocks/loom-toolbar/labels.ts` → `registry/blocks/toolbar/labels.ts`
- Move: `registry/blocks/loom-toolbar/types.ts` → `registry/blocks/toolbar/types.ts`
- Modify: `registry/blocks/registry.json:688-715`
- Modify: `scripts/registry-model.ts:82-122`
- Modify: `scripts/__tests__/registry-component-composition.test.ts:185-193`

**Interfaces:**
- Consumes: Existing controlled props and callbacks from `LoomToolbarProps` without behavioral changes.
- Produces: `Toolbar`, `ToolbarProps`, `ToolbarTool`, `ToolbarGroup`, `ToolbarLabels`, `TOOLBAR_LABELS_ZH_CN`, and `TOOLBAR_LABELS_EN` from `@registry/blocks/toolbar`.

- [ ] **Step 1: Write the failing canonical-name contract test**

```ts
import { access, readFile } from "node:fs/promises"
import { describe, expect, it } from "vitest"

async function exists(path: string): Promise<boolean> {
  return access(path).then(
    () => true,
    () => false,
  )
}

describe("toolbar complete rename", () => {
  it("publishes only the Toolbar registry contract", async () => {
    const registry = JSON.parse(await readFile("registry/blocks/registry.json", "utf8")) as {
      items: Array<{ name: string; files: Array<{ path: string; target?: string }> }>
    }
    const toolbar = registry.items.find((item) => item.name === "toolbar")

    expect(toolbar?.files).toEqual([
      {
        path: "toolbar/Toolbar.tsx",
        type: "registry:block",
        target: "@components/blocks/toolbar/Toolbar.tsx",
      },
      {
        path: "toolbar/index.ts",
        type: "registry:block",
        target: "@components/blocks/toolbar/index.ts",
      },
      {
        path: "toolbar/labels.ts",
        type: "registry:block",
        target: "@components/blocks/toolbar/labels.ts",
      },
      {
        path: "toolbar/types.ts",
        type: "registry:block",
        target: "@components/blocks/toolbar/types.ts",
      },
    ])
    expect(registry.items.some((item) => item.name === "loom-toolbar")).toBe(false)
    expect(await exists("registry/blocks/toolbar/Toolbar.tsx")).toBe(true)
    expect(await exists("registry/blocks/loom-toolbar/LoomToolbar.tsx")).toBe(false)
  })

  it("exports only the canonical Toolbar symbols", async () => {
    const [component, index, labels, types] = await Promise.all([
      readFile("registry/blocks/toolbar/Toolbar.tsx", "utf8"),
      readFile("registry/blocks/toolbar/index.ts", "utf8"),
      readFile("registry/blocks/toolbar/labels.ts", "utf8"),
      readFile("registry/blocks/toolbar/types.ts", "utf8"),
    ])
    const source = [component, index, labels, types].join("\n")

    expect(component).toContain("export function Toolbar")
    expect(component).toContain('data-slot="toolbar"')
    expect(index).toContain('export { Toolbar } from "./Toolbar"')
    expect(source).toContain("TOOLBAR_LABELS_ZH_CN")
    expect(source).toContain("ToolbarGroup")
    expect(source).not.toMatch(/LoomToolbar|LOOM_TOOLBAR|loom-toolbar/)
  })
})
```

- [ ] **Step 2: Run the contract test and verify the old implementation fails**

Run: `pnpm vitest run scripts/__tests__/toolbar-rename.test.ts`

Expected: FAIL because `toolbar` is absent from the registry and `registry/blocks/toolbar/Toolbar.tsx` does not exist.

- [ ] **Step 3: Move the block files and rename every core public symbol**

The renamed barrel must be exactly:

```ts
export type { ToolbarProps } from "./Toolbar"
export { Toolbar } from "./Toolbar"
export { TOOLBAR_LABELS_EN, TOOLBAR_LABELS_ZH_CN } from "./labels"
export type { ToolbarGroup, ToolbarLabels, ToolbarTool } from "./types"
```

The renamed props declaration remains structurally identical:

```tsx
export type ToolbarProps = {
  readonly groups: readonly ToolbarGroup[]
  readonly activeMode: string
  readonly activeLayerName: string
  readonly editing: boolean
  readonly dirty: boolean
  readonly snapping: boolean
  readonly canUndo: boolean
  readonly canRedo: boolean
  readonly labels?: ToolbarLabels
  readonly className?: string
  readonly onEditingChange: (editing: boolean) => void
  readonly onModeChange: (mode: string) => void
  readonly onSnappingChange: (snapping: boolean) => void
  readonly onSave: () => void
  readonly onUndo: () => void
  readonly onRedo: () => void
}
```

Apply the exact type mappings `LoomToolbarTool` → `ToolbarTool`, `LoomToolbarGroup` → `ToolbarGroup`, and `LoomToolbarLabels` → `ToolbarLabels`. Rename both label constants to `TOOLBAR_LABELS_*`, rename the component function and props annotation to `Toolbar` / `ToolbarProps`, change its default label constant to `TOOLBAR_LABELS_ZH_CN`, and change only `data-slot="loom-toolbar"` to `data-slot="toolbar"` inside the rendered markup. Update the unit test import, `describe` name, rendered component, and file name to `Toolbar` without changing its typography assertions.

- [ ] **Step 4: Replace the registry item and composition-test path**

```json
{
  "name": "toolbar",
  "type": "registry:block",
  "registryDependencies": ["@mapseek/badge", "@mapseek/button", "@mapseek/utils"],
  "files": [
    {
      "path": "toolbar/Toolbar.tsx",
      "type": "registry:block",
      "target": "@components/blocks/toolbar/Toolbar.tsx"
    },
    {
      "path": "toolbar/index.ts",
      "type": "registry:block",
      "target": "@components/blocks/toolbar/index.ts"
    },
    {
      "path": "toolbar/labels.ts",
      "type": "registry:block",
      "target": "@components/blocks/toolbar/labels.ts"
    },
    {
      "path": "toolbar/types.ts",
      "type": "registry:block",
      "target": "@components/blocks/toolbar/types.ts"
    }
  ],
  "dependencies": ["@tabler/icons-react"]
}
```

Rename the composition assertion to `renders the toolbar with a border and no shadow` and read `registry/blocks/toolbar/Toolbar.tsx`. In the `BLOCKS` inventory, replace only `"loom-toolbar"` with `"toolbar"` and leave `"loom-toolbox"` unchanged.

- [ ] **Step 5: Run focused core tests and registry validation**

Run: `pnpm vitest run scripts/__tests__/toolbar-rename.test.ts registry/blocks/toolbar/Toolbar.test.tsx scripts/__tests__/registry-component-composition.test.ts`

Expected: PASS.

Run: `pnpm run registry:validate`

Expected: PASS with the canonical `toolbar` registry item and no missing source files.

- [ ] **Step 6: Commit the core rename**

```bash
git add registry/blocks/toolbar/Toolbar.tsx registry/blocks/toolbar/Toolbar.test.tsx registry/blocks/toolbar/index.ts registry/blocks/toolbar/labels.ts registry/blocks/toolbar/types.ts registry/blocks/loom-toolbar/LoomToolbar.tsx registry/blocks/loom-toolbar/LoomToolbar.test.tsx registry/blocks/loom-toolbar/index.ts registry/blocks/loom-toolbar/labels.ts registry/blocks/loom-toolbar/types.ts registry/blocks/registry.json scripts/registry-model.ts scripts/__tests__/toolbar-rename.test.ts scripts/__tests__/registry-component-composition.test.ts
git commit -m "refactor(toolbar): rename public block contract"
```

### Task 2: Rename Showcase, Documentation, and QA Surfaces

**Files:**
- Move: `showcase/src/showcases/LoomToolbarShowcase.tsx` → `showcase/src/showcases/ToolbarShowcase.tsx`
- Move: `packages/docs/content/docs/blocks/loom-toolbar.mdx` → `packages/docs/content/docs/blocks/toolbar.mdx`
- Move: `packages/docs/content/docs/blocks/loom-toolbar.en.mdx` → `packages/docs/content/docs/blocks/toolbar.en.mdx`
- Modify: `showcase/src/showcases/block-catalog.ts:5-9`
- Modify: `packages/docs/content/docs/blocks/meta.json:24`
- Modify: `packages/docs/content/docs/blocks/meta.en.json:24`
- Modify: `scripts/__tests__/docs-coverage.test.ts:15-22`
- Modify: `scripts/docs-required-registry-docs.ts:378-383`
- Modify: `scripts/docs-visual-qa.ts:738-743`
- Modify: `TODO.md:100,104`
- Regenerate: `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`

**Interfaces:**
- Consumes: The canonical exports from `@registry/blocks/toolbar` produced by Task 1.
- Produces: `ToolbarDemo`, the `/blocks/toolbar/` documentation page, the `toolbar` Showcase key, and QA/catalog metadata that reference only the canonical slug.

- [ ] **Step 1: Change the promoted-doc expectation first and verify it fails**

```ts
const promotedShowcaseBlocks = [
  "custom-colormap",
  "layer-panel",
  "loom-toolbox",
  "toolbar",
] as const
```

Run: `pnpm vitest run scripts/__tests__/docs-coverage.test.ts`

Expected: FAIL because the bilingual docs still publish `loom-toolbar` while the registry publishes `toolbar`.

- [ ] **Step 2: Rename the Showcase module and canonical demo symbols**

```tsx
import {
  TOOLBAR_LABELS_EN,
  TOOLBAR_LABELS_ZH_CN,
  Toolbar,
  type ToolbarGroup,
} from "@registry/blocks/toolbar"
```

In the remainder of the moved module, apply exactly these identifier replacements: `loomToolbarGroups` → `toolbarGroups`, `LoomToolbarGroup` → `ToolbarGroup`, `LoomToolbarDemo` → `ToolbarDemo`, `LOOM_TOOLBAR_LABELS_EN` → `TOOLBAR_LABELS_EN`, `LOOM_TOOLBAR_LABELS_ZH_CN` → `TOOLBAR_LABELS_ZH_CN`, and the JSX element `<LoomToolbar` → `<Toolbar`. Do not alter the tool definitions, state initializers, callbacks, locale behavior, or prop values.

Replace the block catalog entry with:

```ts
block("toolbar", "Toolbar 编辑工具条", () => import("./ToolbarShowcase"))
```

- [ ] **Step 3: Rename both documentation pages and their public examples**

Each page must use this canonical metadata shape:

```mdx
---
title: "Toolbar"
registryName: toolbar
category: block
stability: experimental
showcase: toolbar
---
```

In the Chinese page replace the opening sentence with `Toolbar 是地图编辑会话的受控工具条，组合编辑开关、工具组、吸附、保存与<span className="whitespace-nowrap">撤销/重做</span>状态。`; in the English page replace it with `Toolbar is a controlled map-editing toolbar that composes editing state, tool groups, snapping, save, and undo/redo controls.` Use `<ShowcaseDemo registryName="toolbar" title="编辑工具条" description="工具可按业务分组，并通过 editOnly 门控编辑态专用操作。" minHeight={560} />` in Chinese and `<ShowcaseDemo registryName="toolbar" title="Editing toolbar" description="Group tools by business workflow and gate editing-only actions with editOnly." minHeight={560} />` in English. Replace the remaining examples with `Toolbar`, `ToolbarGroup`, `@/components/blocks/toolbar`, `<RegistryInstall registryName="toolbar" />`, and `<RegistryDependencies registryName="toolbar" />`. Preserve the remaining localized explanatory copy byte-for-byte.

- [ ] **Step 4: Update metadata and QA allowlists**

Use `toolbar` in both `meta*.json` files, `requiredRegistryDocs`, and the promoted-doc list. Replace the visual-QA entry with:

```ts
{
  name: "toolbar",
  demo: "toolbar",
  sourceFunction: "ToolbarDemo",
  importPath: "@registry/blocks/toolbar",
}
```

Update the two historical `TODO.md` references from `LoomToolbar` to `Toolbar` without changing their completion text or scope.

- [ ] **Step 5: Regenerate the Showcase source catalog**

Run: `pnpm run docs:sources`

Expected: `source-catalog.generated.ts` contains the key `"toolbar"`, imports `Toolbar*` from `@registry/blocks/toolbar`, and no longer contains the old key or symbols.

- [ ] **Step 6: Run focused docs and model tests**

Run: `pnpm vitest run scripts/__tests__/docs-coverage.test.ts scripts/__tests__/toolbar-rename.test.ts scripts/__tests__/registry-component-composition.test.ts registry/blocks/toolbar/Toolbar.test.tsx`

Expected: PASS.

Run: `pnpm run docs:check-i18n`

Expected: PASS with one Chinese and one English page for `toolbar`.

Run: `pnpm run docs:check-examples`

Expected: PASS with the canonical install and example imports.

- [ ] **Step 7: Commit documentation and Showcase surfaces**

```bash
git add showcase/src/showcases/ToolbarShowcase.tsx showcase/src/showcases/LoomToolbarShowcase.tsx showcase/src/showcases/block-catalog.ts packages/docs/content/docs/blocks/toolbar.mdx packages/docs/content/docs/blocks/toolbar.en.mdx packages/docs/content/docs/blocks/loom-toolbar.mdx packages/docs/content/docs/blocks/loom-toolbar.en.mdx packages/docs/content/docs/blocks/meta.json packages/docs/content/docs/blocks/meta.en.json packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts scripts/__tests__/docs-coverage.test.ts scripts/docs-required-registry-docs.ts scripts/docs-visual-qa.ts TODO.md
git commit -m "docs(toolbar): publish canonical block name"
```

### Task 3: Verify the Breaking Rename End to End

**Files:**
- Verify: All files changed in Tasks 1–2
- Verify: `docs/superpowers/specs/2026-08-09-toolbar-rename-design.md`

**Interfaces:**
- Consumes: The complete canonical source, registry, Showcase, docs, and QA contract from Tasks 1–2.
- Produces: Evidence that the new URL/API work, the old URL/API are removed, and unrelated design behavior remains unchanged.

- [ ] **Step 1: Prove no legacy identifiers remain in active source surfaces**

Run: `rg -n "loom-toolbar|LoomToolbar|LOOM_TOOLBAR|loomToolbar" registry showcase packages scripts TODO.md`

Expected: no output. The approved specification and this implementation plan may retain old names only as historical mappings.

- [ ] **Step 2: Run repository static verification**

Run: `pnpm run typecheck`

Expected: PASS.

Run: `pnpm run lint`

Expected: PASS.

Run: `pnpm run registry:validate`

Expected: PASS.

Run: `pnpm run docs:check-i18n`

Expected: PASS.

Run: `pnpm run docs:check-examples`

Expected: PASS.

- [ ] **Step 3: Run focused and full test suites**

Run: `pnpm vitest run scripts/__tests__/toolbar-rename.test.ts registry/blocks/toolbar/Toolbar.test.tsx scripts/__tests__/docs-coverage.test.ts scripts/__tests__/registry-component-composition.test.ts`

Expected: PASS.

Run: `pnpm test`

Expected: PASS.

- [ ] **Step 4: Verify the generated source catalog is stable**

Run: `pnpm run docs:sources`

Expected: PASS and no generated diff.

Run: `git diff --exit-code -- packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`

Expected: exit 0.

- [ ] **Step 5: Verify new and removed routes with Playwright**

With the existing documentation server running on port 3000, run:

```bash
pnpm exec tsx -e 'import { chromium } from "playwright"; void (async()=>{ const browser=await chromium.launch({headless:true}); for (const width of [1280,390]) { const page=await browser.newPage({viewport:{width,height:900}}); const errors=[]; page.on("console",message=>{if(message.type()==="error") errors.push(message.text())}); await page.goto("http://localhost:3000/blocks/toolbar/",{waitUntil:"networkidle"}); await page.locator("[data-slot=toolbar]").waitFor(); if(errors.length) throw new Error(errors.join("\n")); await page.close() } const oldPage=await browser.newPage(); const response=await oldPage.goto("http://localhost:3000/blocks/loom-toolbar/",{waitUntil:"networkidle"}); if((response?.status() ?? 200)<400) throw new Error("legacy route still resolves"); await browser.close() })()'
```

Expected: exit 0; `[data-slot="toolbar"]` renders at both widths with no console errors, and the legacy URL returns a non-success status.

- [ ] **Step 6: Review the scoped diff and commits**

Run: `git status --short`

Expected: only pre-existing unrelated user changes remain uncommitted.

Run: `git log -3 --oneline`

Expected: the design-spec commit followed by the core rename and documentation/Showcase commits. Do not create an empty verification commit.

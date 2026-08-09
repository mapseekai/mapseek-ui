# ResourceSidebar Design Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all confirmed `ResourceSidebar` design, accessibility, typography, composition, and Showcase acceptance gaps.

**Architecture:** Keep the controlled `ResourceSidebar` API unchanged. Repair rendered behavior inside the block, extend the existing production browser acceptance case, and update registry/documentation metadata as derived artifacts of the same public contract.

**Tech Stack:** React 19, TypeScript, Base UI, Tailwind CSS v4, Vitest SSR tests, Playwright, shadcn registry tooling.

## Global Constraints

- Preserve the public `ResourceSidebarProps`, `ResourceSidebarLabels`, `ResourceSidebarCategory`, and `ResourceTab` interfaces.
- Use only existing semantic tokens and the 32px (`h-8`) control tier.
- Preserve `bg-selection-bg text-primary`, selected hover persistence, `aria-pressed`, and the type-row primary edge.
- Preserve injected labels; add no embedded product copy.
- Do not stage or commit unrelated working-tree changes.

---

### Task 1: Component behavior and composition

**Files:**
- Modify: `registry/blocks/resource-sidebar/ResourceSidebar.test.tsx`
- Modify: `registry/blocks/resource-sidebar/ResourceSidebar.tsx`

**Interfaces:**
- Consumes: existing `ResourceSidebarProps` and the project `Button`, `Tooltip`, and `Separator` primitives.
- Produces: the same public `ResourceSidebar` export with compliant rendered HTML and CSS states.

- [ ] **Step 1: Extend the SSR fixture with an editable long category**

Use literal data so the rendered contract includes both default and editable rows:

```tsx
categories={[
  { id: "maps", label: "Maps", count: 4, isDefault: true },
  {
    id: "long-category",
    label: "A category name that must truncate",
    count: 1234,
    isDefault: false,
  },
]}
```

- [ ] **Step 2: Add failing output-contract tests**

Add tests that prove the consumer-visible HTML contract:

```tsx
it("uses standard row geometry and tabular resource counts", () => {
  const html = renderSidebar()

  expect(buttonAttributes(html, "Icons")).toContain("h-8")
  expect(buttonAttributes(html, "A category name that must truncate")).toContain("h-full")
  expect(html.match(/\btnum\b/g)).toHaveLength(6)
  expect(html).not.toContain("h-[34px]")
})

it("keeps truncated names discoverable and actions focus-accessible", () => {
  const html = renderSidebar()

  expect(html).toContain('title="A category name that must truncate"')
  expect(html).toContain("group-focus-within/cat:hidden")
  expect(html).toContain("group-focus-within/cat:flex")
})

it("composes the shared separator primitive", () => {
  const html = renderSidebar()

  expect(html.match(/data-slot="separator"/g)).toHaveLength(2)
})
```

The `tnum` expectation is six because the fixture renders three type counts, the active-tab total, and two category counts.

- [ ] **Step 3: Run the component test and verify RED**

Run:

```bash
pnpm exec vitest run --exclude '.worktrees/**' registry/blocks/resource-sidebar/ResourceSidebar.test.tsx
```

Expected failures: missing `h-8`, `tnum`, `title`, focus-within classes, and `data-slot="separator"`.

- [ ] **Step 4: Implement the minimal component repair**

Apply these exact behavior changes:

```tsx
import { Separator } from "@/components/ui/separator"

const leafBase =
  "relative flex h-8 w-full ..."

<Separator className="mx-2 my-1.5 w-auto" />

<span className="ml-auto font-mono text-body-sm tnum">{count}</span>

<div className="group/cat relative h-8">
  <Button size="default" ...>
    <span className="min-w-0 flex-1 truncate" title={label}>{label}</span>
  </Button>
  <span className="... tnum ... group-hover/cat:hidden group-focus-within/cat:hidden">
    {count}
  </span>
  <div className="... hidden ... group-hover/cat:flex group-focus-within/cat:flex">
    {actions}
  </div>
</div>
```

Use `size="default"` for both `TypeRow` and `CategoryRow` so the primitive and explicit row tier agree at 32px.

- [ ] **Step 5: Run GREEN and formatting checks**

```bash
pnpm exec vitest run --exclude '.worktrees/**' registry/blocks/resource-sidebar/ResourceSidebar.test.tsx
pnpm exec biome check registry/blocks/resource-sidebar/ResourceSidebar.tsx registry/blocks/resource-sidebar/ResourceSidebar.test.tsx
```

- [ ] **Step 6: Commit Task 1**

```bash
git add registry/blocks/resource-sidebar/ResourceSidebar.tsx registry/blocks/resource-sidebar/ResourceSidebar.test.tsx
git commit -m "fix(resource-sidebar): align rows and category actions"
```

---

### Task 2: Showcase semantics and production browser coverage

**Files:**
- Modify: `showcase/src/showcases/ResourceSidebarShowcase.tsx`
- Modify: `scripts/docs-visual-qa.ts`

**Interfaces:**
- Consumes: the unchanged `ResourceSidebarDemo` catalog export and `assertBlockInteraction` browser test path.
- Produces: a polite status live region and browser assertions for the repaired public behavior.

- [ ] **Step 1: Add failing browser assertions before changing the Showcase**

Extend the `resource-sidebar` case with literal runtime expectations:

```tsx
await expect(typeRow).toHaveCSS("height", "32px")
await expect(categoryRow).toHaveCSS("height", "32px")
await expect(typeRow.locator("span").last()).toHaveCSS("font-variant-numeric", "tabular-nums")

const editableRow = demo.getByRole("button", {
  name: localized(path, "基础操作", "Basic operations"),
  exact: true,
})
const editableWrapper = editableRow.locator("xpath=..")
await expect(editableRow.locator("span").last()).toHaveAttribute(
  "title",
  localized(path, "基础操作", "Basic operations"),
)
await editableRow.focus()
const renameButton = editableWrapper.getByRole("button", {
  name: localized(path, "重命名", "Rename"),
  exact: true,
})
await expect(renameButton).toBeVisible()
await page.keyboard.press("Tab")
await expect(renameButton).toBeFocused()

const status = demo.getByRole("status")
await expect(status).toHaveCSS("font-size", "11px")
```

- [ ] **Step 2: Run the browser case and verify RED**

```bash
pnpm exec tsx scripts/docs-visual-qa.ts --category block --only resource-sidebar
```

Expected first failure: row height is 34px before Task 1, or status role is absent after Task 1; if Task 1 is already green, the browser test must still fail on the unchanged Showcase status.

- [ ] **Step 3: Repair the Showcase status**

```tsx
<span
  role="status"
  data-demo-status="resource-sidebar"
  className="text-body-sm text-muted-foreground"
>
  {status}
</span>
```

- [ ] **Step 4: Run GREEN and formatting checks**

```bash
pnpm exec tsx scripts/docs-visual-qa.ts --category block --only resource-sidebar
pnpm exec biome check showcase/src/showcases/ResourceSidebarShowcase.tsx scripts/docs-visual-qa.ts
```

- [ ] **Step 5: Commit Task 2 without unrelated hunks**

Stage the ResourceSidebar hunk only if `scripts/docs-visual-qa.ts` contains concurrent changes:

```bash
git add showcase/src/showcases/ResourceSidebarShowcase.tsx
git add -p scripts/docs-visual-qa.ts
git commit -m "test(resource-sidebar): cover accessible sidebar states"
```

---

### Task 3: Registry contract and bilingual documentation

**Files:**
- Modify: `registry/blocks/registry.json`
- Modify: `scripts/__tests__/inventory.test.ts`
- Modify: `packages/docs/content/docs/blocks/resource-sidebar.mdx`
- Modify: `packages/docs/content/docs/blocks/resource-sidebar.en.mdx`
- Modify: `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts` (generated)
- Modify: `TODO.md`

**Interfaces:**
- Consumes: `@mapseek/separator`, the Showcase source generator, and existing registry validation.
- Produces: installable registry metadata and documentation matching the repaired component.

- [ ] **Step 1: Update the registry dependency expectation**

Set both the registry entry and inventory test to this exact dependency order:

```json
["@mapseek/button", "@mapseek/separator", "@mapseek/tooltip", "@mapseek/utils"]
```

- [ ] **Step 2: Update bilingual accessibility documentation**

Chinese:

```md
类型和分类按钮通过 `aria-pressed` 暴露选择状态；可编辑分类的重命名和删除操作在悬停或键盘焦点进入行时显示，并通过 Tooltip/title 暴露动作名称。截断的分类名称通过原生 `title` 提供完整值。
```

English:

```md
Type and category buttons expose selection through `aria-pressed`. Editable-category actions appear on hover or when keyboard focus enters the row, with names exposed through Tooltip/title. Truncated category names retain their full value in a native `title`.
```

- [ ] **Step 3: Update only the ResourceSidebar portions of TODO findings 53 and 59**

Record ResourceSidebar as resolved while leaving every unrelated component listed as pending.

- [ ] **Step 4: Regenerate Showcase sources**

```bash
pnpm run docs:sources
```

- [ ] **Step 5: Validate registry and documentation**

```bash
pnpm run registry:validate
pnpm run docs:check-i18n
pnpm run docs:check-examples
pnpm exec vitest run --exclude '.worktrees/**' scripts/__tests__/inventory.test.ts
```

- [ ] **Step 6: Commit Task 3 without unrelated hunks**

Use interactive staging for `registry.json`, `inventory.test.ts`, and the generated source catalog when concurrent changes exist.

```bash
git commit -m "docs(resource-sidebar): document accessible rail behavior"
```

---

### Task 4: Final verification

**Files:**
- Verify only; no expected source changes.

**Interfaces:**
- Consumes: all prior task outputs.
- Produces: fresh completion evidence.

- [ ] **Step 1: Run focused and repository checks**

```bash
pnpm exec vitest run --exclude '.worktrees/**' registry/blocks/resource-sidebar/ResourceSidebar.test.tsx
pnpm run typecheck
pnpm run design:lint
pnpm run registry:validate
pnpm run docs:check-i18n
pnpm run docs:check-examples
pnpm run docs:build
pnpm exec tsx scripts/docs-visual-qa.ts --category block --only resource-sidebar
git diff --check
```

- [ ] **Step 2: Inspect scope**

Confirm the ResourceSidebar commits contain only the files and partial hunks listed in Tasks 1–3. Preserve every unrelated working-tree change.

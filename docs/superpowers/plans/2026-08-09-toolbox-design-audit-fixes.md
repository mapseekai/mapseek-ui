# Toolbox Design Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve every Toolbox mismatch confirmed by the 2026-08-09 `DESIGN.md` and browser audit without changing the controlled component ownership model.

**Architecture:** Keep `Toolbox` controlled and fix semantics, validation markup, responsive layout, RTL, and primitive usage inside the existing block files. Resolve the inherited passive-alert color/announcement issue in the shared `Alert` primitive, then lock the Showcase state boundary with the existing docs visual QA harness.

**Tech Stack:** React 19, TypeScript, Base UI, shadcn-style registry primitives, Tailwind CSS v4, Vitest, Playwright.

## Global Constraints

- Preserve the public `Toolbox`, `ToolboxProps`, `ToolboxTool`, `ToolboxTab`, and `ToolboxLabels` names.
- Keep the panel controlled: callers own query, tabs, favorites, recents, active tool, parameters, and completion state.
- Use only semantic tokens and existing Button/Field/Alert variants; no new dependency, radius, shadow, or color literal.
- Keep the stable `360px` desktop width and independently scrolling `560px` panel body.
- Preserve unrelated working-tree changes in RasterStylePanel files and tests.

---

### Task 1: Make Alert passive state semantic

**Files:**
- Create: `registry/ui/alert.test.tsx`
- Modify: `registry/ui/alert.tsx`
- Modify: `showcase/src/showcases/AlertShowcase.tsx`
- Modify: `TODO.md`

**Interfaces:**
- Consumes: existing `Alert`, `AlertTitle`, and `AlertDescription` exports.
- Produces: default alerts using the semantic info palette and implicit polite `status`; destructive alerts retain assertive `alert` semantics.

- [ ] **Step 1: Write failing Alert behavior tests**

```tsx
expect(renderToStaticMarkup(<Alert>Ready</Alert>)).toContain('role="status"')
expect(renderToStaticMarkup(<Alert>Ready</Alert>)).toContain('border-info/30')
expect(renderToStaticMarkup(<Alert variant="destructive">Failed</Alert>)).toContain('role="alert"')
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm exec vitest run --exclude '.worktrees/**' registry/ui/alert.test.tsx`

Expected: FAIL because the current default Alert uses primary green and every variant has `role="alert"`.

- [ ] **Step 3: Implement semantic default and role selection**

Set the default variant to `border-info/30 bg-info/10 text-info`. Destructure `role` and use `role ?? (variant === "destructive" ? "alert" : "status")`; preserve explicit caller overrides. Mark Showcase icons decorative and close `TODO #57` with the chosen info-token resolution.

- [ ] **Step 4: Run the Alert tests and verify GREEN**

Run: `pnpm exec vitest run --exclude '.worktrees/**' registry/ui/alert.test.tsx`

- [ ] **Step 5: Commit Task 1**

```bash
git add registry/ui/alert.tsx registry/ui/alert.test.tsx showcase/src/showcases/AlertShowcase.tsx TODO.md
git commit -m "fix(alert): use semantic passive status treatment"
```

### Task 2: Fix Toolbox semantics, validation, responsive layout, and control scale

**Files:**
- Modify: `registry/blocks/toolbox/Toolbox.tsx`
- Modify: `registry/blocks/toolbox/Toolbox.test.tsx`
- Modify: `registry/blocks/toolbox/ToolList.tsx`
- Modify: `registry/blocks/toolbox/ToolList.test.tsx`
- Modify: `registry/blocks/toolbox/ToolDetail.tsx`
- Create: `registry/blocks/toolbox/ToolDetail.test.tsx`
- Modify: `registry/blocks/toolbox/types.ts`
- Modify: `registry/blocks/toolbox/labels.ts`
- Modify: `registry/blocks/toolbox/labels.test.ts`

**Interfaces:**
- Consumes: `Button` sizes `sm`/`icon-sm`, `Field` validation attributes, `FieldError`, `Alert`, React `useId`.
- Produces: an aria-named Toolbox landmark, a real `h2` panel title, unique field IDs, explicit empty-distance validation, one-column quick access below `sm`, equal 28px header actions, mirrored RTL back icon, and reduced-motion-safe color transitions.

- [ ] **Step 1: Add failing semantic and responsive tests**

Extend `Toolbox.test.tsx` to require `aria-label="工具箱"`. Extend `ToolList.test.tsx` to require `<h2>`, `grid-cols-1 sm:grid-cols-2`, and `motion-reduce:transition-none` on both color transitions.

- [ ] **Step 2: Add failing ToolDetail behavior tests**

Render the real component and assert: empty distance exposes `data-invalid`, `aria-invalid`, `required`, and localized error copy; valid distance shows the passive status; two rendered details have unique field IDs; all three header controls use the 28px scale; the back icon carries `rtl:rotate-180`.

- [ ] **Step 3: Run Toolbox tests and verify RED**

Run: `pnpm exec vitest run --exclude '.worktrees/**' registry/blocks/toolbox/Toolbox.test.tsx registry/blocks/toolbox/ToolList.test.tsx registry/blocks/toolbox/ToolDetail.test.tsx registry/blocks/toolbox/labels.test.ts`

Expected: FAIL for each missing audit contract.

- [ ] **Step 4: Implement minimal Toolbox fixes**

Add `aria-label={labels.title}` to the `aside`; render the list title as `h2`; collapse quick access with `grid-cols-1 sm:grid-cols-2`; add reduced-motion transition guards; replace local close sizing with `icon-sm`; align back/favorite/close to 28px; mirror the back arrow in RTL; use `useId()` for field/error IDs; remove muted color overrides from required labels; add `distanceRequired` to injected labels; connect `Field data-invalid`, `Input required aria-invalid aria-describedby`, and `FieldError`; render the valid Alert only when the distance is non-empty.

- [ ] **Step 5: Run Toolbox tests and verify GREEN**

Run the Task 2 command again and require every test to pass.

- [ ] **Step 6: Commit Task 2**

```bash
git add registry/blocks/toolbox
git commit -m "fix(toolbox): align semantics and responsive states"
```

### Task 3: Keep Showcase completion state truthful and extend browser acceptance

**Files:**
- Modify: `showcase/src/showcases/ToolboxShowcase.tsx`
- Modify: `scripts/docs-visual-qa.ts`
- Regenerate: `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`

**Interfaces:**
- Consumes: existing controlled `onDistanceChange`/`completed` props and `assertBlockInteraction` Playwright harness.
- Produces: parameter edits clear stale completion state; docs QA verifies landmark naming, responsive columns, invalid/valid state, equal header controls, RTL mirroring, and completion reset.

- [ ] **Step 1: Add a failing Toolbox browser interaction case**

Add `if (block === "toolbox")` assertions to `assertBlockInteraction`: clear the distance and expect the required error with a disabled Run button; fill a value, run, then edit it and expect the completion status to disappear. Include landmark name and header control-size assertions.

- [ ] **Step 2: Run the focused visual case and verify RED**

Run the existing docs visual command filtered to Toolbox when supported; otherwise run the local Playwright audit script against `/blocks/toolbox/`. Expected: FAIL because the completion message remains after editing.

- [ ] **Step 3: Implement completion reset**

Replace `onDistanceChange={setDistance}` with a callback that sets the next distance and clears `completed`.

- [ ] **Step 4: Regenerate embedded Showcase source**

Run: `pnpm run docs:sources`

- [ ] **Step 5: Run browser verification and verify GREEN**

Verify Chinese and English paths, light/dark themes, 390px width, RTL arrow transform, no horizontal overflow, and no browser errors.

- [ ] **Step 6: Commit Task 3**

```bash
git add showcase/src/showcases/ToolboxShowcase.tsx scripts/docs-visual-qa.ts packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts
git commit -m "test(toolbox): cover design acceptance states"
```

### Task 4: Final verification

**Files:**
- Verify only; do not modify unrelated working-tree files.

- [ ] **Step 1: Run focused tests and formatting**

Run Toolbox, Alert, registry composition, docs coverage, and rename tests with `.worktrees/**` excluded; run Biome on only changed files.

- [ ] **Step 2: Run type and registry checks**

Run `pnpm run typecheck`, `pnpm run registry:validate`, `pnpm run registry:build`, `pnpm run docs:check-i18n`, and `pnpm run docs:check-examples`.

- [ ] **Step 3: Run docs build and browser acceptance**

Run `pnpm run docs:build` and repeat the Toolbox page interaction audit at desktop, 390px, dark mode, and RTL.

- [ ] **Step 4: Confirm repository boundaries**

Verify `git status --short` contains only the pre-existing RasterStylePanel changes and `git diff --check` is clean.

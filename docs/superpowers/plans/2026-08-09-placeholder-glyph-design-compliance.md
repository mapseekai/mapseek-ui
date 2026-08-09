# PlaceholderGlyph Design Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make PlaceholderGlyph and its Showcase conform to the approved accessibility, stroke, typography, and state contracts in `DESIGN.md`.

**Architecture:** Keep the deterministic shape generator intact. Add one opt-in accessible-name prop at the SVG boundary, keep existing named-container usages decorative, and give the standalone detail preview an injected resource title. Verify the public component with server-rendered unit tests and the acceptance surface with Playwright-based docs QA.

**Tech Stack:** React 19, TypeScript, Vitest server rendering, Tailwind CSS v4 design tokens, Playwright, shadcn/Base UI Button.

## Global Constraints

- `PlaceholderGlyph` is decorative unless the caller supplies a localized `title`.
- A titled glyph uses `role="img"`, a unique title ID, and `aria-labelledby`.
- SVG viewBox stroke width is always `2`, independent of rendered `size`.
- Showcase text uses declared typography utilities; size captions use tabular numerals.
- Preserve semantic colors, zero radius, 1px boundaries, dark mode, RTL neutrality, and narrow-width behavior.
- Do not change deterministic seed-to-shape mapping.

---

### Task 1: SVG accessibility and stroke contract

**Files:**
- Create: `registry/blocks/placeholder-glyph/PlaceholderGlyph.test.tsx`
- Modify: `registry/blocks/placeholder-glyph/PlaceholderGlyph.tsx`
- Modify: `registry/blocks/resource-detail-drawer/ResourceDetailDrawer.tsx`

**Interfaces:**
- Produces: `PlaceholderGlyphProps.title?: string`
- Preserves: `size?: number`, `seed?: string`, `mono?: boolean`, `className?: string`
- Consumes: `ResourceDetailDrawer`'s existing localized `detail.title`

- [ ] **Step 1: Write failing component tests**

```tsx
it("is decorative by default", () => {
  const html = renderToStaticMarkup(<PlaceholderGlyph seed="layer" />)
  expect(html).toContain('aria-hidden="true"')
  expect(html).not.toContain("<title")
})

it("uses injected titles as unique accessible names", () => {
  const html = renderToStaticMarkup(
    <>
      <PlaceholderGlyph seed="layer" title="图层" />
      <PlaceholderGlyph seed="search" title="Search" />
    </>,
  )
  const labelledBy = [...html.matchAll(/aria-labelledby="([^"]+)"/g)].map((match) => match[1])
  expect(labelledBy).toHaveLength(2)
  expect(new Set(labelledBy).size).toBe(2)
  expect(html).toContain("<title")
  expect(html).toContain(">图层</title>")
  expect(html).toContain(">Search</title>")
})

it("keeps viewBox stroke width constant across rendered sizes", () => {
  const small = renderToStaticMarkup(<PlaceholderGlyph size={16} />)
  const large = renderToStaticMarkup(<PlaceholderGlyph size={72} />)
  expect(small).toContain('stroke-width="2"')
  expect(large).toContain('stroke-width="2"')
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec vitest run --exclude '.worktrees/**' registry/blocks/placeholder-glyph/PlaceholderGlyph.test.tsx`

Expected: failures for the generic title, missing `title` prop behavior, and size-dependent stroke width.

- [ ] **Step 3: Implement the minimal component contract**

```tsx
import { type ReactNode, useId } from "react"

export interface PlaceholderGlyphProps {
  size?: number
  seed?: string
  mono?: boolean
  title?: string
  className?: string
}

const titleId = useId()
const props = {
  "aria-hidden": title ? undefined : true,
  "aria-labelledby": title ? titleId : undefined,
  role: title ? "img" : undefined,
  strokeWidth: 2,
}

<svg {...props}>
  {title ? <title id={titleId}>{title}</title> : null}
  {children}
</svg>
```

Pass `title={detail.title}` only to the main fallback preview at `ResourceDetailDrawer.tsx:111`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm exec vitest run --exclude '.worktrees/**' registry/blocks/placeholder-glyph/PlaceholderGlyph.test.tsx`

Expected: all PlaceholderGlyph component tests pass.

- [ ] **Step 5: Commit the component contract**

```bash
git add registry/blocks/placeholder-glyph/PlaceholderGlyph.tsx registry/blocks/placeholder-glyph/PlaceholderGlyph.test.tsx registry/blocks/resource-detail-drawer/ResourceDetailDrawer.tsx
git commit -m "fix(placeholder-glyph): correct svg semantics"
```

### Task 2: Showcase semantics, typography, and visual regression

**Files:**
- Modify: `scripts/docs-visual-qa.ts`
- Modify: `showcase/src/showcases/PlaceholderGlyphShowcase.tsx`

**Interfaces:**
- Consumes: `PlaceholderGlyph` decorative default from Task 1
- Produces: an accessible tone toggle and token-aligned preview captions

- [ ] **Step 1: Extend browser QA before changing the Showcase**

Inside the `placeholder-glyph` interaction case, assert:

```tsx
const toggle = demo.locator('[data-demo-action="placeholder-glyph-toggle"]')
const status = demo.locator('[data-demo-status="placeholder-glyph"]')
await expect(demo.getByRole("img")).toHaveCount(0)
await expect(demo.locator("svg title")).toHaveCount(0)
await expect(toggle).toHaveAttribute("aria-pressed", "false")
await expect(status).toHaveAttribute("role", "status")
await expect(status).toHaveCSS("font-size", "11px")
for (const caption of await demo.locator('[data-demo-caption="placeholder-glyph"]').all()) {
  await expect(caption).toHaveCSS("font-size", "11px")
}
await toggle.click()
await expect(toggle).toHaveAttribute("aria-pressed", "true")
```

- [ ] **Step 2: Run docs visual QA and verify RED**

Run: `pnpm exec tsx scripts/docs-visual-qa.ts --category block --only placeholder-glyph --base-url http://localhost:3000`

Expected: failure because the current toggle lacks `aria-pressed` and captions render at 9px/10px/12px.

- [ ] **Step 3: Implement Showcase semantics and design tokens**

```tsx
<Button aria-pressed={mono} ...>{demoLabels.toggleTone}</Button>
<span role="status" className="text-body-sm text-muted-foreground">...</span>
<span data-demo-caption="placeholder-glyph" className="text-body-sm text-foreground">...</span>
<span data-demo-caption="placeholder-glyph" className="tnum text-body-sm text-foreground">...</span>
```

- [ ] **Step 4: Run docs visual QA and verify GREEN**

Run: `pnpm exec tsx scripts/docs-visual-qa.ts --category block --only placeholder-glyph --base-url http://localhost:3000`

Expected: the block passes in Chinese and English, light and dark themes, desktop and mobile viewports.

- [ ] **Step 5: Commit the Showcase contract**

```bash
git add scripts/docs-visual-qa.ts showcase/src/showcases/PlaceholderGlyphShowcase.tsx
git commit -m "test(placeholder-glyph): enforce showcase design states"
```

### Task 3: Bilingual docs, generated source, and final verification

**Files:**
- Modify: `packages/docs/content/docs/blocks/placeholder-glyph.mdx`
- Modify: `packages/docs/content/docs/blocks/placeholder-glyph.en.mdx`
- Modify: `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`
- Modify: `TODO.md`

**Interfaces:**
- Documents: `title?: string`, decorative default, and named-image opt-in
- Regenerates: `showcaseSources["placeholder-glyph"]`

- [ ] **Step 1: Update both docs and the tracked audit item**

Document that untitled glyphs are decorative and that meaningful standalone previews pass a localized `title`. Add `title` to the props list. Remove PlaceholderGlyph from the remaining non-injectable-copy count in audit item 60 while preserving the other outstanding files.

- [ ] **Step 2: Regenerate Showcase source**

Run: `pnpm run docs:sources`

Expected: the generated PlaceholderGlyph Showcase entry contains `aria-pressed`, `role="status"`, and token typography.

- [ ] **Step 3: Run focused and repository verification**

Run:

```bash
pnpm exec biome check registry/blocks/placeholder-glyph/PlaceholderGlyph.tsx registry/blocks/placeholder-glyph/PlaceholderGlyph.test.tsx registry/blocks/resource-detail-drawer/ResourceDetailDrawer.tsx showcase/src/showcases/PlaceholderGlyphShowcase.tsx scripts/docs-visual-qa.ts TODO.md
pnpm run typecheck
pnpm exec vitest run --exclude '.worktrees/**'
pnpm run registry:validate
pnpm run docs:check-i18n
pnpm run docs:check-examples
pnpm run docs:build
pnpm exec tsx scripts/docs-visual-qa.ts --category block --only placeholder-glyph
git diff --check
```

Expected: all commands pass; if full-repository Biome is blocked by an unrelated nested worktree configuration, retain the clean focused Biome result and report the external blocker exactly.

- [ ] **Step 4: Commit documentation and generated source**

```bash
git add packages/docs/content/docs/blocks/placeholder-glyph.mdx packages/docs/content/docs/blocks/placeholder-glyph.en.mdx packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts TODO.md
git commit -m "docs(placeholder-glyph): document accessible fallback usage"
```

## Plan self-review

- Spec coverage: component semantics, consumer labeling, stroke, Showcase state, typography, docs, generation, and browser QA are each assigned to a task.
- Placeholder scan: no incomplete requirement or unspecified implementation step remains.
- Type consistency: the only new public prop is `title?: string`, used consistently by the component, consumer, tests, and docs.


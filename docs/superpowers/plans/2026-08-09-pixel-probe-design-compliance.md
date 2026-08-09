# PixelProbe Design Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `PixelProbe` and its bilingual showcase into full compliance with `DESIGN.md`, including accessible semantics, primitive reuse, robust empty and navigation states, long-value handling, and narrow-screen behavior.

**Architecture:** Keep `PixelProbe` controlled and read-only. Extend its injected label and disabled-state contracts, compose the existing `Tag`, `Empty`, `CopyButton`, and `IconButton` primitives, and keep demo-only state in `PixelProbeDemo`. Protect component behavior with server-rendered Vitest tests and protect showcase interaction and geometry with the existing Playwright visual QA path.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4 semantic tokens, Vitest, React server rendering, Playwright, pnpm, Mapseek registry primitives.

## Global Constraints

- Every visible or assistive string remains caller-injected in both Chinese and English; do not add hardcoded fallback copy.
- `PixelProbeLabels.empty` and `PixelProbeLabels.locked` are required fields.
- `PixelProbeProps.prevDisabled` and `PixelProbeProps.nextDisabled` are optional booleans.
- The component stays square, border-first, shadowless, and theme-token driven.
- Field types, enum values, and passive count metadata use gray `Tag` primitives.
- Empty data uses `Empty`, `EmptyHeader`, and `EmptyTitle`.
- Previous and next controls render only with their matching callback and cannot move outside the one-based `1..count` range.
- Below 640px, the demo panel keeps 16px horizontal stage insets; at 640px and above it uses a stable 340px width.
- Use TDD for production behavior: write each test first, run it, and confirm the expected failure before implementation.
- Do not modify or revert unrelated working-tree changes.

---

### Task 1: Accessible field structure, primitives, empty state, and overflow

**Files:**

- Create: `registry/blocks/pixel-probe/PixelProbe.test.tsx`
- Modify: `registry/blocks/pixel-probe/types.ts:15-38`
- Modify: `registry/blocks/pixel-probe/PixelProbe.tsx:1-120`
- Modify: `registry/blocks/pixel-probe/fragment.json:1-29`
- Modify: `registry/blocks/registry.json:898-923`

**Interfaces:**

- Consumes: `Tag`, `Empty`, `EmptyHeader`, `EmptyTitle`, `CopyButton`, `IconButton`, and `cn` from the existing registry.
- Produces: required `PixelProbeLabels.empty: string`, required `PixelProbeLabels.locked: string`, a named `<section>`, semantic `dl`/`dt`/`dd` field markup, a component-owned empty state, and a horizontally scrollable value region.

- [ ] **Step 1: Add failing tests for semantic structure and primitive reuse**

Create `registry/blocks/pixel-probe/PixelProbe.test.tsx` with literal labels and real server-rendered markup:

```tsx
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PixelProbe } from "./PixelProbe"
import type { PixelProbeLabels } from "./types"

const labels: PixelProbeLabels = {
  title: "Pixel probe",
  copy: "Copy JSON",
  copied: "Copied",
  close: "Close",
  prev: "Previous pixel",
  next: "Next pixel",
  pointPrefix: "PT",
  empty: "No selected pixel",
  locked: "Locked",
}

describe("PixelProbe", () => {
  it("exposes a named section and semantic field relationships", () => {
    const html = renderToStaticMarkup(
      <PixelProbe
        labels={labels}
        count={2}
        fields={[
          { key: "band", type: "INT", value: "1 / 1", locked: true },
          { key: "colormap", type: "ENUM", value: "viridis" },
        ]}
      />,
    )

    expect(html).toContain('<section')
    expect(html).toContain('aria-label="Pixel probe"')
    expect(html).toContain("<dl")
    expect(html).toContain("<dt")
    expect(html).toContain("<dd")
    expect(html).toContain('data-slot="tag"')
    expect(html).toContain('data-color="gray"')
    expect(html).toContain('data-size="sm"')
    expect(html).toContain('<span class="sr-only">Locked</span>')
    expect(html.match(/<svg[^>]*aria-hidden="true"/g)).toHaveLength(2)
  })

  it("renders the injected empty state inside the panel", () => {
    const html = renderToStaticMarkup(<PixelProbe labels={labels} fields={[]} />)

    expect(html).toContain('data-slot="empty"')
    expect(html).toContain('data-slot="empty-header"')
    expect(html).toContain('data-slot="empty-title"')
    expect(html).toContain("No selected pixel")
    expect(html).toContain("Pixel probe")
  })

  it("keeps long values scrollable without moving their unit", () => {
    const html = renderToStaticMarkup(
      <PixelProbe
        labels={labels}
        fields={[
          {
            key: "identifier",
            type: "TEXT",
            value: "a-very-long-raster-identifier-that-must-remain-selectable",
            unit: "m",
          },
        ]}
      />,
    )

    expect(html).toContain("min-w-0 flex-1 overflow-x-auto whitespace-nowrap")
    expect(html).toContain("shrink-0")
    expect(html).not.toContain("overflow-x-hidden")
  })
})
```

The first test catches replacement of semantic field relationships, loss of the accessible lock label, decorative icons leaking into the accessibility tree, or regression to custom chips. The empty test catches delegation of empty state back to the caller. The overflow test catches clipping long data or allowing the unit to scroll away.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm vitest run registry/blocks/pixel-probe/PixelProbe.test.tsx
```

Expected: TypeScript or render assertions fail because `empty` and `locked` are not in `PixelProbeLabels`, the root is a `div`, fields lack `dl`/`dt`/`dd`, custom chips are used, the empty composition is absent, and the body hides horizontal overflow.

- [ ] **Step 3: Extend the label contract and replace custom markup**

In `types.ts`, add the required labels exactly:

```ts
export interface PixelProbeLabels {
  title: string
  copy: string
  copied?: string
  close: string
  prev: string
  next: string
  pointPrefix: string
  empty: string
  locked: string
}
```

In `PixelProbe.tsx`:

```tsx
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Tag } from "@/components/ui/tag"
```

Implement the field row as a `div` owned by a parent `dl`, with its label in `dt` and value in `dd`:

```tsx
function FieldRow({ field, lockedLabel }: { field: PixelField; lockedLabel: string }) {
  const isEnum = field.type === "ENUM"

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="flex min-w-0 items-center gap-1.5">
        <span className="font-mono text-label-md uppercase text-muted-foreground">
          {field.key}
        </span>
        <Tag color="gray" size="sm">{field.type}</Tag>
        {field.locked && (
          <span className="ml-auto inline-flex text-muted-foreground">
            <IconLock aria-hidden="true" size={14} stroke={1.75} />
            <span className="sr-only">{lockedLabel}</span>
          </span>
        )}
      </dt>
      <dd className="flex h-7 min-w-0 items-center gap-2 border border-border bg-muted px-2 text-body-md text-foreground select-text">
        <div className={cn("min-w-0 flex-1 overflow-x-auto whitespace-nowrap", !isEnum && "font-mono tabular-nums")}>
          {isEnum ? <Tag color="gray">{field.value}</Tag> : field.value}
        </div>
        {field.unit && (
          <span className="shrink-0 font-mono text-label-md text-muted-foreground">
            {field.unit}
          </span>
        )}
      </dd>
    </div>
  )
}
```

Use a named root section and component-owned empty body:

```tsx
<section
  aria-label={labels.title}
  data-testid="pixel-probe"
  className={cn("flex min-w-0 flex-col overflow-hidden border border-border bg-card", className)}
>
  {/* header */}
  {fields.length === 0 ? (
    <Empty className="min-h-24 p-4">
      <EmptyHeader>
        <EmptyTitle>{labels.empty}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  ) : (
    <dl className="flex min-w-0 flex-col gap-2.5 overflow-y-auto px-3 py-2.5">
      {fields.map((field) => (
        <FieldRow key={field.key} field={field} lockedLabel={labels.locked} />
      ))}
    </dl>
  )}
</section>
```

Replace the type chip, enum chip, and count chip with gray `Tag` instances. Give the count and point index `tabular-nums`. Set `aria-hidden="true"`, `size={14}`, and `stroke={1.75}` on direct Tabler icons. Replace `gap-[3px]` with `gap-1` and `text-[10px]` with existing label/body tokens.

Add registry dependencies to both manifests without changing their order beyond the new entries:

```json
"registryDependencies": [
  "@mapseek/copy-button",
  "@mapseek/empty",
  "@mapseek/icon-button",
  "@mapseek/tag",
  "@mapseek/tooltip",
  "@mapseek/utils"
]
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
pnpm vitest run registry/blocks/pixel-probe/PixelProbe.test.tsx
```

Expected: PASS with no warnings.

- [ ] **Step 5: Commit the semantic and primitive refactor**

```bash
git add registry/blocks/pixel-probe/PixelProbe.test.tsx registry/blocks/pixel-probe/PixelProbe.tsx registry/blocks/pixel-probe/types.ts registry/blocks/pixel-probe/fragment.json registry/blocks/registry.json
git commit -m "fix(pixel-probe): use accessible display primitives"
```

### Task 2: Navigation visibility and boundary states

**Files:**

- Modify: `registry/blocks/pixel-probe/PixelProbe.test.tsx`
- Modify: `registry/blocks/pixel-probe/types.ts:25-38`
- Modify: `registry/blocks/pixel-probe/PixelProbe.tsx:50-120`

**Interfaces:**

- Consumes: `index?: number`, `count?: number`, `onPrev?: () => void`, and `onNext?: () => void`.
- Produces: `prevDisabled?: boolean`, `nextDisabled?: boolean`, omission of callback-less buttons, and automatic one-based boundary disabling.

- [ ] **Step 1: Add failing navigation tests**

Append helpers and tests to `PixelProbe.test.tsx`:

```tsx
function buttonTag(html: string, accessibleName: string) {
  const match = html.match(new RegExp(`<button[^>]*aria-label="${accessibleName}"[^>]*>`))
  expect(match, `button ${accessibleName}`).not.toBeNull()
  return match?.[0] ?? ""
}

it("omits navigation buttons whose callbacks are missing", () => {
  const html = renderToStaticMarkup(
    <PixelProbe labels={labels} fields={[]} index={2} count={3} />,
  )

  expect(html).not.toContain('aria-label="Previous pixel"')
  expect(html).not.toContain('aria-label="Next pixel"')
  expect(html).toContain("PT")
  expect(html).toContain(">2<")
})

it("disables navigation at one-based count boundaries", () => {
  const first = renderToStaticMarkup(
    <PixelProbe labels={labels} fields={[]} index={1} count={3} onPrev={() => {}} onNext={() => {}} />,
  )
  const last = renderToStaticMarkup(
    <PixelProbe labels={labels} fields={[]} index={3} count={3} onPrev={() => {}} onNext={() => {}} />,
  )

  expect(buttonTag(first, labels.prev)).toContain("disabled")
  expect(buttonTag(first, labels.next)).not.toContain("disabled")
  expect(buttonTag(last, labels.prev)).not.toContain("disabled")
  expect(buttonTag(last, labels.next)).toContain("disabled")
})

it("honors explicit navigation disabled states", () => {
  const html = renderToStaticMarkup(
    <PixelProbe
      labels={labels}
      fields={[]}
      index={2}
      count={3}
      prevDisabled
      nextDisabled
      onPrev={() => {}}
      onNext={() => {}}
    />,
  )

  expect(buttonTag(html, labels.prev)).toContain("disabled")
  expect(buttonTag(html, labels.next)).toContain("disabled")
})
```

These tests catch enabled no-op buttons, zero/one-based boundary mistakes, and loss of explicit caller-controlled disabling.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
pnpm vitest run registry/blocks/pixel-probe/PixelProbe.test.tsx
```

Expected: FAIL because callback-less navigation buttons still render and the new disabled props do not exist.

- [ ] **Step 3: Add disabled props and boundary derivation**

Add to `PixelProbeProps`:

```ts
prevDisabled?: boolean
nextDisabled?: boolean
```

Destructure the props and derive state in `PixelProbe`:

```ts
const showFooter = onPrev != null || onNext != null || index != null
const isPrevDisabled = prevDisabled || (index != null && index <= 1)
const isNextDisabled =
  nextDisabled || (index != null && count != null && index >= count)
```

Render each button only with its callback and pass the derived disabled state:

```tsx
{onPrev && (
  <IconButton
    size="xs"
    label={labels.prev}
    tooltip
    disabled={isPrevDisabled}
    onClick={onPrev}
  >
    <IconChevronLeft aria-hidden="true" stroke={1.75} />
  </IconButton>
)}
{index != null && (
  <span className="font-mono text-label-md tabular-nums text-muted-foreground">
    {labels.pointPrefix} {index}
  </span>
)}
{onNext && (
  <IconButton
    size="xs"
    label={labels.next}
    tooltip
    disabled={isNextDisabled}
    onClick={onNext}
  >
    <IconChevronRight aria-hidden="true" stroke={1.75} />
  </IconButton>
)}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
pnpm vitest run registry/blocks/pixel-probe/PixelProbe.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit navigation behavior**

```bash
git add registry/blocks/pixel-probe/PixelProbe.test.tsx registry/blocks/pixel-probe/PixelProbe.tsx registry/blocks/pixel-probe/types.ts
git commit -m "fix(pixel-probe): enforce navigation boundaries"
```

### Task 3: Responsive showcase and live interaction feedback

**Files:**

- Create: `showcase/src/showcases/PixelProbeShowcase.test.tsx`
- Modify: `showcase/src/showcases/PixelProbeShowcase.tsx:1-150`
- Modify: `scripts/docs-visual-qa.ts:2228-2272`

**Interfaces:**

- Consumes: the Task 1 and Task 2 `PixelProbe` API.
- Produces: three bounded sample points, a component-owned empty state demo, 16px mobile stage insets, a 340px desktop panel, and polite live status output.

- [ ] **Step 1: Add a failing static showcase test**

Create `showcase/src/showcases/PixelProbeShowcase.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { PixelProbeDemo } from "./PixelProbeShowcase"

describe("PixelProbeDemo", () => {
  it("starts within the mobile stage inset with bounded navigation and polite status", () => {
    const html = renderToStaticMarkup(<PixelProbeDemo locale="en" />)

    expect(html).toContain("left-4")
    expect(html).toContain("right-4")
    expect(html).toContain("w-auto")
    expect(html).toContain("sm:left-auto")
    expect(html).toContain("sm:w-[340px]")
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain(">3<")
    expect(html).toContain('aria-label="Previous pixel"')
    expect(html).toMatch(/<button[^>]*aria-label="Previous pixel"[^>]*disabled/)
  })
})
```

This test catches regression to a fixed 340px mobile width, an unbounded one-item example, or a silent status region.

- [ ] **Step 2: Run the showcase test and verify RED**

Run:

```bash
pnpm vitest run showcase/src/showcases/PixelProbeShowcase.test.tsx
```

Expected: FAIL because the demo uses only `right-4 w-[340px]`, count `1`, and status spans without `aria-live`.

- [ ] **Step 3: Implement responsive and bounded demo state**

Add `empty` and `locked` to both localized `labels` objects. Use a local `const pointCount = 3`. Always render `PixelProbe`, passing `fields={empty ? [] : clonedFields}`, `count={pointCount}`, and clamped callbacks:

```tsx
<PixelProbe
  className="absolute top-4 right-4 left-4 max-h-[calc(100%-32px)] w-auto sm:left-auto sm:w-[340px]"
  fields={empty ? [] : demoLabels.fields.map((field) => ({ ...field }))}
  count={pointCount}
  index={point}
  labels={demoLabels.labels}
  onCopy={() => setStatus(demoLabels.copied)}
  onClose={() => {
    setClosed(true)
    setStatus(demoLabels.closed)
  }}
  onPrev={() => {
    setPoint((current) => {
      const nextPoint = Math.max(1, current - 1)
      setStatus(`${demoLabels.statusPrefix} ${nextPoint}`)
      return nextPoint
    })
  }}
  onNext={() => {
    setPoint((current) => {
      const nextPoint = Math.min(pointCount, current + 1)
      setStatus(`${demoLabels.statusPrefix} ${nextPoint}`)
      return nextPoint
    })
  }}
/>
```

Remove the external custom empty card. Add `aria-live="polite"` and `aria-atomic="true"` to both status spans. Keep the existing `data-demo-status="pixel-probe"` selector.

- [ ] **Step 4: Run the showcase test and verify GREEN**

Run:

```bash
pnpm vitest run showcase/src/showcases/PixelProbeShowcase.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Tighten the existing Playwright visual QA contract**

Update the `pixel-probe` branch in `scripts/docs-visual-qa.ts` to:

- locate the empty state with `probe.locator('[data-slot="empty"]')` instead of the removed external `data-demo-empty` node;
- assert the status has `aria-live="polite"`;
- assert the previous button is initially disabled;
- advance to point 3, assert the next button becomes disabled, click it, and confirm the status remains `Pixel 3` / `像元 3`;
- when viewport width is below 640px, compare `probe.boundingBox()` to `stage.boundingBox()` and require both horizontal insets to be between 15px and 17px;
- retain the existing square/shadow, copy feedback, close/reopen, and empty-state assertions.

Use accessible button lookup so button order changes cannot break the test:

```ts
const previous = probe.getByRole("button", {
  name: localized(path, "上一个像元", "Previous pixel"),
})
const next = probe.getByRole("button", {
  name: localized(path, "下一个像元", "Next pixel"),
})

await expect(previous).toBeDisabled()
await next.click()
await next.click()
await expect(next).toBeDisabled()
await next.click({ force: true })
await expect(demo.locator('[data-demo-status="pixel-probe"]')).toContainText(
  localized(path, "像元 3", "Pixel 3"),
)
```

- [ ] **Step 6: Run focused unit tests and commit showcase behavior**

Run:

```bash
pnpm vitest run registry/blocks/pixel-probe/PixelProbe.test.tsx showcase/src/showcases/PixelProbeShowcase.test.tsx
```

Expected: PASS.

Commit:

```bash
git add showcase/src/showcases/PixelProbeShowcase.test.tsx showcase/src/showcases/PixelProbeShowcase.tsx scripts/docs-visual-qa.ts
git commit -m "fix(pixel-probe): make showcase responsive and bounded"
```

### Task 4: Bilingual docs, generated source, and complete verification

**Files:**

- Modify: `packages/docs/content/docs/blocks/pixel-probe.mdx:13-54`
- Modify: `packages/docs/content/docs/blocks/pixel-probe.en.mdx:13-54`
- Regenerate: `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`

**Interfaces:**

- Consumes: final public API and showcase from Tasks 1–3.
- Produces: synchronized Chinese and English API guidance plus generated showcase source matching the edited demo.

- [ ] **Step 1: Update both documentation pages**

Document the following in matching Chinese and English sections:

- `labels.empty` and `labels.locked` are required localized strings;
- `prevDisabled` and `nextDisabled` are optional caller overrides;
- missing `onPrev` or `onNext` omits the matching control;
- `index <= 1` disables previous and `index >= count` disables next;
- `fields={[]}` renders the built-in empty state while preserving the header;
- long values scroll inside the value box without moving the unit;
- the demo uses 16px narrow-screen insets and a 340px panel when space permits;
- field semantics and locked/empty state text are exposed to assistive technology.

Update the key-props lists exactly:

```md
`fields`, `count`, `index`, `labels`, `prevDisabled`, `nextDisabled`, `onCopy`, `onClose`, `onPrev`, `onNext`, and `className`
```

- [ ] **Step 2: Regenerate showcase source**

Run:

```bash
pnpm run docs:sources
```

Expected: `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts` changes only in the `pixel-probe` source entry.

- [ ] **Step 3: Run formatting and targeted validation**

Run:

```bash
pnpm exec biome check --write registry/blocks/pixel-probe showcase/src/showcases/PixelProbeShowcase.tsx showcase/src/showcases/PixelProbeShowcase.test.tsx packages/docs/content/docs/blocks/pixel-probe.mdx packages/docs/content/docs/blocks/pixel-probe.en.mdx scripts/docs-visual-qa.ts
pnpm vitest run registry/blocks/pixel-probe/PixelProbe.test.tsx showcase/src/showcases/PixelProbeShowcase.test.tsx
pnpm run typecheck
pnpm run registry:validate
pnpm run docs:check-i18n
pnpm run docs:check-examples
pnpm run showcase:build
```

Expected: every command exits 0 with no warnings introduced by PixelProbe.

- [ ] **Step 4: Run browser and visual verification**

Ensure the docs server is built and run the existing visual suite:

```bash
pnpm run docs:build
pnpm run docs:visual
```

Then inspect `/blocks/pixel-probe/` at 390px and desktop widths in light and dark themes. Confirm:

- no document or component horizontal overflow;
- 16px mobile stage insets;
- visible 3px keyboard focus rings;
- all direct decorative SVGs have `aria-hidden="true"`;
- previous is disabled at point 1 and next is disabled at point 3;
- empty state remains inside the named panel;
- copy status is announced politely;
- border radius is 0 and box shadow is `none`.

- [ ] **Step 5: Review the final diff and commit documentation**

Run:

```bash
git diff --check
git status --short
git diff --stat
```

Confirm only PixelProbe, its tests/showcase/docs, the visual QA case, registry manifests, and generated showcase source changed.

Commit:

```bash
git add packages/docs/content/docs/blocks/pixel-probe.mdx packages/docs/content/docs/blocks/pixel-probe.en.mdx packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts
git commit -m "docs(pixel-probe): document accessible states"
```


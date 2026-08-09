# GeoJSONView Design Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `GeoJSONView` and `JsonViewer` satisfy the approved accessibility, state, localization, motion, sizing, semantic-token, and HTML requirements.

**Architecture:** Keep `GeoJSONView` as the domain wrapper and `JsonViewer` as the reusable primitive. `GeoJSONView` resolves all localized labels and distinguishes fallback states; `JsonViewer` delegates clipboard and disclosure behavior to the existing `CopyButton`, `Button`, and Base UI `CollapsibleTrigger` primitives.

**Tech Stack:** React 19, TypeScript 5.9, Base UI 1.6, shadcn-style registry components, Tailwind CSS v4, Vitest 4, Playwright 1.62.

## Global Constraints

- Preserve every existing `GeoJSONView` and `JsonViewer` prop, including `collapseOn="doubleClick"`.
- Add no npm dependency; reuse `CopyButton`, `Button`, `CollapsibleTrigger`, and semantic theme tokens.
- Keep the toolbar at 32px and every toolbar control at the 24px `xs` tier.
- Chinese defaults remain complete; English and Chinese showcases inject every locale-sensitive label.
- Parse errors use `role="alert"` plus `text-destructive`; unsupported values use `role="status"` plus `text-warning`.
- Do not place block elements or interactive controls inside `<pre>` or `<code>`.
- Preserve unrelated working-tree changes and do not create implementation commits unless the user explicitly requests them.

---

### Task 1: Add and implement distinct GeoJSON fallback states

**Files:**
- Create: `registry/blocks/geojson-view/GeoJSONView.test.tsx`
- Modify: `registry/blocks/geojson-view/labels.ts`
- Modify: `registry/blocks/geojson-view/defaults.ts`
- Modify: `registry/blocks/geojson-view/GeoJSONView.tsx`

**Interfaces:**
- Consumes: existing `GeoJSONViewProps`, `resolveLabels`, and `stringifyGeoJSON` input contract.
- Produces: expanded `GeoJSONViewLabels` and separate empty, parse-error, and unsupported-value rendering.

- [ ] **Step 1: Write failing fallback-state tests**

Create `GeoJSONView.test.tsx` with real server-rendered output:

```tsx
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { GeoJSONView } from "./GeoJSONView"

const labels = {
  expandAll: "Expand all",
  collapseAll: "Collapse all",
  copy: "Copy JSON",
  copied: "Copied JSON",
  item: "entry",
  items: "entries",
  parseError: "GeoJSON could not be parsed",
  unsupportedValue: "GeoJSON must be an object or array",
}

describe("GeoJSONView fallback states", () => {
  it("renders parse failures as an explicit destructive alert", () => {
    const html = renderToStaticMarkup(
      <GeoJSONView json="{ invalid" emptyLabel="No feature" labels={labels} />,
    )
    expect(html).toContain('role="alert"')
    expect(html).toContain("GeoJSON could not be parsed")
    expect(html).toContain("text-destructive")
    expect(html).toContain("{ invalid")
    expect(html).not.toContain("GeoJSON must be an object or array")
  })

  it("renders primitive JSON as a separate warning status", () => {
    const html = renderToStaticMarkup(
      <GeoJSONView json="42" emptyLabel="No feature" labels={labels} />,
    )
    expect(html).toContain('role="status"')
    expect(html).toContain("GeoJSON must be an object or array")
    expect(html).toContain("text-warning")
    expect(html).not.toContain("GeoJSON could not be parsed")
  })

  it("keeps essential empty copy on the normal foreground and valid markup", () => {
    const html = renderToStaticMarkup(
      <GeoJSONView json={null} emptyLabel="No selected feature" labels={labels} />,
    )
    expect(html).toContain("No selected feature")
    expect(html).toContain("text-foreground")
    expect(html).not.toContain("<pre")
  })
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
pnpm exec vitest run registry/blocks/geojson-view/GeoJSONView.test.tsx
```

Expected: TypeScript/render assertions fail because the six new labels and distinct status markup do not exist.

- [ ] **Step 3: Extend the typed label boundary and defaults**

Add `copy`, `copied`, `item`, `items`, `parseError`, and `unsupportedValue` to `GeoJSONViewLabels`; provide these exact Chinese defaults:

```ts
copy: "复制 GeoJSON",
copied: "已复制 GeoJSON",
item: "项",
items: "项",
parseError: "GeoJSON 解析失败",
unsupportedValue: "GeoJSON 必须是对象或数组",
```

- [ ] **Step 4: Implement compact fallback status rendering**

Pass this status shape into `ViewShell` for the two error branches:

```ts
type ViewStatus = {
  label: string
  role: "alert" | "status"
  className: "text-destructive" | "text-warning"
}
```

Use `{ label: labels.parseError, role: "alert", className: "text-destructive" }` in the parse-error branch and `{ label: labels.unsupportedValue, role: "status", className: "text-warning" }` in the primitive branch. Render `status` beside the title with `text-body-sm-medium`.

Replace the fallback `<pre>` with this semantic row shape:

```tsx
<div className="m-0 min-h-0 flex-1 overflow-auto bg-muted/50 px-3.5 py-3 font-mono text-body-sm-medium leading-[1.6] text-foreground [tab-size:2]">
  <div className="grid grid-cols-[32px_1fr] gap-x-3">
    <span className="text-right text-muted-foreground tabular-nums select-none">1</span>
    <code className="whitespace-pre-wrap text-foreground">{emptyLabel}</code>
  </div>
</div>
```

Use the same row structure for source lines, retaining their exact whitespace.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run the Step 2 command and require all three tests to pass without warnings.

---

### Task 2: Replace custom JsonViewer behavior with existing primitives

**Files:**
- Modify: `registry/ui/json-viewer.test.tsx`
- Modify: `registry/ui/json-viewer.tsx`
- Modify: `registry/ui/registry.json`

**Interfaces:**
- Consumes: `CopyButton`, `Button`, `Collapsible`, `CollapsibleContent`, and `CollapsibleTrigger`.
- Produces: `copyLabel`, `copiedLabel`, `itemLabel`, `itemsLabel`, and `copyContent` props; accessible disclosure triggers; localized summaries; motion-safe semantic markup.

- [ ] **Step 1: Write failing real-render tests**

Populate `json-viewer.test.tsx` with server-rendered assertions:

```tsx
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { JsonViewer } from "./json-viewer"

describe("JsonViewer design contract", () => {
  it("uses accessible disclosure and copy primitives with injected copy", () => {
    const html = renderToStaticMarkup(
      <JsonViewer
        data={{ values: [1] }}
        copyContent='{"values":[1]}'
        copyLabel="Copy JSON"
        copiedLabel="Copied JSON"
        itemLabel="entry"
        itemsLabel="entries"
      />,
    )
    expect(html).toContain('data-slot="collapsible-trigger"')
    expect(html).toContain('aria-expanded="true"')
    expect(html).toContain('data-slot="copy-button"')
    expect(html).toContain('aria-label="Copy JSON"')
    expect(html).toContain("1 entry")
  })

  it("uses semantic borders, valid containers, and reduced-motion classes", () => {
    const html = renderToStaticMarkup(<JsonViewer data={{ nested: { value: 1 } }} />)
    expect(html).toContain("border-border")
    expect(html).toContain("motion-reduce:transition-none")
    expect(html).not.toContain("transition-all")
    expect(html).not.toContain("border-[rgba(")
    expect(html).not.toContain("<pre")
    expect(html).not.toContain("<code")
    expect(html).not.toContain("...")
  })
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
pnpm exec vitest run registry/ui/json-viewer.test.tsx
```

Expected: compilation/assertions fail because the injectable copy/count props, primitive composition, semantic border, and valid container structure are missing.

- [ ] **Step 3: Replace the local clipboard state machine**

Remove `IconCheck`, `IconCopy`, copied state, timers, effects, and `copyToClipboard`. Import `CopyButton`, memoize fallback serialized data, and render:

```tsx
<CopyButton
  content={copyContent ?? serializedData}
  label={copyLabel}
  copiedLabel={copiedLabel}
  duration={copyFeedbackDurationMs}
/>
```

Do not add a local height override; the icon variant supplies the 24px `xs` size and accessible label.

- [ ] **Step 4: Compose disclosure triggers with Base UI**

Import `CollapsibleTrigger`. Replace the hand-written button with this composition:

```tsx
<CollapsibleTrigger
  render={
    <Button
      type="button"
      variant="ghost"
      size="xs"
      className="-ml-1 w-full justify-start px-1 text-left"
    />
  }
  onDoubleClick={collapseOn === "doubleClick" ? onToggle : undefined}
>
  {/* existing key, chevron, bracket, and count content */}
</CollapsibleTrigger>
```

Replace `toggleNode`'s toggle-only implementation with an optional explicit state:

```ts
const setNodeExpanded = (path: string, open?: boolean) => {
  setExpandedPaths((previous) => {
    const next = new Set(previous)
    const shouldOpen = open ?? !next.has(path)
    if (shouldOpen) next.add(path)
    else next.delete(path)
    return next
  })
}
```

Pass Base UI's `open` value to `setNodeExpanded`. In `collapseOn="doubleClick"` mode, call `eventDetails.cancel()` for pointer-triggered changes, allow keyboard-triggered changes, and use `onDoubleClick={() => setNodeExpanded(path)}` for the pointer toggle. Use `group-data-panel-open/button:rotate-90` for chevron state.

- [ ] **Step 5: Apply localization, semantic tokens, and motion fixes**

Use `itemLabel/itemsLabel`, replace `...` with `…`, use `border-border`, replace interactive `<pre>/<code>` wrappers with layout `<div>` elements, remove panel `transition-all`, and add `motion-reduce:transition-none` to the chevron transform transition.

- [ ] **Step 6: Register the existing copy dependency**

Add `"@mapseek/copy-button"` to the `json-viewer` registry dependency array in `registry/ui/registry.json`; retain `@tabler/icons-react` for the chevron.

- [ ] **Step 7: Run focused tests and verify GREEN**

Run:

```bash
pnpm exec vitest run registry/ui/json-viewer.test.tsx registry/ui/copy-button.test.tsx
```

Expected: all JsonViewer and CopyButton tests pass without warnings.

---

### Task 3: Wire GeoJSON labels into JsonViewer and public acceptance surfaces

**Files:**
- Modify: `registry/blocks/geojson-view/GeoJSONView.tsx`
- Modify: `showcase/src/showcases/GeoJSONViewShowcase.tsx`
- Modify: `showcase/src/showcases/JsonViewerShowcase.tsx`
- Modify: `packages/docs/content/docs/blocks/geojson-view.mdx`
- Modify: `packages/docs/content/docs/blocks/geojson-view.en.mdx`
- Modify: `packages/docs/content/docs/components/json-viewer.mdx`
- Modify: `packages/docs/content/docs/components/json-viewer.en.mdx`
- Modify: `scripts/docs-visual-qa.ts`

**Interfaces:**
- Consumes: resolved `GeoJSONViewLabels` and the new `JsonViewer` props from Tasks 1–2.
- Produces: locale-correct demos/docs and real-browser coverage for copy and double-click disclosure behavior.

- [ ] **Step 1: Add the wiring expectations to the GeoJSON test**

Render a valid object with English labels and assert the output contains `aria-label="Copy JSON"`, uses the supplied count copy, and does not contain the Chinese default strings.

- [ ] **Step 2: Run the GeoJSON test and verify RED**

Run:

```bash
pnpm exec vitest run registry/blocks/geojson-view/GeoJSONView.test.tsx
```

Expected: the valid-object assertion fails until `GeoJSONView` forwards the new labels and original copy content.

- [ ] **Step 3: Forward all viewer labels and original JSON**

Pass these props from `GeoJSONView` to `JsonViewer`:

```tsx
copyLabel={labels.copy}
copiedLabel={labels.copied}
itemLabel={labels.item}
itemsLabel={labels.items}
copyContent={json}
```

- [ ] **Step 4: Localize both showcases**

Add every new label to both locale entries in `GeoJSONViewShowcase`; pass them through `labels`. Update `JsonViewerShowcase` to use localized labels and `collapseOn="doubleClick"`, making the compatibility mode visible to browser QA.

- [ ] **Step 5: Update browser assertions**

In the existing `json-viewer` visual QA branch:

```ts
const nodeTrigger = viewer.locator('[data-slot="collapsible-trigger"]').first()
await expect(nodeTrigger).toHaveAttribute("aria-expanded", "true")
await nodeTrigger.click()
await expect(nodeTrigger).toHaveAttribute("aria-expanded", "true")
await nodeTrigger.dblclick()
await expect(nodeTrigger).toHaveAttribute("aria-expanded", "false")
await nodeTrigger.press("Enter")
await expect(nodeTrigger).toHaveAttribute("aria-expanded", "true")

const copyButton = viewer.getByRole("button", {
  name: localized(path, "复制 GeoJSON", "Copy GeoJSON"),
})
await copyButton.click()
await expect(
  viewer.getByRole("button", {
    name: localized(path, "已复制 GeoJSON", "Copied GeoJSON"),
  }),
).toBeVisible()
```

Preserve every unrelated edit already present in `scripts/docs-visual-qa.ts`.

- [ ] **Step 6: Update bilingual documentation**

Document the six added label fields, separate parse/unsupported states, `CopyButton` delegation, and the five new `JsonViewer` props in both languages.

- [ ] **Step 7: Run focused unit and docs checks**

Run:

```bash
pnpm exec vitest run registry/blocks/geojson-view/GeoJSONView.test.tsx registry/ui/json-viewer.test.tsx
pnpm run docs:check-i18n
pnpm run docs:check-examples
```

Expected: all focused tests and both documentation checks pass.

---

### Task 4: Verify the complete change

**Files:**
- Review every file changed in Tasks 1–3.

**Interfaces:**
- Consumes: completed implementation and acceptance surfaces.
- Produces: final evidence that the approved specification is met without disturbing unrelated work.

- [ ] **Step 1: Run formatting and static checks**

```bash
pnpm exec biome check registry/blocks/geojson-view registry/ui/json-viewer.tsx registry/ui/json-viewer.test.tsx registry/ui/registry.json showcase/src/showcases/GeoJSONViewShowcase.tsx showcase/src/showcases/JsonViewerShowcase.tsx packages/docs/content/docs/blocks/geojson-view.mdx packages/docs/content/docs/blocks/geojson-view.en.mdx packages/docs/content/docs/components/json-viewer.mdx packages/docs/content/docs/components/json-viewer.en.mdx
pnpm run typecheck
pnpm run registry:validate
```

- [ ] **Step 2: Run focused and complete test suites**

```bash
pnpm exec vitest run registry/blocks/geojson-view/GeoJSONView.test.tsx registry/ui/json-viewer.test.tsx registry/ui/copy-button.test.tsx
pnpm test
```

- [ ] **Step 3: Run the relevant browser QA**

```bash
pnpm run docs:dev
pnpm exec tsx scripts/docs-visual-qa.ts --base-url http://localhost:3000 --category primitive --only json-viewer
pnpm exec tsx scripts/docs-visual-qa.ts --base-url http://localhost:3000 --category block --only geojson-view
```

Start `docs:dev` in the background, wait for readiness, run both focused visual cases, then stop only the process started for this task.

- [ ] **Step 4: Inspect the final diff and worktree status**

Confirm the diff contains only the planned files, no raw RGBA indentation, no `transition-all`, no invalid `<pre>` composition, no hard-coded cross-locale copy/count text, and no unrelated user changes.

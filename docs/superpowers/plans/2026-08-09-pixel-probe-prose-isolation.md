# PixelProbe Prose Isolation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent surrounding prose typography from expanding PixelProbe field spacing while preserving the block's existing structure and behavior.

**Architecture:** Treat the PixelProbe root section as a self-contained UI surface by adding Tailwind Typography's `not-prose` marker at the component boundary. Prove the boundary exists with the current server-rendered component test, then verify the semantic elements no longer receive prose margins in the docs example.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4, Tailwind Typography `not-prose`, Vitest 4, `react-dom/server`, pnpm 10.

## Global Constraints

- Preserve the current single-column information hierarchy, semantic `dl`/`dt`/`dd` markup, public API, navigation behavior, responsive width, header, footer, empty state, and horizontal value scrolling.
- Keep the existing component-owned spacing: 10px details-list gap and vertical padding, 4px label/value gap, and 28px value-row height.
- Modify only `PixelProbe` and its focused test during implementation.
- Do not change the API, data model, documentation copy, showcase dimensions, or unrelated components.
- Preserve all pre-existing working-tree changes and stage only the two implementation files in this plan.

## File Structure

- `registry/blocks/pixel-probe/PixelProbe.tsx`: owns the PixelProbe root boundary and its existing field layout.
- `registry/blocks/pixel-probe/PixelProbe.test.tsx`: server-rendered regression coverage for the root isolation class and existing semantics.

---

### Task 1: Isolate PixelProbe from prose typography

**Files:**
- Modify: `registry/blocks/pixel-probe/PixelProbe.test.tsx:29-51`
- Modify: `registry/blocks/pixel-probe/PixelProbe.tsx:73-79`

**Interfaces:**
- Consumes: existing `PixelProbe(props: PixelProbeProps)` component and its root `<section data-testid="pixel-probe">`.
- Produces: the same `PixelProbe` API and markup, with `not-prose` included in the root section's class list.

- [ ] **Step 1: Write the failing root-isolation assertion**

Add this assertion to the existing `"exposes a named section and semantic field relationships"` test immediately after `expect(html).toContain("<section")`:

```tsx
expect(html).toMatch(/<section[^>]*class="[^"]*\bnot-prose\b[^"]*"/u)
```

The existing render setup, labels, fields, and semantic assertions remain unchanged.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm test registry/blocks/pixel-probe/PixelProbe.test.tsx
```

Expected: FAIL in `"exposes a named section and semantic field relationships"` because the rendered root section class does not contain `not-prose`. Existing assertions should not fail.

- [ ] **Step 3: Add the minimal root isolation class**

In `PixelProbe.tsx`, change only the root section's base class string:

```tsx
className={cn(
  "not-prose flex min-w-0 flex-col overflow-hidden border border-border bg-card",
  className,
)}
```

Do not add margin resets to `dl`, `dt`, or `dd`, and do not change any spacing utilities.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
pnpm test registry/blocks/pixel-probe/PixelProbe.test.tsx
```

Expected: PASS with the new isolation assertion and all existing PixelProbe tests green.

- [ ] **Step 5: Run focused static checks**

Run:

```bash
pnpm exec biome check registry/blocks/pixel-probe/PixelProbe.tsx registry/blocks/pixel-probe/PixelProbe.test.tsx
```

Expected: PASS with no formatting or lint diagnostics.

- [ ] **Step 6: Verify the live docs layout**

Reload `http://localhost:3000/blocks/pixel-probe/` in the local browser. Inspect the rendered `section[data-testid="pixel-probe"]`, its child `dl`, and every `dt` and `dd` with `getComputedStyle` and `getBoundingClientRect`.

Expected:

- the root section class list contains `not-prose`;
- computed top and bottom margins for the `dl`, every `dt`, and every `dd` are `0px`;
- the `dl` row gap remains `10px` and each field row's internal gap remains `4px`;
- all seven showcase fields remain readable in one column, with header and footer unchanged;
- long values remain horizontally scrollable and the unit remains fixed.

- [ ] **Step 7: Commit only the implementation files**

```bash
git add registry/blocks/pixel-probe/PixelProbe.tsx registry/blocks/pixel-probe/PixelProbe.test.tsx
git commit -m "fix(pixel-probe): isolate field spacing from prose"
```

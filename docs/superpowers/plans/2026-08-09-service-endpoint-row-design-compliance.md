# ServiceEndpointRow Design Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `ServiceEndpointRow` and its examples into full `DESIGN.md` compliance without breaking existing callback-based consumers.

**Architecture:** Keep the block as a compact presentational component. Replace the display-only fieldset with a focusable semantic code region, share one icon-action style between buttons and links, and select native link/button/aria-disabled behavior from the supplied open-action props. Extend existing primitives only through optional props and exported style helpers.

**Tech Stack:** React 19, TypeScript 5.9, Base UI, Tailwind CSS v4, Tabler Icons, Vitest, Playwright-based docs visual QA, shadcn source registry.

## Global Constraints

- Preserve the current `ServiceEndpointRowProps` API; `copiedLabel`, `onCopyError`, and `openHref` are optional additions.
- Keep URL, copy, and open surfaces in one 32 px-high row.
- Render navigation as a native `<a>` and callback actions as buttons.
- Keep disabled open actions focusable with `aria-disabled`; guard activation without native `disabled`.
- Keep endpoint URLs LTR and untranslated inside both LTR and RTL pages.
- Use neutral/category styling for passive labels; do not use warning/info/success colors decoratively.
- Do not overwrite, stage, or revert unrelated dirty-worktree edits, including overlapping changes in registry and QA files.
- Follow red-green-refactor and capture each expected failure before production changes.

---

### Task 1: Share Icon Action Sizing and Let CopyButton Opt Into 32 px

**Files:**
- Modify: `registry/ui/icon-button.test.tsx`
- Modify: `registry/ui/icon-button.tsx`
- Modify: `registry/ui/copy-button.test.tsx`
- Modify: `registry/ui/copy-button.tsx`

**Interfaces:**
- Produces: `export type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl"`.
- Produces: `iconButtonVariants({ size?: IconButtonSize, danger?: boolean }): string`.
- Produces: `CopyButtonProps.iconSize?: IconButtonSize`, defaulting to `"xs"`.
- Preserves: Existing `IconButton` and `CopyButton` defaults and callback behavior.

- [ ] **Step 1: Add failing IconButton style-helper tests**

Import `iconButtonVariants` and assert that a semantic link can request the same 32 px contract and that the returned class string contains focus, icon sizing, and `aria-disabled` styles:

```tsx
it("exports the shared 32px style contract for semantic icon links", () => {
  const classes = iconButtonVariants({ size: "md" }).split(/\s+/)

  expect(classes).toContain("size-8")
  expect(classes).toContain("focus-visible:border-ring")
  expect(classes).toContain("[&_svg:not([class*='size-'])]:size-4")
  expect(classes).toContain("aria-disabled:cursor-not-allowed")
})
```

- [ ] **Step 2: Run the IconButton test and record the expected red state**

Run: `pnpm vitest run registry/ui/icon-button.test.tsx`

Expected: FAIL because `iconButtonVariants` is not exported.

- [ ] **Step 3: Extract the shared style helper**

Move the current base, size, danger, disabled, and focus classes into `iconButtonVariants`. Add `aria-disabled:cursor-not-allowed`, `aria-disabled:opacity-50`, and neutralized disabled hover styles. Make `IconButton` call the helper and merge `className` afterward.

```ts
function iconButtonVariants({
  size = "md",
  danger = false,
}: { size?: IconButtonSize; danger?: boolean } = {}) {
  return cn(baseClasses, sizeClasses[size], danger ? dangerClasses : defaultClasses, stateClasses)
}
```

`IconButton` then uses `className={cn(iconButtonVariants({ size, danger }), className)}` and continues to set its accessible label on the Base UI primitive.

- [ ] **Step 4: Run the IconButton test and verify green**

Run: `pnpm vitest run registry/ui/icon-button.test.tsx`

Expected: PASS with all existing size, focus, danger, and tooltip tests unchanged.

- [ ] **Step 5: Add a failing CopyButton icon-size test**

Update the test IconButton double to expose its `size` as `data-size`. Assert both the old default and the new opt-in:

```tsx
expect(renderToStaticMarkup(<CopyButton content="x" />)).toContain('data-size="xs"')
expect(
  renderToStaticMarkup(<CopyButton content="x" iconSize="md" />),
).toContain('data-size="md"')
```

The test also asserts that icon-only SVGs no longer hardcode `size-3.5`, allowing `IconButton` to own icon sizing.

- [ ] **Step 6: Run the CopyButton test and record the expected red state**

Run: `pnpm vitest run registry/ui/copy-button.test.tsx`

Expected: FAIL because `iconSize` is not accepted or forwarded and icon sizing is hardcoded.

- [ ] **Step 7: Implement the optional CopyButton size**

Add `iconSize?: IconButtonSize`, default it to `"xs"`, pass it to `IconButton`, and retain only semantic `text-primary` on the success icon. Let the containing Button/IconButton set SVG dimensions.

```tsx
import { IconButton, type IconButtonSize } from "@/registry/ui/icon-button"

type CopyButtonProps = Omit<ComponentProps<"button">, "children" | "onClick"> & {
  // existing props
  iconSize?: IconButtonSize
}

// in CopyButton destructuring
iconSize = "xs"

<IconButton size={iconSize} /* existing props */>{icon}</IconButton>
```

- [ ] **Step 8: Run both primitive tests and verify green**

Run: `pnpm vitest run registry/ui/icon-button.test.tsx registry/ui/copy-button.test.tsx`

Expected: PASS with zero failures.

### Task 2: Implement Semantic ServiceEndpointRow Rendering

**Files:**
- Create: `registry/blocks/service-endpoint-row/ServiceEndpointRow.test.tsx`
- Modify: `registry/blocks/service-endpoint-row/types.ts`
- Modify: `registry/blocks/service-endpoint-row/ServiceEndpointRow.tsx`

**Interfaces:**
- Consumes: `iconButtonVariants`, `IconButton`, `CopyButton.iconSize`, `Tag`, and tooltip primitives.
- Produces: Optional `copiedLabel`, `onCopyError`, and `openHref` props.
- Preserves: `onOpen` as the callback-only action and as an optional navigation side-effect callback.

- [ ] **Step 1: Add failing structural and internationalization tests**

Render the real component to static markup and assert observable markup:

```tsx
it("renders a focusable untranslated LTR code region instead of a fieldset", () => {
  const html = renderToStaticMarkup(<ServiceEndpointRow {...baseProps} />)

  expect(html).toContain('data-slot="service-endpoint-url"')
  expect(html).toContain('tabindex="0"')
  expect(html).toContain('dir="ltr"')
  expect(html).toContain('translate="no"')
  expect(html).not.toContain("<fieldset")
})

it("uses a neutral shared Tag for the method", () => {
  const html = renderToStaticMarkup(<ServiceEndpointRow {...baseProps} />)
  expect(html).toMatch(/data-slot="tag"[^>]*data-color="gray"/)
})
```

Also assert `title` and subtitle truncation/full-value attributes, a three-column one-row grid, 32 px URL/copy/open surfaces, and neutral placeholder emphasis.

- [ ] **Step 2: Add failing action-contract tests**

Use the React element returned by `ServiceEndpointRow(baseProps)` to inspect the real child props and invoke guarded handlers. Cover these mutations:

- removing `copiedLabel ?? copyLabel` changes the copied feedback language;
- dropping `onCopyError` loses the supplied failure callback;
- supplying `openHref` must produce an anchor with `_blank` and `noopener noreferrer`;
- supplying only `onOpen` must produce an enabled button and invoke it once;
- setting `openDisabled` or omitting both action props must expose `aria-disabled="true"` and never invoke `onOpen`.

Use a local recursive React-element finder so no UI primitive is mocked.

- [ ] **Step 3: Run the block test and record the expected red state**

Run: `pnpm vitest run registry/blocks/service-endpoint-row/ServiceEndpointRow.test.tsx`

Expected: FAIL because the new props and semantic rendering do not exist and the current markup includes a fieldset and 24 px actions.

- [ ] **Step 4: Extend the public props**

Add exactly:

```ts
onCopyError?: (error: unknown) => void
copiedLabel?: string
openHref?: string
```

- [ ] **Step 5: Replace the header and URL markup**

- Wrap an optional icon in an `aria-hidden="true"` shrink container.
- Add `min-w-0`, `truncate`, and native `title` attributes to title/subtitle.
- Render `<Tag color="gray" variant="outline" translate="no">GET</Tag>`.
- Replace `InputGroup` with a focusable `<code>` using `h-8`, `overflow-x-auto`, `scroll-fade-x`, `dir="ltr"`, `translate="no"`, a full URL accessible label/title, and standard input-surface/focus tokens.
- Keep template parameters visually distinct using neutral font weight rather than semantic status colors.

The URL surface is implemented with this semantic contract:

```tsx
<code
  data-slot="service-endpoint-url"
  tabIndex={0}
  dir="ltr"
  translate="no"
  aria-label={url}
  title={url}
  className="mono scroll-fade-x flex h-8 min-w-0 items-center overflow-x-auto whitespace-nowrap border border-input bg-input-surface px-2 text-body-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-(length:--focus-ring-width) focus-visible:ring-ring/20"
>
  {urlSegments.map((segment) => (
    <span key={segment.key} className={isTemplateParameter(segment.part) ? "font-medium" : undefined}>
      {segment.part}
    </span>
  ))}
</code>
```

- [ ] **Step 6: Implement the copy and open action branches**

- Pass `iconSize="md"`, `copiedLabel={copiedLabel ?? copyLabel}`, and `onCopyError` to `CopyButton`.
- Compute `isOpenDisabled = Boolean(openDisabled || (!openHref && !onOpen))`.
- Render a native styled anchor for enabled `openHref`.
- Render an `IconButton` for callback-only and disabled/actionless states.
- For disabled states, use `aria-disabled`, preserve the tooltip, and prevent the guarded click handler from invoking `onOpen`.

The open-action decision is explicit:

```tsx
const isOpenDisabled = Boolean(openDisabled || (!openHref && !onOpen))

const openAction = openHref && !isOpenDisabled ? (
  <a
    href={openHref}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={openLabel}
    className={iconButtonVariants({ size: "md" })}
    onClick={onOpen}
  >
    <IconExternalLink stroke={1.5} />
  </a>
) : (
  <IconButton
    size="md"
    label={openLabel}
    aria-disabled={isOpenDisabled || undefined}
    onClick={(event) => {
      if (isOpenDisabled) {
        event.preventDefault()
        return
      }
      onOpen?.()
    }}
  >
    <IconExternalLink stroke={1.5} />
  </IconButton>
)
```

- [ ] **Step 7: Run the block and primitive tests and verify green**

Run: `pnpm vitest run registry/blocks/service-endpoint-row/ServiceEndpointRow.test.tsx registry/ui/icon-button.test.tsx registry/ui/copy-button.test.tsx`

Expected: PASS with zero failures.

### Task 3: Synchronize Showcase, Registry Metadata, and Documentation

**Files:**
- Create: `showcase/src/showcases/ServiceEndpointRowShowcase.test.tsx`
- Modify: `showcase/src/showcases/ServiceEndpointRowShowcase.tsx`
- Modify: `registry/blocks/registry.json`
- Modify: `packages/docs/content/docs/blocks/service-endpoint-row.mdx`
- Modify: `packages/docs/content/docs/blocks/service-endpoint-row.en.mdx`
- Regenerate: `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`

**Interfaces:**
- Consumes: The new optional block props from Task 2.
- Produces: A localized enabled-link, disabled-tooltip, copy-success, and copy-error demonstration.

- [ ] **Step 1: Add a failing showcase behavior test**

Create a focused showcase test that renders each locale and asserts observable initial markup:

- the status node is `<output aria-live="polite">`;
- the enabled TileJSON row is a native link with the localized accessible name;
- decorative icons are hidden from assistive technology;
- icon containers use neutral tokens rather than warning/info tokens.

```tsx
it.each(["zh-CN", "en"] as const)("renders accessible %s endpoint states", (locale) => {
  const html = renderToStaticMarkup(<ServiceEndpointRowDemo locale={locale} />)

  expect(html).toMatch(/<output[^>]*aria-live="polite"/)
  expect(html).toMatch(/<a[^>]*target="_blank"[^>]*rel="noopener noreferrer"/)
  expect(html).toContain('aria-hidden="true"')
  expect(html).not.toMatch(/(?:border|bg|text)-(?:warning|info)/)
})
```

Run: `pnpm vitest run showcase/src/showcases/ServiceEndpointRowShowcase.test.tsx`

Expected: FAIL against the current `<span>` status, semantic-color icon containers, and callback-only TileJSON example.

- [ ] **Step 2: Update the showcase and verify the focused test**

Add `copyError` labels, pass `copiedLabel`/`onCopyError`, use a semantic `openHref` plus `onOpen` for the enabled row, change the status node to `<output aria-live="polite">`, mark icons decorative, and use `border-border bg-muted/50 text-foreground` styling.

```tsx
<output data-demo-status="service-endpoint-row" aria-live="polite">
  {status}
</output>

<ServiceEndpointRow
  {...endpointProps}
  copiedLabel={demoLabels.copied}
  onCopyError={() => setStatus(demoLabels.copyError)}
  openHref="https://api.mapseek.io/v1/raster/demo/tilejson.json"
  onOpen={() => setStatus(`${demoLabels.opened}: tilejson`)}
/>
```

Run: `pnpm vitest run showcase/src/showcases/ServiceEndpointRowShowcase.test.tsx`

Expected: PASS.

- [ ] **Step 3: Update the registry item dependencies**

Replace `@mapseek/input-group` with `@mapseek/tag`. Retain `@mapseek/copy-button`, `@mapseek/icon-button`, and `@mapseek/tooltip` because the block imports all three contracts directly or transitively.

- [ ] **Step 4: Correct both documentation pages**

Document all public props including required `openLabel`, optional `copiedLabel`, `onCopyError`, and `openHref`; explain native-link versus callback-button selection, actionless disabled behavior, clipboard responsibility, focusable URL scrolling, LTR URL direction, and recommended disabled explanations.

- [ ] **Step 5: Regenerate the showcase source catalog**

Run: `pnpm run docs:sources`

Expected: Exit 0. Inspect only the `service-endpoint-row` entry and preserve generated updates caused by pre-existing showcase edits.

- [ ] **Step 6: Validate docs and registry metadata**

Run: `pnpm run registry:validate`

Run: `pnpm run docs:check-i18n`

Run: `pnpm run docs:check-examples`

Expected: Each exits 0.

### Task 4: Extend Browser QA and Complete Verification

**Files:**
- Modify: `scripts/docs-visual-qa.ts`

**Interfaces:**
- Consumes: Showcase selectors and semantics from Task 3.
- Produces: Regression coverage for layout, keyboard access, RTL, action semantics, localized feedback, and disabled tooltip reachability.

- [ ] **Step 1: Add ServiceEndpointRow browser assertions**

In the existing `block === "service-endpoint-row"` branch, assert:

- all URL regions are `code[tabindex="0"][dir="ltr"][translate="no"]`;
- URL, copy, and open boxes are each 32 px high;
- the enabled open action is a link with `_blank` and `noopener noreferrer`;
- disabled actions have `aria-disabled="true"` but no native `disabled`;
- focusing a disabled action exposes its explanatory tooltip;
- the first URL receives keyboard focus and remains horizontally scrollable at narrow width;
- switching the document/demo to RTL does not change URL direction;
- English copied state uses `Copied URL`, never the Chinese primitive default;
- replacing clipboard writing with a rejection produces localized failure status;
- the demo has no horizontal overflow at narrow width.

Use semantic locators and measured boxes rather than source-text assertions:

```ts
const urls = demo.locator('code[data-slot="service-endpoint-url"]')
await expect(urls).toHaveCount(3)
await expect(urls.first()).toHaveAttribute("dir", "ltr")
await expect(urls.first()).toHaveAttribute("translate", "no")

const openLink = demo.getByRole("link", { name: localized(path, "新窗口打开", "Open in new window") })
await expect(openLink).toHaveAttribute("target", "_blank")
await expect(openLink).toHaveAttribute("rel", /noopener/)

const disabledOpen = demo.getByRole("button", { name: localized(path, "新窗口打开", "Open in new window") }).first()
await expect(disabledOpen).toHaveAttribute("aria-disabled", "true")
await expect(disabledOpen).not.toBeDisabled()
```

- [ ] **Step 2: Run focused tests and static checks**

Run: `pnpm vitest run registry/ui/icon-button.test.tsx registry/ui/copy-button.test.tsx registry/blocks/service-endpoint-row/ServiceEndpointRow.test.tsx showcase/src/showcases/ServiceEndpointRowShowcase.test.tsx`

Run: `pnpm exec biome check registry/ui/icon-button.tsx registry/ui/icon-button.test.tsx registry/ui/copy-button.tsx registry/ui/copy-button.test.tsx registry/blocks/service-endpoint-row showcase/src/showcases/ServiceEndpointRowShowcase.tsx showcase/src/showcases/ServiceEndpointRowShowcase.test.tsx packages/docs/content/docs/blocks/service-endpoint-row.mdx packages/docs/content/docs/blocks/service-endpoint-row.en.mdx scripts/docs-visual-qa.ts`

Expected: Tests pass and Biome reports no errors in the scoped files.

- [ ] **Step 3: Run repository-level verification**

Run: `pnpm run typecheck`

Run: `pnpm run registry:validate`

Run: `pnpm run docs:check-i18n`

Run: `pnpm run docs:check-examples`

Run: `pnpm run docs:build`

Run: `pnpm test`

Run the repository's scoped docs visual command for `service-endpoint-row` in both locales, or the complete `pnpm run docs:visual` command if no block filter exists.

Expected: Every command exits 0 with zero test failures.

- [ ] **Step 4: Review the final diff against the approved design**

Inspect exact changed hunks, confirm all audit findings have an implementation or test, confirm no raw status colors remain in this block/showcase, confirm no `InputGroup` dependency remains, and verify that unrelated dirty files/hunks were neither reverted nor staged.

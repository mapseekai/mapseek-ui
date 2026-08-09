# RasterStylePanel Design Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `RasterStylePanel`, its reusable controls, and its bilingual showcase into full compliance with `DESIGN.md` through accessible fields and validation, real radio and disabled semantics, injectable copy, touch-safe colormap actions, and responsive layout.

**Architecture:** Keep `RasterStylePanel` controlled and preserve its draft-only validation model. Resolve optional block copy once from caller labels plus exported defaults, compose existing `Field` and Base UI-backed radio primitives, and pass `disabled`, error IDs, and localized assistive labels down to focused helper components. Protect behavior with server-rendered Vitest tests, source-level registry/layout tests, and the existing Playwright documentation QA path.

**Tech Stack:** React 19, TypeScript 5.9, Base UI 1.6, Tailwind CSS 4 semantic tokens, Mapseek registry primitives, Vitest, React server rendering, Playwright, pnpm.

## Global Constraints

- `RasterStylePanelProps.disabled?: boolean` is the only new panel state API; do not add `readOnly`.
- Existing `RasterStyleLabels & Partial<RasterStylePanelLabels>` callers remain source-compatible.
- Every visible or assistive string owned by the block is injectable; the Chinese defaults contain no embedded English fallback labels.
- Invalid drafts expose `aria-invalid="true"`, `aria-describedby`, and an injected inline `FieldError` while retaining commit-on-valid behavior.
- Mutually exclusive render, mosaic, stretch, colormap-mode, and colormap-preset choices use Base UI radio semantics.
- Disabled state reaches the actual input, select, radio, and button elements; wrapper-only pointer suppression is forbidden.
- Remove-stop actions use a 24px square icon button, no pill radius, visible focus/touch access, and an opaque destructive hover surface.
- Below 640px, field rows use one column and the colormap picker uses two columns; at `sm` and above they use a 72px label column and four colormap columns.
- Preserve zero radius, no shadow, semantic colors, 32px standard controls, 24px compact groups, and the 3px focus ring.
- Use TDD for production behavior: write each test first, run it, and confirm the expected failure before implementation.
- Do not modify or revert unrelated working-tree changes.

---

### Task 1: Injectable labels and public disabled contract

**Files:**

- Modify: `registry/blocks/raster-style-panel/labels.ts:1-5`
- Modify: `registry/blocks/raster-style-panel/defaults.ts:1-10`
- Modify: `registry/blocks/raster-style-panel/types.ts:107-164`
- Modify: `registry/blocks/raster-style-panel/RasterStylePanel.test.tsx:1-170`
- Modify: `registry/blocks/raster-style-panel/RasterStylePanel.tsx:1-572`
- Modify: `registry/blocks/raster-style-panel/StretchControl.test.tsx:1-95`
- Modify: `registry/blocks/raster-style-panel/StretchControl.tsx:32-275`

**Interfaces:**

- Consumes: existing `RasterStyleLabels`, `RasterStylePanelLabels`, `StretchControlLabels`, and `DEFAULT_RASTER_STYLE_PANEL_LABELS`.
- Produces: `RasterStylePanelProps.disabled?: boolean`, complete optional panel label overrides, resolved labels passed into every helper, and no embedded English copy in panel or stretch controls.

- [ ] **Step 1: Add failing localization and contract tests**

Extend the test labels with distinctive injected copy and render custom colormap, percentile, standard-deviation, and custom-stretch states:

```tsx
const panelCopy: RasterStylePanelLabels = {
  colormapNone: "None copy",
  colormapNamed: "Named copy",
  colormapCustom: "Custom copy",
  renderMode: "Render copy",
  renderSingle: "Single copy",
  renderRgb: "RGB copy",
  colormapStopValue: (position) => `Stop ${position} value copy`,
  colormapStopColor: (position) => `Stop ${position} color copy`,
  addColormapStop: "Add stop copy",
  removeColormapStop: (position) => `Remove stop ${position} copy`,
  colormapNoDataColor: "NoData color copy",
  customNoData: "Custom NoData copy",
  customStretchMinimum: (position) => `Range ${position} minimum copy`,
  customStretchMaximum: (position) => `Range ${position} maximum copy`,
  stretchPercentileLow: "Percentile low copy",
  stretchPercentileHigh: "Percentile high copy",
  stretchStandardDeviation: "Sigma copy",
  invalidNumber: (label) => `${label} invalid number copy`,
  invalidColor: (label) => `${label} invalid color copy`,
  decrementValue: (label) => `Decrease ${label}`,
  incrementValue: (label) => `Increase ${label}`,
}

it("uses injected copy for every internal raster control label", () => {
  const html = renderToStaticMarkup(
    <RasterStylePanel
      value={{
        ...value,
        colormap: {
          kind: "custom",
          value: { entries: [{ value: 0, color: "#000000" }, { value: 1, color: "#ffffff" }] },
        },
        nodata: { kind: "custom", custom: -9999 },
      }}
      labels={{ ...labels, ...panelCopy }}
      onChange={() => {}}
    />,
  )

  expect(html).toContain('aria-label="Stop 1 value copy"')
  expect(html).toContain('aria-label="Stop 1 color copy"')
  expect(html).toContain('aria-label="Custom NoData copy"')
  expect(html).toContain('aria-label="Add stop copy"')
  expect(html).not.toContain('aria-label="Colormap stop 1 value"')
  expect(html).not.toContain('aria-label="Custom NoData"')
})
```

Update `StretchControl.test.tsx` to use this complete standalone label fixture and assert its generated input and stepper names instead of the old English literals:

```tsx
const stretchLabels: StretchControlLabels = {
  modes: {
    custom: "Custom",
    minmax: "Min max",
    percent: "Percent",
    stddev: "Std dev",
  },
  percentHint: "pc =",
  sigmaHint: "sigma =",
  sigmaSuffix: "mean +/- sigma",
  auto: "Auto",
  customMinimum: (position) => `Range ${position} minimum copy`,
  customMaximum: (position) => `Range ${position} maximum copy`,
  percentileLow: "Percentile low copy",
  percentileHigh: "Percentile high copy",
  standardDeviation: "Sigma copy",
  invalidNumber: (label) => `${label} is invalid`,
  decrementValue: (label) => `Decrease ${label}`,
  incrementValue: (label) => `Increase ${label}`,
}
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/RasterStylePanel.test.tsx registry/blocks/raster-style-panel/StretchControl.test.tsx
```

Expected: FAIL because `RasterStylePanelLabels` lacks the new keys, `RasterStylePanelProps` lacks `disabled`, and the rendered controls still contain embedded English labels.

- [ ] **Step 3: Define and resolve the complete label surface**

Replace `RasterStylePanelLabels` with this source-compatible override contract:

```ts
export interface RasterStylePanelLabels {
  readonly colormapNone: string
  readonly colormapNamed: string
  readonly colormapCustom: string
  readonly renderMode: string
  readonly renderSingle: string
  readonly renderRgb: string
  readonly colormapStopValue: (position: number) => string
  readonly colormapStopColor: (position: number) => string
  readonly addColormapStop: string
  readonly removeColormapStop: (position: number) => string
  readonly colormapNoDataColor: string
  readonly customNoData: string
  readonly customStretchMinimum: (position: number) => string
  readonly customStretchMaximum: (position: number) => string
  readonly stretchPercentileLow: string
  readonly stretchPercentileHigh: string
  readonly stretchStandardDeviation: string
  readonly invalidNumber: (label: string) => string
  readonly invalidColor: (label: string) => string
  readonly decrementValue: (label: string) => string
  readonly incrementValue: (label: string) => string
}
```

Add Chinese defaults for all keys in `DEFAULT_RASTER_STYLE_PANEL_LABELS`; use one-based positions in every indexed function. Add `disabled?: boolean` to `RasterStylePanelProps`.

At the top of `RasterStylePanel`, resolve once:

```tsx
const copy = { ...DEFAULT_RASTER_STYLE_PANEL_LABELS, ...labels }
```

Use `copy.renderMode`, `copy.renderSingle`, and `copy.renderRgb` only when the matching legacy `RasterStyleLabels` value is absent. Pass the resolved indexed labels, validation copy, and number-stepper labels into `StretchControl`, inline stop inputs, NoData controls, and add/remove buttons. Extend the standalone stretch label type exactly as follows, resolving absent optional values from `DEFAULT_RASTER_STYLE_PANEL_LABELS`, and remove every literal `Custom stretch`, `Stretch percentile`, and `Stretch standard deviation` label:

```ts
export interface StretchControlLabels {
  modes: Record<StretchMode, string>
  percentHint: string
  sigmaHint: string
  sigmaSuffix: string
  auto: string
  customMinimum?: (position: number) => string
  customMaximum?: (position: number) => string
  percentileLow?: string
  percentileHigh?: string
  standardDeviation?: string
  invalidNumber?: (label: string) => string
  decrementValue?: (label: string) => string
  incrementValue?: (label: string) => string
}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/RasterStylePanel.test.tsx registry/blocks/raster-style-panel/StretchControl.test.tsx
```

Expected: PASS; the distinctive copy is present and the legacy English strings are absent.

- [ ] **Step 5: Commit the contract and localization work**

```bash
git add registry/blocks/raster-style-panel/labels.ts registry/blocks/raster-style-panel/defaults.ts registry/blocks/raster-style-panel/types.ts registry/blocks/raster-style-panel/RasterStylePanel.test.tsx registry/blocks/raster-style-panel/RasterStylePanel.tsx registry/blocks/raster-style-panel/StretchControl.test.tsx registry/blocks/raster-style-panel/StretchControl.tsx
git commit -m "fix(raster-style-panel): localize internal control labels"
```

### Task 2: Real radio-group semantics for custom selection controls

**Files:**

- Modify: `registry/blocks/raster-style-panel/ColormapPicker.test.tsx:1-45`
- Modify: `registry/blocks/raster-style-panel/ColormapPicker.tsx:1-87`
- Modify: `registry/blocks/raster-style-panel/Segmented.tsx:1-96`
- Modify: `registry/blocks/raster-style-panel/RasterStylePanel.test.tsx`
- Modify: `registry/blocks/raster-style-panel/RasterStylePanel.tsx:266-363`

**Interfaces:**

- Consumes: Base UI `RadioGroup`/`Radio`, existing `ButtonRadioGroup`/`ButtonRadioGroupItem`, existing semantic selection colors.
- Produces: required `ColormapPickerProps.ariaLabel: string`, labelled radio groups with checked state, and native disabled behavior for picker and segmented items.

- [ ] **Step 1: Confirm the local shadcn/Base UI composition before changing code**

Run:

```bash
pnpm dlx shadcn@latest info --json
```

Expected: the project reports Base UI, Tailwind CSS v4, the current Mapseek aliases, and no migration requirement. Compare the local `registry/ui/button-radio-group.tsx` API with the installed Base UI radio types; do not add a second radio abstraction.

- [ ] **Step 2: Add failing radio semantics tests**

Replace the picker-only style test with semantic assertions while retaining selected-surface checks:

```tsx
it("exposes a labelled radio group with one checked colormap", () => {
  const html = renderToStaticMarkup(
    <ColormapPicker
      ariaLabel="Scientific colormap"
      value="viridis"
      options={["viridis", "magma"]}
      customLabel="Custom"
      onChange={() => {}}
    />,
  )

  expect(html).toContain('role="radiogroup"')
  expect(html).toContain('aria-label="Scientific colormap"')
  expect(html.match(/role="radio"/g)).toHaveLength(2)
  expect(html.match(/aria-checked="true"/g)).toHaveLength(1)
  expect(html).toContain("data-checked")
})

it("natively disables the colormap choices", () => {
  const html = renderToStaticMarkup(
    <ColormapPicker
      ariaLabel="Scientific colormap"
      value="viridis"
      options={["viridis", "magma"]}
      customLabel="Custom"
      disabled
      onChange={() => {}}
    />,
  )

  expect(html.match(/disabled/g)?.length).toBeGreaterThanOrEqual(2)
  expect(html).not.toContain("pointer-events-none opacity-50")
})
```

In `RasterStylePanel.test.tsx`, render mosaic mode and assert that the localized mosaic selection owns a `role="radiogroup"` with exactly one checked radio.

- [ ] **Step 3: Run selection tests and verify RED**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/ColormapPicker.test.tsx registry/blocks/raster-style-panel/RasterStylePanel.test.tsx
```

Expected: FAIL because picker buttons have no radio roles/checked state, `ariaLabel` does not exist, and `Segmented` still uses plain buttons plus wrapper pointer suppression.

- [ ] **Step 4: Refactor picker and segmented controls onto Base UI radio primitives**

Implement `ColormapPicker` with Base UI primitives and responsive columns:

```tsx
<RadioGroupPrimitive
  aria-label={ariaLabel}
  disabled={disabled}
  value={value}
  onValueChange={(next) => {
    const colormap = next as ColormapName
    onChange(colormap)
    if (colormap === "custom") onEditCustom?.()
  }}
  className={cn(
    "grid grid-cols-2 gap-1 sm:grid-cols-[repeat(var(--colormap-columns),minmax(0,1fr))]",
    className,
  )}
  style={{ "--colormap-columns": columns } as React.CSSProperties}
>
  {visibleOptions.map((colormap) => (
    <RadioPrimitive.Root
      key={colormap}
      value={colormap}
      className="group flex h-auto min-w-0 flex-col gap-1 border border-transparent p-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/20 data-checked:bg-selection-bg data-checked:text-primary disabled:pointer-events-none disabled:opacity-50"
    >
      <span
        aria-hidden="true"
        className="h-3.5 w-full border border-border group-data-checked:border-primary group-data-checked:ring-1 group-data-checked:ring-primary"
        style={{ background: COLORMAP_GRADIENTS[colormap] }}
      />
      <span className="min-w-0 truncate font-mono text-label-md lowercase text-muted-foreground group-data-checked:text-primary">
        {colormap === "custom" ? customLabel : colormap}
      </span>
    </RadioPrimitive.Root>
  ))}
</RadioGroupPrimitive>
```

Keep the selected hover surface with `data-checked:hover:bg-selection-bg` and `data-checked:hover:text-primary`. Refactor `Segmented` to render `ButtonRadioGroup` and `ButtonRadioGroupItem`, pass `disabled` to the root and items, use `onValueChange`, set `aria-label` from a new `ariaLabel` prop, and mark direct icons `aria-hidden="true"`. Remove `data-active`, custom border overlap, `z-[1]`, and wrapper `pointer-events-none` state.

- [ ] **Step 5: Run selection tests and verify GREEN**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/ColormapPicker.test.tsx registry/blocks/raster-style-panel/RasterStylePanel.test.tsx
```

Expected: PASS with one checked radio per group, actual disabled attributes, responsive picker classes, and preserved selected-surface styling.

- [ ] **Step 6: Commit semantic selection controls**

```bash
git add registry/blocks/raster-style-panel/ColormapPicker.test.tsx registry/blocks/raster-style-panel/ColormapPicker.tsx registry/blocks/raster-style-panel/Segmented.tsx registry/blocks/raster-style-panel/RasterStylePanel.test.tsx registry/blocks/raster-style-panel/RasterStylePanel.tsx
git commit -m "fix(raster-style-panel): use radio semantics for selections"
```

### Task 3: Inline draft validation and accessible errors

**Files:**

- Modify: `registry/blocks/raster-style-panel/NumberDraftInput.tsx:1-68`
- Modify: `registry/blocks/raster-style-panel/StretchControl.test.tsx`
- Modify: `registry/blocks/raster-style-panel/StretchControl.tsx:50-275`
- Modify: `registry/blocks/raster-style-panel/RasterStylePanel.test.tsx`
- Modify: `registry/blocks/raster-style-panel/RasterStylePanel.tsx:63-103, 373-490`

**Interfaces:**

- Consumes: `FieldError`, Input/InputNumber ARIA passthrough, existing validation callbacks.
- Produces: `NumberDraftInputProps.errorMessage`, `disabled`, `decrementLabel`, and `incrementLabel`; deterministic error IDs; visible inline errors; unchanged commit-on-valid behavior.

- [ ] **Step 1: Add failing invalid-draft tests**

Add initial-invalid server-render tests so state is observable without a browser event harness:

```tsx
it("describes an invalid standard-deviation draft inline", () => {
  const html = renderToStaticMarkup(
    <StretchControl
      value={{ mode: "stddev", sigma: 0 }}
      labels={{ ...stretchLabels, invalidNumber: (label) => `${label} is invalid` }}
      onChange={() => {}}
    />,
  )

  const input = inputTag(html, "Sigma copy") ?? ""
  expect(input).toContain('aria-invalid="true"')
  expect(input).toMatch(/aria-describedby="[^"]+"/)
  expect(html).toContain('data-slot="field-error"')
  expect(html).toContain('role="alert"')
  expect(html).toContain("Sigma copy is invalid")
})

it("describes invalid colormap number and color drafts inline", () => {
  const html = renderToStaticMarkup(
    <RasterStylePanel
      value={{
        ...value,
        colormap: {
          kind: "custom",
          value: { entries: [{ value: Number.NaN, color: "invalid-color" }, { value: 1, color: "#fff" }] },
        },
      }}
      labels={{ ...labels, ...panelCopy }}
      onChange={() => {}}
    />,
  )

  expect(html.match(/aria-invalid="true"/g)?.length).toBeGreaterThanOrEqual(2)
  expect(html.match(/data-slot="field-error"/g)?.length).toBeGreaterThanOrEqual(2)
  expect(html).toContain("invalid number copy")
  expect(html).toContain("invalid color copy")
})
```

- [ ] **Step 2: Run validation tests and verify RED**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/RasterStylePanel.test.tsx registry/blocks/raster-style-panel/StretchControl.test.tsx
```

Expected: FAIL because invalid state only reaches `onValidityChange`; controls have no ARIA invalid/description relationship and no `FieldError`.

- [ ] **Step 3: Implement invalid state next to each draft**

In `NumberDraftInput`, derive initial validity synchronously, keep it in state, generate one error ID with `useId`, and render:

```tsx
<div data-invalid={invalid || undefined} className="flex min-w-0 flex-col gap-1">
  <InputNumber
    aria-label={label}
    aria-invalid={invalid || undefined}
    aria-describedby={invalid ? errorId : undefined}
    decrementLabel={decrementLabel}
    incrementLabel={incrementLabel}
    disabled={disabled}
    className={RASTER_INPUT_NUMBER_CLASS}
    max={max}
    min={min}
    step="any"
    value={draft}
    onValueChange={(next) => {
      setDraft(next)
      const nextValid = next !== null && Number.isFinite(next) && validateRef.current(next)
      setInvalid(!nextValid)
      reportRef.current?.(id, nextValid)
      if (nextValid) onValidRef.current(next)
    }}
  />
  {invalid ? <FieldError id={errorId}>{errorMessage}</FieldError> : null}
</div>
```

Update validity state before reporting or committing each draft. Apply the same pattern to the text/color `DraftInput` in `RasterStylePanel`. In `PercentDraft` and `CustomRangesDraft`, compute pair/group validity once per update, put `aria-invalid` and the shared `aria-describedby` on each invalid member, and render one `FieldError` after the pair or range group. Pass localized increment/decrement labels to every `InputNumber`.

- [ ] **Step 4: Run validation tests and verify GREEN**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/RasterStylePanel.test.tsx registry/blocks/raster-style-panel/StretchControl.test.tsx
```

Expected: PASS; invalid controls reference visible alerts and valid initial values do not render errors.

- [ ] **Step 5: Commit inline validation**

```bash
git add registry/blocks/raster-style-panel/NumberDraftInput.tsx registry/blocks/raster-style-panel/StretchControl.test.tsx registry/blocks/raster-style-panel/StretchControl.tsx registry/blocks/raster-style-panel/RasterStylePanel.test.tsx registry/blocks/raster-style-panel/RasterStylePanel.tsx
git commit -m "fix(raster-style-panel): expose inline draft errors"
```

### Task 4: Field composition, true disabled propagation, and responsive rows

**Files:**

- Modify: `registry/blocks/raster-style-panel/RasterStylePanel.test.tsx`
- Modify: `registry/blocks/raster-style-panel/RasterStylePanel.tsx:161-572`
- Modify: `registry/blocks/raster-style-panel/StretchControl.tsx:42-275`
- Modify: `registry/blocks/raster-style-panel/fragment.json:1-70`
- Modify: `registry/blocks/registry.json` entry `raster-style-panel`
- Modify: `scripts/__tests__/registry-component-composition.test.ts`
- Modify: `scripts/__tests__/raster-style-panel-layout.test.ts`

**Interfaces:**

- Consumes: `FieldGroup`, `Field`, `FieldContent`, `FieldLabel`, `FieldLegend`, existing control IDs and ARIA labels.
- Produces: clickable single-control labels, labelled grouped controls, `data-disabled` field state, one-column mobile rows, two-column mobile picker, and actual disabled attributes throughout.

- [ ] **Step 1: Add failing composition, disabled, and breakpoint tests**

Add a disabled integration test:

```tsx
it("propagates disabled state to every rendered interaction", () => {
  const html = renderToStaticMarkup(
    <RasterStylePanel
      disabled
      value={{
        ...value,
        colormap: {
          kind: "custom",
          value: { entries: [{ value: 0, color: "#000" }, { value: 1, color: "#fff" }] },
        },
        nodata: { kind: "custom", custom: -9999 },
      }}
      labels={{ ...labels, ...panelCopy }}
      onChange={() => {}}
    />,
  )

  expect(html).toContain('data-slot="field-group"')
  expect(html).toContain('data-slot="field-label"')
  expect(html).toContain('data-disabled="true"')
  const interactiveTags = (html.match(/<(?:button|input)[^>]*>/g) ?? []).filter(
    (tag) => !tag.includes('type="hidden"'),
  )
  for (const tag of interactiveTags) {
    expect(tag).toContain("disabled")
  }
})
```

Extend `registry-component-composition.test.ts`:

```ts
it("composes RasterStylePanel with Field primitives", async () => {
  const panel = await readFile("registry/blocks/raster-style-panel/RasterStylePanel.tsx", "utf8")
  const item = await blockRegistryItem("raster-style-panel")

  expect(panel).toContain("FieldGroup")
  expect(panel).toContain("FieldLabel")
  expect(panel).toContain("FieldLegend")
  expect(item.registryDependencies).toEqual(expect.arrayContaining(["@mapseek/field"]))
})
```

Replace the stale layout test with assertions for `grid-cols-1`, `sm:grid-cols-[72px_minmax(0,1fr)]`, `grid-cols-2`, and the `sm` picker column variable.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/RasterStylePanel.test.tsx scripts/__tests__/registry-component-composition.test.ts scripts/__tests__/raster-style-panel-layout.test.ts
```

Expected: FAIL because rows are plain sibling divs, the fixed two-column grid has no mobile collapse, disabled is not public or fully propagated, and registry dependencies omit Field.

- [ ] **Step 3: Compose responsive fields and propagate disabled**

Create a local row composition that distinguishes single controls from grouped choices:

```tsx
function RasterField({ label, controlId, disabled, children }: RasterFieldProps) {
  return (
    <Field
      data-disabled={disabled || undefined}
      className="grid grid-cols-1 gap-1 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-0"
    >
      {controlId ? (
        <FieldLabel htmlFor={controlId} className={labelCls}>{label}</FieldLabel>
      ) : (
        <FieldLegend variant="label" className={cn(labelCls, "mb-0")}>{label}</FieldLegend>
      )}
      <FieldContent className="min-w-0">{children}</FieldContent>
    </Field>
  )
}
```

Replace the root fixed grid with `<FieldGroup className="gap-2.5">`. Give `SelectTrigger` instances stable IDs and use `FieldLabel htmlFor`; use `FieldLegend` plus `aria-label`/`aria-labelledby` for radio groups and multi-input groups. Pass `disabled` to `Select`, `ButtonRadioGroup`, `ButtonRadioGroupItem`, `Segmented`, `ColormapPicker`, `StretchControl`, `DraftInput`, `NumberDraftInput`, and every inline add/remove/edit button. Preserve min-stop disabled state by combining it with the public disabled state.

Change `labelCls` from unconditional `self-center` to `sm:self-center` so stacked mobile labels align to the start.

Add direct registry dependencies and the imported numeric-range source file to both manifests:

```json
"registryDependencies": [
  "@mapseek/button",
  "@mapseek/button-radio-group",
  "@mapseek/color-input",
  "@mapseek/field",
  "@mapseek/input",
  "@mapseek/input-number",
  "@mapseek/select",
  "@mapseek/tooltip",
  "@mapseek/utils",
  "@mapseek/labels"
]
```

Add `raster-style-panel/numeric-range.ts` to `fragment.json` and its mirrored registry entry because `StretchControl.tsx` imports it.

- [ ] **Step 4: Run focused tests and registry validation**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/RasterStylePanel.test.tsx scripts/__tests__/registry-component-composition.test.ts scripts/__tests__/raster-style-panel-layout.test.ts
pnpm run registry:validate
```

Expected: PASS; registry validation reports no missing direct primitive or local-file dependencies.

- [ ] **Step 5: Commit field, disabled, responsive, and registry work**

```bash
git add registry/blocks/raster-style-panel/RasterStylePanel.test.tsx registry/blocks/raster-style-panel/RasterStylePanel.tsx registry/blocks/raster-style-panel/StretchControl.tsx registry/blocks/raster-style-panel/fragment.json registry/blocks/registry.json scripts/__tests__/registry-component-composition.test.ts scripts/__tests__/raster-style-panel-layout.test.ts
git commit -m "fix(raster-style-panel): compose responsive disabled fields"
```

### Task 5: Keyboard- and touch-safe custom colormap removal

**Files:**

- Create: `registry/blocks/raster-style-panel/CustomColormapEditor.test.tsx`
- Modify: `registry/blocks/raster-style-panel/CustomColormapEditor.tsx:33-190`
- Modify: `registry/blocks/raster-style-panel/types.ts:205-215`

**Interfaces:**

- Consumes: existing `Button size="icon-xs"`, semantic destructive tokens, `CustomColormapLabels`.
- Produces: `CustomColormapEditorProps.disabled?: boolean`, always present natively disabled remove controls at the minimum, 24px square targets, focus/touch visibility, and opaque hover background.

- [ ] **Step 1: Add failing removal-action tests**

Create a server-rendered test with local mocks for `Button`, `ColorInput`, and the shared radio group:

```tsx
it("renders square 24px remove actions with an opaque destructive hover", () => {
  const html = renderToStaticMarkup(
    <CustomColormapEditor
      value={{ stops: ["#000000", "#777777", "#ffffff"], interpolation: "linear", colorSpace: "oklch" }}
      labels={labels}
      onChange={() => {}}
    />,
  )
  const remove = html.match(/<button(?=[^>]*aria-label="Remove stop")[^>]*>/)?.[0] ?? ""

  expect(remove).toContain("size-6")
  expect(remove).toContain("bg-background")
  expect(remove).toContain("hover:bg-destructive")
  expect(remove).not.toContain("size-3.5")
  expect(remove).not.toContain("rounded-full")
  expect(remove).not.toContain("opacity-0")
  expect(remove).not.toContain("z-10")
})

it("keeps minimum-stop removal actions present and disabled", () => {
  const html = renderToStaticMarkup(
    <CustomColormapEditor
      value={{ stops: ["#000000", "#ffffff"], interpolation: "linear", colorSpace: "oklch" }}
      labels={labels}
      minStops={2}
      onChange={() => {}}
    />,
  )

  const removeButtons = html.match(/<button(?=[^>]*aria-label="Remove stop")[^>]*>/g) ?? []
  expect(removeButtons).toHaveLength(2)
  for (const button of removeButtons) expect(button).toContain("disabled")
})
```

- [ ] **Step 2: Run the editor test and verify RED**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/CustomColormapEditor.test.tsx
```

Expected: FAIL because remove buttons are omitted at the minimum and otherwise use 14px round, hover-only, ad hoc z-index styling.

- [ ] **Step 3: Implement standard remove actions and editor disabled state**

Add `disabled?: boolean` to `CustomColormapEditorProps`. Always render one remove button per stop with:

```tsx
<Button
  size="icon-xs"
  variant="ghost"
  type="button"
  disabled={disabled || !canRemove}
  aria-label={labels.removeStop}
  title={labels.removeStop}
  onClick={() => removeStop(index)}
  className="absolute -top-2 left-1/2 size-6 -translate-x-1/2 border border-border bg-background p-0 text-muted-foreground hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
>
  <IconX aria-hidden="true" />
</Button>
```

Do not add opacity hiding. Pass `disabled` to color inputs, add-stop action, interpolation/color-space groups, and preset buttons. Keep the hover background semantic and non-transparent.

- [ ] **Step 4: Run editor and composition tests and verify GREEN**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/CustomColormapEditor.test.tsx scripts/__tests__/registry-component-composition.test.ts
```

Expected: PASS with accessible buttons present in all stop-count states.

- [ ] **Step 5: Commit custom colormap action fixes**

```bash
git add registry/blocks/raster-style-panel/CustomColormapEditor.test.tsx registry/blocks/raster-style-panel/CustomColormapEditor.tsx registry/blocks/raster-style-panel/types.ts
git commit -m "fix(raster-style-panel): make stop removal accessible"
```

### Task 6: Showcase announcements, bilingual docs, and real visual QA

**Files:**

- Modify: `showcase/src/showcases/RasterStylePanelShowcase.tsx:1-235`
- Modify: `packages/docs/content/docs/blocks/raster-style-panel.mdx:1-55`
- Modify: `packages/docs/content/docs/blocks/raster-style-panel.en.mdx:1-55`
- Modify: `scripts/__tests__/raster-style-panel-layout.test.ts`
- Modify: `scripts/docs-visual-qa.ts:2903-2922`
- Regenerate: `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`

**Interfaces:**

- Consumes: expanded label contract, existing `localized()` Playwright helper, showcase status hooks.
- Produces: fully localized Chinese and English accessible labels, one polite atomic live announcement, current visual-QA selectors, documented disabled/validation/responsive behavior.

- [ ] **Step 1: Add failing source-level showcase assertions**

Extend `raster-style-panel-layout.test.ts`:

```ts
it("keeps raster status in one polite atomic live region", async () => {
  const showcase = await readFile("showcase/src/showcases/RasterStylePanelShowcase.tsx", "utf8")

  expect(showcase).toContain('aria-live="polite"')
  expect(showcase).toContain("aria-atomic")
  expect(showcase.match(/aria-live=/g)).toHaveLength(1)
  expect(showcase).toContain("colormapStopValue")
  expect(showcase).toContain("stretchStandardDeviation")
})
```

- [ ] **Step 2: Run the source-level test and verify RED**

Run:

```bash
pnpm vitest run scripts/__tests__/raster-style-panel-layout.test.ts
```

Expected: FAIL because the showcase has no live region and does not supply the new internal labels.

- [ ] **Step 3: Localize the showcase and consolidate announcements**

Populate every new label in both locale objects. Chinese examples use Chinese control/error text; English examples use English text. Add one screen-reader status node at the demo section root:

```tsx
<span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
  {valid ? demoLabels.valid : demoLabels.invalid}. {status}
</span>
```

Keep visible validity and action status text, but do not give them additional live-region attributes. Update both MDX documents to describe `disabled`, inline `FieldError`, radio semantics, injectable fallback labels, and the `<640px` collapse.

- [ ] **Step 4: Replace stale raster visual-QA assertions**

Remove checks for the deleted metadata strings `波段数/BANDS`, `尺寸/SIZE`, `最小值/MIN`, and `最大值/MAX`. Verify current behavior instead:

```ts
const panel = demo.locator('[data-slot="field-group"]')
await expect(panel).toBeVisible()
await demo.getByRole("radio", { name: localized(path, "RGB 合成", "RGB composite") }).click()
await expect(demo.locator('[data-demo-status="raster-style-panel"]')).toContainText(
  localized(path, "RGB 合成", "RGB composite"),
)
const sigma = demo.getByRole("spinbutton", {
  name: localized(path, "拉伸标准差", "Stretch standard deviation"),
})
await sigma.fill("0")
await expect(sigma).toHaveAttribute("aria-invalid", "true")
await expect(demo.locator('[data-demo-action="raster-style-panel-save"]')).toBeDisabled()
```

Use `getByRole("spinbutton")`, the role exposed by Base UI `NumberField.Input`, with the exact localized accessible name. At viewports below 640px, assert the first Field has one computed grid column and the picker has two; at wider viewports assert two and four respectively. Preserve save/reset status assertions and `assertNoHorizontalOverflow`.

- [ ] **Step 5: Regenerate sources and run docs/visual checks**

Run:

```bash
pnpm run docs:sources
pnpm run docs:check-i18n
pnpm run docs:check-examples
pnpm run docs:visual
```

Expected: all commands PASS; the raster scenario uses current controls in both locales and narrow/wide viewports.

- [ ] **Step 6: Commit showcase, docs, generated source, and QA**

```bash
git add showcase/src/showcases/RasterStylePanelShowcase.tsx packages/docs/content/docs/blocks/raster-style-panel.mdx packages/docs/content/docs/blocks/raster-style-panel.en.mdx packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts scripts/__tests__/raster-style-panel-layout.test.ts scripts/docs-visual-qa.ts
git commit -m "docs(raster-style-panel): document accessible form behavior"
```

### Task 7: Full verification and design review

**Files:**

- Review: every file committed in Tasks 1-6
- No production file changes are expected unless a verification command exposes a defect.

**Interfaces:**

- Consumes: the completed component, registry entry, showcase, docs, and test coverage.
- Produces: fresh evidence that the approved specification and repository gates pass.

- [ ] **Step 1: Run focused raster suites**

Run:

```bash
pnpm vitest run registry/blocks/raster-style-panel/RasterStylePanel.test.tsx registry/blocks/raster-style-panel/ColormapPicker.test.tsx registry/blocks/raster-style-panel/CustomColormapEditor.test.tsx registry/blocks/raster-style-panel/StretchControl.test.tsx registry/blocks/raster-style-panel/numeric-range.test.ts scripts/__tests__/raster-style-panel-layout.test.ts scripts/__tests__/registry-component-composition.test.ts
```

Expected: PASS with no unhandled errors or warnings.

- [ ] **Step 2: Run repository static gates**

Run:

```bash
pnpm run typecheck
pnpm run lint
pnpm run registry:validate
pnpm run docs:check-i18n
pnpm run docs:check-examples
pnpm run showcase:build
```

Expected: every command exits 0. If Biome reports only formatting in touched files, format those exact files and rerun lint; do not rewrite unrelated files.

- [ ] **Step 3: Run the full test suite**

Run:

```bash
pnpm test
```

Expected: PASS with zero failed tests.

- [ ] **Step 4: Inspect the live block at required states**

At `http://localhost:3000/blocks/raster-style-panel/`, verify Chinese and English pages in light and dark themes at 1280px and 390px widths:

- visible labels and controls are associated;
- invalid sigma and invalid custom stop values show inline error text and `aria-invalid`;
- radio arrow-key navigation and 3px focus rings remain visible;
- `disabled` demo markup cannot be pointer- or keyboard-activated when exercised in a focused fixture;
- remove-stop buttons remain visible and 24px square with an opaque hover background;
- field/picker columns collapse without horizontal overflow;
- Save and Reset update the single polite live announcement.

- [ ] **Step 5: Review the final diff against the specification**

Run:

```bash
git diff --check HEAD~6..HEAD
git status --short
```

Expected: no whitespace errors; only intentional RasterStylePanel, shared custom-colormap editor, registry, showcase, docs, generated-source, and QA files differ from the branch base. Record any unrelated main-workspace changes separately and do not include them.

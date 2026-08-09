# PixelProbe Design Compliance Specification

## Goal

Bring `PixelProbe` and its documentation showcase into full alignment with `DESIGN.md` while preserving its role as a compact, read-only raster pixel inspection panel.

## Scope

This change covers:

- semantic structure and accessible state communication;
- empty, locked, navigation-boundary, and copy-feedback states;
- reuse of Mapseek UI primitives and design tokens;
- long-value overflow and narrow-width behavior;
- bilingual public documentation and regression coverage.

It does not add raster querying, network behavior, loading orchestration, or product-specific state management to the block.

## Public Contract

`PixelProbeLabels` gains two required localized labels:

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

`PixelProbeProps` gains two optional caller-controlled disabled states:

```ts
export interface PixelProbeProps {
  // existing props remain unchanged
  prevDisabled?: boolean
  nextDisabled?: boolean
}
```

The required labels are an intentional TypeScript contract change. They prevent embedded fallback copy and keep every visible or assistive string injectable.

## Component Structure

- The root becomes a named `section` using `labels.title` as its accessible name.
- Field rows use `dl`, `dt`, and `dd` semantics so field names and values retain a machine-readable relationship.
- Direct decorative Tabler icons use `aria-hidden="true"` and a consistent 14px / 1.75 stroke treatment within the header.
- A locked field includes visually hidden `labels.locked` copy in addition to the visible lock icon.
- Numeric values, counts, and the point index use tabular numerals.

## Primitive and Token Usage

- Field-type labels use `Tag color="gray" size="sm"`.
- Enum values use `Tag color="gray"` inside the horizontally scrollable value area.
- The passive count uses a gray `Tag`, not a primary-green custom chip.
- Empty data uses the existing `Empty`, `EmptyHeader`, and `EmptyTitle` primitives in a compact panel layout.
- Ad hoc `gap-[3px]` and `text-[10px]` values are replaced by existing spacing and typography tokens.
- The component remains square, border-first, shadowless, and theme-token driven.

## Long Values

Each value row contains a `min-w-0`, horizontally scrollable, single-line value region. Long identifiers and coordinate strings remain selectable and discoverable without widening or clipping the panel. Unit text is a fixed, readable suffix outside the scrolling region.

## Empty State

When `fields` is empty, the body renders the compact `Empty` composition with `labels.empty`. The header remains available so the panel still has identity and may still expose a close action. Copy and pixel-navigation actions are supplied only when meaningful by the caller.

## Navigation State

- Previous and next buttons render only when their matching callback exists.
- A rendered previous button is disabled when `prevDisabled` is true or when the one-based `index` is `1` or lower.
- A rendered next button is disabled when `nextDisabled` is true or when both `index` and `count` are present and `index >= count`.
- An index may render without navigation buttons.
- Disabled state uses the existing `IconButton` semantics and visual treatment.

## Showcase Behavior

- The panel and empty state use 16px horizontal insets below 640px and a stable 340px width when space permits.
- The example owns three sample points, starts at point 1, and never advances below 1 or above 3.
- The example exercises the component-owned empty state by passing an empty field array instead of replacing the panel with separate markup.
- Copy, close, empty, and navigation status text uses `aria-live="polite"`.
- Light mode, dark mode, keyboard focus, and the 390px viewport must remain free of component overflow.

## Registry and Documentation

- Add `@mapseek/tag` and `@mapseek/empty` to the block registry dependencies.
- Update Chinese and English documentation with the new labels, disabled props, empty-state behavior, boundary behavior, and responsive guarantee.
- Regenerate showcase source output through the existing docs source workflow.

## Testing

Add focused tests before implementation:

1. `PixelProbe` renders a named section, semantic field list, accessible locked state, and `Tag` primitives.
2. Empty fields render the injected `Empty` state.
3. Missing callbacks omit their navigation buttons.
4. Index and count boundaries, plus explicit disabled props, disable the correct controls.
5. Long-value structure provides an inner horizontal scroll region while keeping units fixed.
6. The showcase keeps its panel within 16px narrow-screen insets, exposes a polite live status, and keeps the sample index within its declared count.
7. Existing registry, typecheck, lint, docs, and visual QA suites continue to pass.

## Success Criteria

- No passive primary-green metadata remains in `PixelProbe`.
- No custom Tag, Badge, or empty-state styling remains in the block.
- No enabled no-op navigation buttons can render.
- Locked and empty states are available to assistive technology.
- Long values remain readable and selectable.
- The component fits a 390px viewport without clipping or horizontal overflow.
- All copy remains caller-injected and bilingual documentation matches the public API.

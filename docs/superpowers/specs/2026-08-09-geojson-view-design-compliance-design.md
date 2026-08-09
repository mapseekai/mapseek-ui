# GeoJSONView Design Compliance Specification

## Goal

Bring `GeoJSONView` and its `JsonViewer` dependency into compliance with `DESIGN.md` for accessibility, state visibility, injected labels, control sizing, semantic tokens, reduced motion, and valid HTML semantics while preserving the existing public behavior and the `collapseOn` API.

## Scope

The change covers all eight accepted review findings:

1. Replace the hand-written disclosure button behavior with the existing Base UI `CollapsibleTrigger` primitive and the existing `Button` focus/hover treatment.
2. Replace the local clipboard implementation with the existing `CopyButton`, so a failed clipboard write never produces a copied state.
3. Make copy feedback and item-count copy injectable through the GeoJSON label contract.
4. Give JSON parse failures and unsupported JSON value types distinct, visible states.
5. Remove `transition-all` and honor reduced motion.
6. Keep every control in the viewer toolbar at the 24px `xs` height.
7. Render essential empty-state copy with the normal foreground instead of muted foreground.
8. Replace raw indentation colors with a semantic border token and remove invalid `<pre>` content structures.

Large-tree virtualization and unrelated registry refactors are outside this change.

## Public Interfaces

### `GeoJSONViewLabels`

Extend the existing label object with these required fields:

```ts
export interface GeoJSONViewLabels {
  readonly expandAll: string
  readonly collapseAll: string
  readonly copy: string
  readonly copied: string
  readonly item: string
  readonly items: string
  readonly parseError: string
  readonly unsupportedValue: string
}
```

The default label object remains Chinese and supplies values for every field. Consumers can continue passing a partial `labels` object through `GeoJSONView`.

The existing `emptyLabel`, `expandAllLabel`, and `collapseAllLabel` props remain supported. The two direct expand/collapse props keep precedence over the resolved labels object for backward compatibility.

### `JsonViewerProps`

Keep all current props, including `collapseOn: "click" | "doubleClick"`, and add:

```ts
copyLabel?: string
copiedLabel?: string
itemLabel?: string
itemsLabel?: string
copyContent?: string
```

`copyContent` lets `GeoJSONView` pass its already-formatted input string to `CopyButton`. Other `JsonViewer` consumers fall back to a memoized `JSON.stringify(data, null, 2)` value.

## Component Design

### Toolbar and copy behavior

`JsonViewer` uses `CopyButton` with its icon variant, `label`, `copiedLabel`, and configured duration. The icon variant is already an accessible 24px `IconButton`; success changes both the icon and accessible label. Clipboard errors leave the button in its copy state and never claim success.

Expand, collapse, and copy controls all use the existing `xs` size without local height overrides. The toolbar keeps its current 32px container and compact spacing.

### Disclosure behavior

Every object and array disclosure uses `CollapsibleTrigger` composed with the existing ghost `Button` through Base UI's `render` API. This supplies the trigger/panel relationship, expanded state semantics, keyboard behavior, design-system focus ring, and consistent hover surface.

The default click mode delegates directly to Base UI. Double-click mode suppresses pointer single-click state changes, toggles on double click, and continues to allow Enter or Space to toggle once. Tests must cover both modes so the existing public contract is not weakened.

### GeoJSON fallback states

`GeoJSONView` distinguishes three fallback states:

- Empty: show only the injected `emptyLabel` with normal foreground text.
- Parse error: show `labels.parseError` as a compact destructive status and retain the original source lines.
- Unsupported value: show `labels.unsupportedValue` as a compact warning status and retain the original primitive source.

The status appears in the existing header beside the title and uses text plus semantic color. Parse errors use `role="alert"` with `text-destructive`; unsupported values use `role="status"` with `text-warning`. Parse errors and unsupported values never share the same label.

### Markup and styling

The fallback line viewer becomes a normal scroll container whose rows use semantic `<code>` content; it does not place `<div>` children inside `<pre>`.

The interactive JSON tree also uses normal layout containers rather than wrapping interactive buttons and block elements in `<pre>` or `<code>` elements. Monospaced typography and whitespace handling remain CSS responsibilities.

Default indentation uses `border-border`. Category indentation continues to use the existing category tokens when `showColorIndent` is enabled. Collapsed summaries use the Unicode ellipsis `…`.

The chevron keeps a short transform transition with `motion-reduce:transition-none`. Collapsible panels do not use `transition-all`; any retained transition must name its property and include a reduced-motion override.

## Localization and Documentation

The Chinese and English `GeoJSONView` showcase label maps provide every new label. The English demo must contain no Chinese copy-button text, and the Chinese demo must contain no hard-coded English `item/items` summary.

Both GeoJSONView documentation pages list the expanded label contract and describe the separate parse-error and unsupported-value states. The JSON Viewer documentation lists the new injectable props and existing copy-component behavior.

`registry/ui/registry.json` adds `@mapseek/copy-button` to the `json-viewer` registry dependencies. No new npm dependency is required.

## Testing Strategy

Implementation follows red-green-refactor:

1. Add rendering tests for distinct empty, parse-error, and unsupported-value output.
2. Add `JsonViewer` rendering tests for Base UI disclosure semantics, localized count copy, `CopyButton` composition, uniform `xs` controls, semantic indentation, valid container structure, and motion-safe classes.
3. Add the double-click behavior assertion to the existing Playwright visual-interaction suite in `scripts/docs-visual-qa.ts`, preserving the unrelated edits already present in that file rather than mocking Base UI events in the Node-only Vitest environment.
4. Update registry and documentation checks.
5. Run focused tests first, then typecheck, lint, registry validation/build checks, documentation checks, and the relevant visual QA path.

Tests assert rendered behavior and accessibility output rather than grepping implementation source wherever the current test environment permits.

## Compatibility and Non-Goals

- No current `GeoJSONView` or `JsonViewer` prop is removed.
- Existing Chinese defaults remain available.
- `collapseOn="doubleClick"` remains supported even though the repository currently has no product usage of it.
- The change does not alter GeoJSON parsing, formatting, tree path generation, or expansion defaults.
- Existing unrelated working-tree changes are preserved and excluded from this work.

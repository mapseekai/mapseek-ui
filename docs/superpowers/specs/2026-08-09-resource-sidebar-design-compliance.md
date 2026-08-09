# ResourceSidebar Design Compliance Specification

## Status

Approved for implementation by the user's request to fix the findings from the preceding `DESIGN.md` audit.

## Goal

Bring `ResourceSidebar` and its Showcase acceptance surface into compliance with `DESIGN.md` without changing the public component API or the sidebar's compact information architecture.

## Confirmed Gaps

1. Category rename and remove actions are exposed only through `group-hover`, so keyboard focus skips them and touch discovery is unreliable.
2. Type and category rows render at 34px, outside the 24/28/32/36/40px control scale.
3. Type and category counts do not use tabular numerals.
4. Truncated category labels have no discoverable full value.
5. Two dividers duplicate the existing `Separator` primitive.
6. The Showcase status uses `text-xs` and does not announce updates with status semantics.

## Considered Approaches

### A. Keep hover actions and add `focus-within` visibility — selected

Preserve the compact count-first row at rest. Reveal rename/remove actions on pointer hover or when any control in the category row has focus. Hide the count under the same conditions. This preserves density while creating a keyboard path from the category button to its actions.

### B. Keep actions permanently visible

This maximizes discoverability but removes the count from every editable row and increases visual noise in the dense rail.

### C. Replace actions with a persistent overflow menu

This gives one stable action target but changes interaction structure, adds menu behavior, and exceeds the scope of the identified compliance repair.

## Component Design

### Row geometry

- Type rows and category rows render at exactly 32px (`h-8`).
- Existing selection surface, primary text, `aria-pressed`, and the type-row primary edge remain unchanged.
- Existing ordinary `hover:bg-accent/50` and selected-hover persistence remain unchanged.

### Category actions

- Editable category actions appear for `group-hover/cat` and `group-focus-within/cat`.
- The category count hides for both states.
- Focusing the category selection button reveals the actions before the next Tab key press, so focus can proceed to Rename and Remove.
- Rename and Remove retain injected accessible names, native titles, and Tooltips.

### Counts and overflow

- Every resource count uses `tnum` in addition to the existing monospaced body-sm token.
- A truncated category label exposes its injected full label through native `title`.

### Composition

- Both hand-built 1px divider elements are replaced with the existing `Separator` primitive.
- The resource-sidebar registry item declares `@mapseek/separator`.

## Showcase Design

- The mutable status uses `role="status"`.
- Its typography is `text-body-sm text-muted-foreground`; no raw `text-xs` scale is used.
- Existing localized status copy and controlled interactions remain unchanged.

## Documentation

- Chinese and English accessibility sections describe `aria-pressed`, focus-accessible category actions, and discoverable truncated labels.
- The generated Showcase source catalog is refreshed after implementation.
- `TODO.md` marks the ResourceSidebar portions of the truncation and count findings as resolved while retaining unrelated components.

## Testing and Acceptance

- Component regression tests prove 32px row classes, `tnum`, native label titles, `Separator` composition, and focus-within action visibility classes.
- Showcase regression coverage proves `role="status"` and `text-body-sm`.
- Browser QA proves both row types are 32px, counts compute to `tabular-nums`, the full title exists, focus reveals actions, Tab reaches Rename, and the status has live-region semantics.
- Existing selected-row tests, registry validation, documentation checks, type checking, design lint, and production documentation build remain green.

## Non-goals

- No new loading, empty, or error Props.
- No change to rename/remove callback semantics or confirmation ownership.
- No responsive rail redesign and no public type changes.

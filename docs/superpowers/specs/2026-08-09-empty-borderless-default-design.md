# Empty Borderless Default Design

## Context

`Empty` currently applies an outer dashed border to every empty state. The
component should instead be borderless by default, matching the upstream
shadcn composition while allowing consumers to opt into an outline.

## Decision

- Remove `border`, `border-dashed`, and `border-border` from the `Empty` root
  classes.
- Keep all layout, spacing, background, typography, and `EmptyMedia` styles
  unchanged.
- Continue accepting `className`, so consumers can add `border` or another
  outline treatment explicitly.
- Preserve the `attr-table` destructive error outline by adding an explicit
  `border` utility where its destructive border color is already specified.
- Leave existing `border-0` consumer overrides in place to avoid unrelated
  cleanup.

## Verification

- Add a focused component regression test showing that `Empty` is borderless
  by default and still accepts an explicit border class.
- Update the existing `attr-table` assertion to require its destructive state
  to include an explicit border.
- Run the focused tests and the relevant project checks.

## Scope

The change is limited to the `Empty` primitive, the `attr-table` consumer that
intentionally retains an outline, and their tests. No public API changes are
introduced.

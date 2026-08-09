# CrsPicker Command Compliance Design

**Date:** 2026-08-09  
**Status:** Approved for implementation

## Goal

Make `CrsPicker` compose the shared search primitive, preserve controlled and
uncontrolled CRS selection, and meet the relevant `DESIGN.md` requirements for
input contrast, accessibility, narrow widths, and keyboard navigation.

## Decision

Use the existing `Command` primitive rather than a locally assembled `Input` or
`InputGroup`. `Command` already composes the standard input group, grouped
results, empty state, and roving keyboard navigation; `Combobox` is not used
because the picker intentionally keeps its result list visible instead of using
a popup.

`CrsPicker` will become a `Command` surface with:

- `CommandInput` for the 32px search field, backed by the shared input group.
- `CommandGroup`, `CommandItem`, `CommandList`, and `CommandEmpty` for the
  grouped CRS result list.
- A localized `searchLabel` passed as the input's accessible name.
- `data-checked` for persistent CRS selection, so the existing selection fill,
  primary text, and check indicator remain distinct from keyboard highlight.
- `max-w-full` alongside the existing 280px preferred width.

## Behavior

- Filtering continues to match EPSG codes and CRS names. Command item keywords
  preserve the current matching scope while leaving visible row content intact.
- Pointer selection, controlled values, uncontrolled defaults, overrides, and
  `onChange` retain their current public behavior.
- Arrow-key movement and Enter-based selection follow the shared `Command`
  primitive instead of custom per-row focus code.
- The selected CRS remains visibly persistent, while the active keyboard result
  uses the standard transient accent treatment.

## Registry and Documentation

- Add `@mapseek/command` to the block's fragment dependencies.
- Update the public label type and defaults with `searchLabel`; this is an
  additive localization option and does not break existing callers.
- Keep the existing documentation's accessibility statement accurate by
  documenting the explicit search label.

## Verification

- Extend CrsPicker's focused tests to assert shared Command composition,
  accessible search labeling, persistent selection treatment, and narrow-width
  protection.
- Run focused tests, type checking, Biome on changed files, and applicable
  registry/design checks.
- Verify in the local documentation page that search filtering, keyboard
  navigation, selection, and a narrow viewport behave correctly.

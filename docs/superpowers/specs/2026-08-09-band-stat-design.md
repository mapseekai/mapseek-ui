# BandStat design-compliance remediation

**Status:** approved scope · **Date:** 2026-08-09

## Goal

Bring the BandStat header and metric strip into conformance with `DESIGN.md` while preserving the existing public data and label contracts.

## Scope

1. Replace the hand-styled `data.type` span with the shared static `Tag` primitive using `color="orange"` and `size="sm"`.
2. Make the four statistics responsive: two columns below the `sm` breakpoint and four columns at `sm` and above. Preserve a single outer 1px border and correct interior separators at both widths.
3. Prevent a long band name from colliding with the type Tag by making its flex item shrinkable and truncated, while exposing the full value through its native title.

## Design decisions

- The type is short categorical metadata, so it uses the primitive Tag rather than warning styling. Orange is the approved category color; the compact 16px `sm` tier keeps the header dense.
- The four metrics retain their existing order. On small screens the first two form the first row and the last two form the second. At `sm` they return to one row; divider classes must adapt so no doubled or missing borders appear.
- The band chip remains unchanged. It continues to signal the currently displayed band in the existing demo; this change does not redefine its semantic role.
- No copy, data shape, chart configuration, or interaction behavior changes.

## Verification

- Add focused component coverage for the orange small Tag contract, responsive metric grid classes, and long-name truncation/title contract.
- Run the affected test suite and the project's relevant type/lint check.
- Visually inspect the BandStat showcase at a narrow viewport and at the existing desktop width.

## Non-goals

- Introducing a data-type-to-color mapping system.
- Changing the chart, metric values, localization contracts, or the band selector behavior.

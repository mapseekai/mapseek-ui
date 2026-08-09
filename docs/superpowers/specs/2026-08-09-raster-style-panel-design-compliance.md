# RasterStylePanel Design Compliance Specification

## Goal

Bring `RasterStylePanel` and its related controls into full alignment with `DESIGN.md`, with complete field semantics, localized assistive copy, true disabled behavior, responsive layout, and visible validation feedback.

## Scope

This change covers:

- field structure, labels, validation messages, and status announcements;
- selection semantics for render mode, mosaic mode, and colormap choices;
- a public disabled state propagated through every interactive control;
- localization of visible and assistive copy owned by the block;
- keyboard, touch, and focus behavior for custom-colormap stop controls;
- layouts below the 640px breakpoint;
- registry metadata, bilingual documentation, and regression coverage.

It does not change raster styling data semantics, add network behavior, move product state into the block, or add a cross-project form framework.

## Public Contract

`RasterStylePanelProps` gains a caller-controlled disabled state:

```ts
export interface RasterStylePanelProps {
  // existing props remain unchanged
  disabled?: boolean
}
```

When disabled, all native inputs, number steppers, selects, radio choices, add/remove actions, and custom-editor triggers are actually disabled. Wrapper-only `pointer-events` suppression is not accepted because it leaves keyboard activation available.

`RasterStylePanelLabels` expands with injectable fallback copy for labels currently embedded in implementation code:

- render-mode and render-choice labels;
- indexed colormap-stop value and color labels;
- add/remove stop labels and NoData color/value labels;
- indexed custom-stretch minimum and maximum labels;
- percentile-low, percentile-high, and standard-deviation labels;
- invalid-number, invalid-color, increment, and decrement assistive labels.

Indexed labels use functions receiving a one-based position. The existing `RasterStyleLabels & Partial<RasterStylePanelLabels>` contract remains source-compatible: callers may override every new string while existing callers receive the block defaults.

Internal helper props gain `disabled`, error-message, and accessible-description inputs only where required to implement the public contract. No new `readOnly` API is introduced because select and radio controls do not share a reliable native read-only model.

## Field Structure and Validation

- Form rows are composed with the existing `FieldGroup`, `Field`, `FieldLabel` or `FieldLegend`, and `FieldError` primitives.
- Labels for single controls are associated by `htmlFor` and `id`; grouped choices use fieldset/legend or an equivalent labelled group relationship.
- Each draft value keeps its current commit-on-valid behavior, but an invalid draft now sets `aria-invalid="true"`, references its inline error through `aria-describedby`, and renders the injected `FieldError` message beside that field.
- The aggregate validity callback remains available for disabling Save, but it is no longer the only place where an error is exposed.
- Generated IDs use React ID utilities so multiple panels can coexist without collisions.

## Selection Controls

- Render mode and mosaic-pixel selection use the existing Base UI-backed radio-group composition instead of custom button state.
- `ColormapPicker` exposes one labelled radio group with one radio item per colormap. The selected item is conveyed through native radio semantics rather than only `data-selected` styling.
- Selection styling remains border-first, square, shadowless, and token-driven.
- Disabled state is applied to the actual radio items and triggers, preserving correct tab order and preventing keyboard activation.

## Custom Colormap Actions

- Stop removal uses the standard 24px compact icon-button size without pill rounding or ad hoc stacking values.
- The remove action is visible on touch layouts and whenever the stop row contains keyboard focus. Hover-capable layouts may use progressive disclosure only when the same action remains discoverable through focus.
- Hover keeps a semantic, opaque destructive surface rather than becoming transparent.
- Add/remove controls preserve injected accessible names and expose native disabled state at the minimum-stop boundary and when the panel is disabled.

## Responsive Layout

- Each field row stacks its label above the control below 640px and returns to the compact 72px label column at `sm` and wider.
- The colormap grid uses two columns below 640px and four columns when space permits.
- Controls keep `min-w-0` containment so long localized labels do not widen the panel.
- The desktop density, 32px standard controls, 24px compact groups, zero radius, no-shadow treatment, and 3px focus ring remain unchanged.

## Status Communication

Showcase validity, save, and reset feedback uses a polite, atomic live region. Repeated edits must update the same status node rather than creating competing announcements.

## Registry and Documentation

- Add `@mapseek/field` to registry dependencies, together with any missing direct primitive dependencies revealed by the final composition.
- Update Chinese and English documentation for the new `disabled` prop, injectable internal labels, inline validation behavior, radio semantics, and responsive guarantee.
- Update the showcase labels so the Chinese example has no embedded English accessible names.
- Correct the raster-style visual-QA scenario so it targets controls and labels that the current component actually renders.
- Regenerate source-catalog output through the existing docs workflow when source files change.

## Testing

Add failing tests before implementation for:

1. labels and controls having programmatic relationships through Field primitives;
2. invalid number and color drafts exposing `aria-invalid`, `aria-describedby`, and injected inline errors;
3. render, mosaic, and colormap choices exposing radio-group semantics and selected state;
4. `disabled` reaching every interactive control and preventing callback-driven changes;
5. all previously embedded strings being supplied through resolved labels;
6. remove-stop actions being focus/touch discoverable, 24px square, non-pill, and natively disabled at the minimum;
7. field and colormap grids switching at the 640px breakpoint;
8. showcase status using a polite, atomic live region;
9. existing registry, typecheck, lint, docs, and visual-QA suites continuing to pass.

## Success Criteria

- Invalid drafts identify themselves and their inline error without relying on the Save button.
- No block-owned English copy remains embedded in `RasterStylePanel`, `StretchControl`, or their accessible control labels.
- Mutually exclusive custom controls expose radio semantics and visible keyboard focus.
- `disabled` prevents pointer and keyboard interaction on every control.
- Remove-stop actions are usable with pointer, keyboard, and touch, and retain a non-transparent hover background.
- The component fits a 390px viewport without fixed two-column field rows or a four-column colormap squeeze.
- The Chinese showcase exposes localized accessible names and announces async status changes.
- All design-system, registry, documentation, and regression checks pass.

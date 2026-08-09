# NumberRangeInput design-compliance remediation

## Context

`NumberRangeInput` combines a numeric input and a single-thumb slider for compact GIS settings such as opacity, zoom, and percentages. The current block follows the semantic palette and square visual language, but its public accessibility contract does not actually name the slider thumb, invalid typed values are not exposed through the field validation contract, `defaultValue` does not create a usable uncontrolled value, and the showcase collapses the slider to zero width at narrow viewports.

The remediation must preserve the existing shared Slider thumb geometry and pointer target. The user explicitly excluded pointer-target changes from this work.

## Considered approaches

1. Keep the public capability set, implement real controlled and uncontrolled behavior, and make accessible naming type-safe. Extend the shared Slider only with optional thumb-label forwarding, then align validation, sizing, the showcase, documentation, and tests. This is a focused public-contract tightening without changing the component's purpose. **Selected.**
2. Keep all accessibility props optional and add runtime fallbacks or development warnings. This is more source-compatible, but it still permits inaccessible output and does not fully satisfy the design contract.
3. Remove `defaultValue` and support controlled usage only. This simplifies the state model but creates a larger breaking change and discards an already documented capability.

## Scope

The implementation may change:

- `registry/blocks/number-range-input/`;
- the shared `registry/ui/slider.tsx` API only where required to forward an accessible thumb label;
- the `InputNumber` range adapter in `registry/blocks/form-inputs/InputNumber.tsx`;
- NumberRangeInput tests, showcase, generated showcase source, registry metadata if required, and bilingual documentation.

The implementation must not change Slider track, thumb, focus-ring, hover-ring, or pointer-target geometry. Unrelated component behavior and styling are out of scope.

## Public API

Keep the existing numeric props and class overrides. Add:

- `id` for the numeric input and native visible-label association;
- `sliderAriaLabel` for the actual slider thumb when the compound control is named by a visible external label;
- `aria-labelledby` for the compound group and numeric input;
- `aria-describedby` for field description and error association;
- `aria-invalid` for caller-owned validation state;
- `autoComplete`, defaulting to `"off"`, for the numeric input.

Accessible naming is a type-level requirement. A caller must choose one contract:

1. provide `aria-label`; `sliderAriaLabel` is optional and defaults to the same string; or
2. provide `aria-labelledby` plus `sliderAriaLabel`; the visible label names the group and numeric input, while the injected slider label names the Base UI thumb input.

The shared Slider primitive gains an optional `getAriaLabel(index)` prop that is forwarded to each `SliderPrimitive.Thumb`. It does not gain any visual or geometry changes.

`InputNumber` keeps ordinary non-range calls unchanged. Its `allowRange: true` contract must supply the accessible label required by `NumberRangeInput`; the range branch forwards the new ARIA attributes.

## Controlled and uncontrolled state

- Treat the component as controlled when the `value` property is present on the props object, including `value={undefined}` for an explicitly cleared controlled field.
- In uncontrolled mode, initialize the committed value from `defaultValue` and keep subsequent valid slider or numeric edits locally.
- In controlled mode, use `value` as the committed source and notify through `onChange`; local dirty text may remain while the user is actively editing, then resynchronize after commit or blur.
- Keep a separate dirty string/number state so partial or invalid numeric text can be shown without corrupting the committed numeric value.
- Slider changes remain clamped to `min`/`max` and snapped to `step` precision in both modes.
- A cleared value remains `undefined`; zero remains a valid value and must never be treated as empty.

## Validation and accessibility behavior

- Compute internal invalid state while the numeric input contains a non-numeric or out-of-range dirty value.
- Merge internal invalid state with caller-provided `aria-invalid`.
- Apply the effective invalid state to the numeric input and compound slider group so the existing destructive border/ring styles and assistive semantics activate.
- Forward `aria-describedby` to both representations of the value at the group/input boundary. Caller-owned `FieldDescription` and `FieldError` remain responsible for explanatory and localized copy.
- On blur, an internally invalid dirty value returns to the last committed value; external invalid state remains until the caller clears it.
- The numeric input receives `id`, `name`, `required`, `disabled`, `autoComplete`, and the selected accessible-name contract.
- The actual Base UI thumb input receives a non-empty accessible name through `getAriaLabel`; labeling only the Slider root group is insufficient.
- Keyboard Arrow keys, pointer dragging, focus rings, input typing, and synchronized values remain supported.

## Visual and responsive behavior

- Remove the local `h-7` override so the numeric input uses the standard 32px Input height required by `DESIGN.md`.
- Preserve 13px `text-body-md`, tabular numerals, transparent input surface, semantic borders, zero radius, and shadowless treatment.
- Preserve the Slider's current 12px square thumb, track, focus ring, and current pointer target exactly.
- Keep the inline slider/input arrangement when sufficient width exists.
- The showcase field row must stack its label and control below 640px instead of reserving a fixed 150px label column. The slider must retain measurable width at a 320px viewport.
- Use `text-body-sm` and `text-body-md` tokens instead of `text-xs` or arbitrary pixel text utilities.

## Showcase and documentation

- Replace generic label spans with the shared Field composition and associated `FieldLabel`/description/error primitives.
- Retain integer, `0.5`, and `0.001` step examples.
- Add explicit required/invalid and disabled states with localized labels and error copy.
- Keep the clear/reset action and controlled JSON output.
- Make field rows responsive and keep all visible controls usable at 320px.
- Update Chinese and English docs with the strict naming union, real `defaultValue` behavior, validation ownership, new ARIA props, 32px input height, and unchanged Slider pointer geometry.
- Regenerate the showcase source catalog so displayed source exactly matches the showcase file.

## Testing

Add a dedicated `NumberRangeInput` test file and extend shared/adaptor tests as needed. The test suite must cover:

- the RED state for missing current behavior before implementation;
- a slider thumb accessible name produced from `aria-label`;
- visible-label mode using `aria-labelledby` plus `sliderAriaLabel`;
- forwarding `id`, `aria-describedby`, `aria-invalid`, and `autoComplete`;
- internal invalid state for out-of-range typed values and reset to the committed value on blur;
- external invalid state remaining caller-controlled;
- controlled changes, controlled clearing with `value={undefined}`, and uncontrolled initialization/updates from `defaultValue`;
- integer and decimal step snapping;
- the standard 32px Input class contract;
- no change to Slider pointer-target classes;
- responsive showcase structure, design-token typography, disabled state, required/invalid state, and accessible Field composition.

Run focused tests in RED before implementation and GREEN afterward. Final verification includes focused tests, shared design tests, Biome, TypeScript, registry validation, bilingual documentation checks, showcase source checks, showcase build, and the full Vitest suite with unrelated baseline failures reported separately.

Browser acceptance must verify:

- the thumb and spinbutton both have accessible names;
- Arrow keys update both value representations;
- an out-of-range typed value exposes invalid semantics and a visible error treatment;
- the numeric input is 32px high;
- light and dark themes remain readable and shadowless;
- at 320px the field label stacks and the slider retains non-zero width;
- disabled and required/invalid showcase states are understandable without color alone;
- the console has no NumberRangeInput errors.

## Compatibility

Visual changes are limited to restoring the standard 32px numeric input, exposing the existing destructive invalid treatment when validation fails, and making the showcase responsive. Existing controlled callers that already provide `aria-label` remain source-compatible. Callers without an accessible name must add one, and callers using only a visible label must add `sliderAriaLabel` so the hidden Base UI range input is named. `defaultValue` becomes a true uncontrolled initial value instead of a slider fallback/placeholder-only value.

The Slider's visual classes and pointer-target classes remain byte-for-byte unchanged except for any formatting required around the new semantic prop.

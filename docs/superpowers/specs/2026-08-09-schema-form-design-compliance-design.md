# SchemaForm Design Compliance Specification

## Goal

Bring `SchemaForm` into full alignment with `DESIGN.md` while preserving existing call sites. The component remains a schema-driven, domain-free form body, but its documented `values` prop becomes the single visible state source and its public API gains optional hooks for validation, form metadata, localized empty states, and accessible error rendering.

## Compatibility Contract

The change is additive for consumers:

- Existing `fields`, `values`, `onChange`, `idPrefix`, and `className` props remain valid.
- Existing field definitions remain valid.
- New props and field metadata are optional.
- `seedSchemaFormValues(fields)` remains the supported way to initialize field defaults.
- The intentional behavior correction is that later `values` updates now update number, text, and select controls. Consumers that relied on stale uncontrolled DOM values are brought into the documented controlled contract.

No form library, submission engine, data fetching, routing, or product-specific validation copy is added.

## Public API

`SchemaFormProps` gains:

```ts
export interface SchemaFormLabels {
  emptyOptions: string
}

export interface SchemaFormProps {
  fields: SchemaFormField[]
  values: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  errors?: Readonly<Record<string, string | undefined>>
  labels?: SchemaFormLabels
  idPrefix?: string
  className?: string
}
```

The block exports injectable English and Simplified Chinese label sets. English remains the default when `labels` is omitted.

Every field kind gains an optional `name`. Number and text fields also gain optional `autoComplete`; text fields gain optional `spellCheck`. Select fields gain the same optional `emptyHint` already available to multiselect fields. When a field-specific `emptyHint` is absent, the component uses `labels.emptyOptions`.

Generated form names default to `field.name ?? field.key`. Number and text autocomplete defaults to `"off"`, matching the repository's non-auth form convention.

## Controlled State Flow

`values` is the only current-value source:

- Number inputs render the finite numeric value at `values[key]`, otherwise an empty string.
- Text inputs render the string at `values[key]`, otherwise an empty string.
- Select renders the string at `values[key]`, otherwise `null`.
- Multiselect checkboxes remain controlled by the string array at `values[key]`.

`default` is not read directly while rendering controls. It is consumed only by `seedSchemaFormValues`, so reset actions and external updates remain visible without remounting the component or losing focus.

## IDs and Form Metadata

`SchemaForm` uses React `useId()` to generate an instance-specific prefix when `idPrefix` is omitted. An explicit `idPrefix` continues to override the generated value. Field, option, description, and error IDs derive from the resolved prefix, preventing duplicate label relationships when multiple forms use the same field keys.

Number and text inputs receive `name`, `autoComplete`, and their existing native type metadata. Select receives its `name` through the Base UI root. Multiselect checkboxes share the field name and use each option value as their form value.

## Required, Invalid, and Error Semantics

Required number and text inputs receive native `required`. Required select receives Base UI's root-level `required`, while its trigger exposes matching `aria-required`. The multiselect fieldset exposes the group's required state without incorrectly marking every checkbox as independently required.

For `errors[key]` containing non-empty text:

- The surrounding `Field` or `FieldSet` receives `data-invalid`.
- The interactive control, select trigger, or multiselect group receives `aria-invalid="true"`.
- The control references a stable error ID with `aria-describedby`.
- A `FieldError` with that ID renders the injected message and announces it with the primitive's existing `role="alert"` behavior.

The component does not invent validation messages. The caller owns localized error text and decides when errors become visible.

## Validation Semantics

`isSchemaFormValid` validates field values, not only presence:

- Missing optional fields are valid unless an explicit multiselect `min` requires a count.
- Required text and select fields need a non-empty string.
- A supplied number must be finite and satisfy declared `min` and `max`; a required number must be supplied.
- A multiselect value must be a string array when supplied. Required multiselect defaults to a minimum of one selection, and an explicit `min` is always enforced.

The validator continues to return a boolean and remains independent from localized error rendering.

## Empty States

Empty select and multiselect option collections render the shared `Empty` composition with an injected title. The compact empty state stays inside the existing bounded option surface and does not introduce a new color, shadow, radius, or oversized spacing treatment.

The registry item adds the existing Empty primitive as an explicit dependency. Empty copy comes from `field.emptyHint ?? labels.emptyOptions`; no non-injectable product copy is embedded in the block.

## Showcase and Documentation

The bilingual showcase demonstrates:

- Controlled number, text, select, and multiselect values.
- Reset visibly clearing or reseeding every field.
- Localized field errors wired through `SchemaForm.errors`.
- A polite live validity status.
- Localized empty-option copy for both select and multiselect paths.
- Placeholder examples ending with the Unicode ellipsis character.

The bilingual documentation describes the controlled contract, new optional props, validation rules, form metadata defaults, empty states, and error ownership. Generated showcase source is regenerated through `pnpm run docs:sources` rather than edited as a source of truth.

The visual-QA selector for the showcase-only checkbox uses its accessible checkbox role instead of `getByLabel`, avoiding Base UI's root/hidden-input double match. Existing unrelated edits in `scripts/docs-visual-qa.ts` and generated files must be preserved.

## Testing Strategy

Implementation follows red-green-refactor:

1. Extend `SchemaForm.test.tsx` with failing behavioral markup tests for controlled values, reset-compatible rerenders, unique generated IDs, names/autocomplete, required semantics, error relationships, and empty states.
2. Add focused validator tests for optional fields, required fields, finite numbers, numeric bounds, and multiselect minimums.
3. Implement the minimal type, label, component, validator, registry, showcase, and documentation changes needed to pass.
4. Run the focused SchemaForm tests, registry composition/style tests, TypeScript, Biome, registry validation, bilingual documentation checks, generated source checks, and the SchemaForm-only visual-QA path.
5. Verify light/dark and desktop/mobile visual cases through the existing docs visual runner, including keyboard interaction and horizontal overflow checks.

## Non-Goals

- No async validation, touched/dirty tracking, submit orchestration, or automatic focus management is added.
- No new field kinds, conditional field visibility, dynamic option loading, or schema parser is added.
- The component does not derive human-readable error messages from field labels.
- Primitive styling and theme tokens remain unchanged.
- Unrelated `DESIGN.md` lint warnings and unrelated working-tree changes are outside this repair.

# JsonEditor design-compliance remediation

## Context

`JsonEditor` is visually close to the Mapseek data-editor pattern, but its current contract and showcase diverge from `DESIGN.md` in keyboard focus visibility, editor naming, theme contrast, semantic color use, typography, and persistent-selection semantics. The documented `light`, `dark`, and `none` shortcuts also bypass the Mapseek runtime theme and can produce nearly white text on a white editor when `light` is selected inside the dark application theme.

## Considered approaches

1. Keep `light`, `dark`, and `none` and patch only the observed contrast combination. This preserves the API but cannot guarantee Mapseek token compliance for every host theme.
2. Keep all shortcuts and introduce complete standalone light/dark editor token sets. This preserves compatibility but creates a second theme system and expands the work into theme registry and design-contract changes.
3. Restrict `JsonEditorTheme` to `"app" | Extension`, keep `app` as the default, and remove the shortcut selector from the showcase. Consumers that need an isolated theme can still provide a complete CodeMirror `Extension`. This keeps Mapseek-owned rendering on semantic runtime tokens and avoids a competing palette. **Selected.**

Repository search found no production consumer using the removed string shortcuts; only `JsonEditorShowcase` exercises them.

## Public API

- `JsonEditorTheme` becomes `"app" | Extension`.
- `theme` remains optional and defaults to `"app"`.
- A custom `Extension` remains supported for specialist embedding use cases, but Mapseek documentation guarantees design-system conformance only for `theme="app"`.
- `value`, `onChange`, title, focus callbacks, scrolling, and class override props remain unchanged.

## Accessibility and focus

- Generate a stable title identifier with React `useId` when a visible title is rendered.
- Add a CodeMirror `EditorView.contentAttributes` extension on every render configuration:
  - use `aria-labelledby` with the visible title identifier when `title` is present;
  - otherwise use the injected `ariaLabel` as the editable textbox's `aria-label`.
- Apply the same label source to the surrounding `fieldset`, so the group and its editable control expose consistent names.
- Keep CodeMirror's internal outline suppression, but replace it at the fieldset boundary with `focus-within:border-ring`, `focus-within:ring-3`, and `focus-within:ring-ring/20`.
- Preserve CodeMirror's existing `aria-multiline`, spellcheck suppression, lint live region, and keyboard behavior.

## Visual tokens

- Increase editor text from the non-token 12px size to the 13px `body-md` size defined by `DESIGN.md`.
- Continue using `var(--font-mono)` and the existing 1.5 code line height.
- Change JSON property-name highlighting from reserved `var(--primary)` to `var(--cat-1)`; selection and matching-bracket states continue to use the selection and primary focus tokens.
- Preserve the square 1px input boundary, semantic background/gutter surfaces, shadowless treatment, 4px-based spacing, wrapping, and dark-mode token behavior.

## Showcase and documentation

- Remove the `app/light/dark/none` selector and its local button styling from `JsonEditorShowcase`.
- Keep two acceptance examples: an untitled app-theme editor with focus status and a titled app-theme editor.
- Replace arbitrary 11px and 10px classes with the existing `text-body-sm` metadata and `text-body-md` data styles.
- Update both documentation locales to describe the narrowed theme contract and custom `Extension` escape hatch.
- Regenerate the showcase source catalog so the displayed source matches the source-owned showcase.

## Testing

- Add a focused `JsonEditor` test that renders the component with CodeMirror mocked only at the React wrapper boundary, then evaluates the real CodeMirror extension set through `EditorState`:
  - untitled editors expose the injected `ariaLabel` on the content facet;
  - titled editors connect the fieldset, visual title, and CodeMirror content through one stable identifier;
  - the fieldset contains the required `focus-within` ring classes.
- Add source-contract assertions for the narrowed `JsonEditorTheme`, 13px editor text, and category-based property-name color.
- Add a showcase test confirming that only app-theme examples remain, no theme action buttons render, and metadata/data typography uses design tokens.
- Run the focused tests in RED before implementation and GREEN afterward.
- Run Biome, TypeScript, documentation example checks, registry validation, the full Vitest suite, and browser checks in light and dark modes.
- Browser acceptance must confirm that the textbox has an accessible name, the focused fieldset displays a 3px ring, both examples stay square and shadowless, app-theme foreground/background remain readable in light and dark modes, and the console has no errors.

## Compatibility

Removing the three shortcut strings is an intentional public type narrowing. No in-repository production consumer depends on them. External consumers receive a TypeScript error and can either use the default `app` theme or pass an explicit CodeMirror `Extension` that owns its complete foreground/background contract.

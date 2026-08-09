# JsonEditor design-compliance remediation

## Context

`JsonEditor` is a standalone, externally reusable block. It must fit the Mapseek application by default while also supporting predictable rendering when embedded outside the application theme. Its current showcase documents `light`, `dark`, and `none`, but those shortcuts do not style the complete editor shell and can produce mismatched or unreadable foreground/background combinations.

The component also needs an accessible name, design-token typography and syntax colors, and a clear distinction between CodeMirror's internal editing feedback and the surrounding fieldset boundary. The fieldset must not change border or add a ring when the editor receives focus; the caret, selection, active line, and other internal editing states remain available.

## Considered approaches

1. Provide complete internal `light` and `dark` themes for the editor shell, header, gutters, content, and syntax, while retaining `app`, `none`, and custom CodeMirror extensions. This makes the standalone modes independent of the host application's theme and keeps the full public contract. **Selected.**
2. Pass the `light` and `dark` strings directly to the CodeMirror React wrapper. This is smaller, but only styles CodeMirror and can leave the surrounding shell/header inconsistent or produce contrast gaps.
3. Add third-party CodeMirror theme packages. This provides ready-made palettes, but adds dependencies and visual conventions that do not match the Mapseek design language.

## Public API

- `JsonEditorTheme` is `"app" | "light" | "dark" | "none" | Extension`.
- `theme` remains optional and defaults to `"app"`.
- `app` uses Mapseek semantic runtime tokens and follows the host application's light/dark state.
- `light` and `dark` are complete, component-owned themes. Their shell, header, editor, gutter, interaction, and syntax colors do not change with the host application's theme.
- `none` adds no component-owned color palette or CodeMirror color theme. Layout, typography, accessible naming, and editor behavior remain; the consumer owns appearance through inherited styles, class overrides, CSS, or extensions.
- A custom CodeMirror `Extension` remains supported for specialist embedding. The consumer owns the extension's foreground/background contract.
- `value`, `onChange`, title, focus callbacks, scrolling, and class override props remain unchanged.

## Theme architecture

- Resolve the public `theme` value in one internal path rather than allowing the wrapper and surrounding shell to select themes independently.
- Continue to pass `theme="none"` to the CodeMirror React wrapper so it does not silently add a second built-in palette.
- `app` supplies the existing semantic Mapseek editor theme and highlight style.
- `light` and `dark` each supply a local palette for the outer fieldset, optional title header, editor surface, content text, gutters, active line, selection, matching brackets, tooltips, lint UI, and JSON syntax categories.
- Apply standalone palette values locally to the component so a light editor remains light inside a dark host and a dark editor remains dark inside a light host. The standalone themes must not depend on a parent `.dark` selector.
- `none` supplies no color extensions and adds no theme-specific palette variables or color classes to the shell. Base structural styles such as the one-pixel square boundary, spacing, sizing, wrapping, and typography remain.
- Keep palette resolution and structural styling separate so accessibility and layout behavior are identical across all theme modes.

## Accessibility and focus

- Generate a stable title identifier with React `useId` when a visible title is rendered.
- Add a CodeMirror `EditorView.contentAttributes` extension on every render configuration:
  - use `aria-labelledby` with the visible title identifier when `title` is present;
  - otherwise use the injected `ariaLabel` as the editable textbox's `aria-label`.
- Apply the same label source to the surrounding `fieldset`, so the group and its editable control expose consistent names.
- Remove `focus-within:border-ring`, `focus-within:ring-3`, and `focus-within:ring-ring/20` from the fieldset. Focusing the editor must not alter the outer border or add an outer ring.
- Preserve CodeMirror's internal editing feedback, including the caret, active line, selection, and matching-bracket states.
- Preserve CodeMirror's existing `aria-multiline`, spellcheck suppression, lint live region, keyboard behavior, and the component's `onFocus`/`onBlur` callbacks.

## Visual tokens

- Use the 13px `body-md` editor size defined by `DESIGN.md`, `var(--font-mono)`, and the existing 1.5 code line height in every theme.
- In `app`, use `var(--cat-1)` for JSON property names instead of reserved `var(--primary)`; selection and matching-bracket states continue to use semantic selection/focus tokens.
- Standalone `light` and `dark` palettes must meet readable text/background contrast and keep syntax categories distinguishable without relying only on saturation.
- Preserve the square one-pixel input boundary, shadowless treatment, 4px-based spacing, wrapping, and existing component dimensions.

## Showcase and documentation

- Add an accessible single-selection `ToggleGroup` outside `JsonEditor` with `app`, `light`, `dark`, and `none` options. Do not implement the selector as hand-written buttons.
- Expose the selected theme through ToggleGroup state and semantics, not color alone.
- Keep the untitled editor's focus-status demonstration and the titled editor example. The focus-status text demonstrates the existing `onFocus`/`onBlur` API; it is not an outer focus style.
- Apply the selected string theme to the examples so each mode can be compared under the same content and structure.
- Keep metadata and data typography on the existing `text-body-sm` and `text-body-md` design tokens.
- Update both documentation locales to describe the five-value theme contract, host-independent standalone modes, and the ownership expectations for `none` and custom extensions.
- Regenerate the showcase source catalog so the displayed source matches the source-owned showcase.

## Testing

- Test the real CodeMirror extension set through `EditorState` while mocking only the React wrapper boundary:
  - untitled editors expose the injected `ariaLabel` on the content facet;
  - titled editors connect the fieldset, visual title, and CodeMirror content through one stable identifier;
  - `app`, `light`, `dark`, `none`, and a custom `Extension` resolve through the intended theme path;
  - the fieldset does not contain external `focus-within` border or ring classes.
- Add source-contract assertions for the expanded `JsonEditorTheme`, 13px editor text, and category-based property-name color.
- Test that the showcase renders an accessible single-selection ToggleGroup with all four string-theme options, preserves the focus-status demo, and uses design-token typography.
- Run focused tests in RED before implementation and GREEN afterward.
- Run Biome, TypeScript, documentation example checks, registry validation, the full Vitest suite, and the showcase build.
- Browser acceptance must verify:
  - `app` follows both host light and dark modes;
  - `light` remains readable and visually light inside a dark host;
  - `dark` remains readable and visually dark inside a light host;
  - `none` receives no component-owned palette while retaining structure and accessible naming;
  - focusing the textbox does not alter the outer fieldset border or add an outer ring;
  - the textbox has an accessible name and the console has no errors.

## Compatibility

The string shortcuts are restored rather than removed, so the public type is `"app" | "light" | "dark" | "none" | Extension`. Existing callers using the default `app` behavior or custom extensions remain compatible. Callers using `light` or `dark` gain complete, host-independent rendering; callers using `none` should treat all color styling as their responsibility.

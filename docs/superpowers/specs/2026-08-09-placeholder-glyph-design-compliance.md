# PlaceholderGlyph Design Compliance Specification

## Context

`PlaceholderGlyph` is a deterministic fallback graphic used inside resource buttons, grids, sprite previews, and detail surfaces. The current implementation exposes the same hard-coded English SVG title for every instance, scales the SVG stroke twice as `size` grows, and demonstrates the component with non-token typography and incomplete toggle semantics.

This specification records the already-approved remediation from the 2026-08-09 `DESIGN.md` audit.

## Considered Approaches

1. **Decorative by default with an optional localized title — selected.** Existing button and card consumers already provide nearby names, so their glyphs should stay out of the accessibility tree. Meaningful standalone previews opt in with `title`.
2. **Require a title for every glyph.** This gives every SVG image semantics but breaks the public API and creates duplicate button/card accessible names.
3. **Keep an internal translated generic title.** This avoids English-only output but remains context-free and still repeats an unhelpful image name.

## Public Component Contract

- Add `title?: string` to `PlaceholderGlyphProps`.
- Without `title`, render the SVG with `aria-hidden="true"` and no `<title>`.
- With `title`, render `role="img"`, a unique `<title id>`, and `aria-labelledby` pointing at that title.
- Keep `size`, `seed`, `mono`, and `className` backward compatible.
- Use a fixed `strokeWidth={2}` in the `0 0 24 24` viewBox. The browser may scale that stroke proportionally with the rendered SVG, but the component must not make stroke width grow a second time from `size`.

## Consumer Contract

- Glyphs next to visible resource names, inside named buttons, and inside sprite cells remain decorative.
- The main fallback preview in `ResourceDetailDrawer` passes `detail.title`, matching the meaningful `alt` used by the real-image branch.
- Repeated size samples remain decorative because their visible captions already provide context.

## Showcase Contract

- The tone button exposes `aria-pressed={mono}`.
- The current tone text uses `role="status"` so changes are announced politely.
- Status, glyph captions, and size captions use `text-body-sm`; size captions also use `tnum`.
- Essential glyph and size captions use `text-foreground`, not `text-muted-foreground`.
- The existing semantic surfaces, 1px grid boundary, zero-radius treatment, responsive auto-fill grid, and horizontal overflow fallback remain unchanged.

## Documentation and Acceptance

- Chinese and English docs describe decorative defaults and localized `title` opt-in behavior.
- Unit tests cover decorative output, localized accessible output with unique IDs, and size-independent viewBox stroke width.
- Browser QA covers SVG accessibility, toggle pressed/status semantics, token font sizes, stroke width, mobile overflow, light/dark themes, and the existing interaction.
- Generated Showcase source is refreshed from the canonical TSX module.

## Self-review

- No unspecified API behavior or placeholder requirements remain.
- The selected default avoids breaking existing consumers and avoids duplicate accessible names.
- Component, consumer, Showcase, docs, generated source, and regression coverage describe the same contract.


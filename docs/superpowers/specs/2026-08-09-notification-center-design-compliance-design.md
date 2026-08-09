# NotificationCenter Design Compliance

## Scope

Bring `NotificationCenter` into alignment with `DESIGN.md` and the current Web Interface Guidelines without changing its controlled-data ownership. The product continues to provide notification items, localized labels, stream state, and callbacks.

## Interaction and semantics

- Compose the panel with the existing Base UI `Popover` primitive instead of `DropdownMenu`; the content is a rich notification panel, not a menu of commands.
- Use `PopoverTitle` and `PopoverDescription` so the floating panel has an accessible name and status description.
- Preserve Base UI trigger composition through `render`, normal Tab navigation inside the panel, Escape dismissal, outside-click dismissal, and trigger focus restoration.
- Keep row clear actions visible whenever their callback exists, including on touch devices. Clear actions use the existing destructive Button variant.

## State and accessibility

- Build the trigger's accessible label from the injected trigger label and the current loading, error, or count state.
- Add an atomic polite status region for asynchronous state/count changes.
- Mark loading and empty feedback as status messages and error feedback as an alert.
- Hide all decorative Tabler icons from assistive technology; visible text remains the source of meaning.
- Hide populated summaries during loading and error states so stale counts do not conflict with the active state.

## Visual behavior

- Preserve the square, border-first, semantic-token treatment and the ordinary `accent/50` row hover.
- Use the existing `Tag` typography/size contract for LIVE/IDLE rather than a local 10px label style.
- Keep the panel within 16px viewport margins and contain list overscroll.
- Add reduced-motion fallbacks to the processing spinner and Popover open/close motion.
- Expose full notification title, description, and source identifier through native full-value titles while keeping compact truncation.

## Documentation and acceptance

- Update bilingual documentation from menu semantics to Popover semantics.
- Update the Showcase visual QA selector and the stale row-hover assertion.
- Add component regression tests for Popover composition, persistent destructive actions, accessible state text, full-value discovery, hidden decorative icons, state-summary precedence, and reduced motion.
- Add a Popover primitive regression test for reduced-motion classes.

## Non-goals

- No notification persistence, networking, timestamps, virtualization, confirmation workflow, or undo behavior is added.
- No public callback signatures change.
- No unrelated overlay primitives are refactored.

# ServiceEndpointRow Design Compliance

Date: 2026-08-09
Status: Approved direction; implementation pending written-spec review

## Context

`ServiceEndpointRow` presents a service method, endpoint metadata, a long URL, and copy/open actions. The current implementation works in the showcase, but it does not fully satisfy `DESIGN.md`: a display-only URL is rendered through a form fieldset primitive, keyboard users cannot scroll it, open-action states are ambiguous, action sizes do not align, several strings are not localized end to end, and the implementation lacks focused unit and browser coverage.

This design applies the selected progressive-compatible approach. Existing callback-based consumers keep working while new optional props allow semantic navigation, localized copy feedback, and clipboard-error reporting.

## Goals

- Use semantic, accessible elements for display, button, and navigation behavior.
- Keep the endpoint URL readable and keyboard-scrollable without increasing row height.
- Preserve the existing public API while adding optional capabilities.
- Align the URL and both trailing actions to the same 32 px control height.
- Use design tokens according to their semantic purpose.
- Make English, Chinese, RTL, long-content, disabled, and failure states verifiable.
- Keep registry metadata, documentation, showcase behavior, and tests synchronized.

## Non-goals

- Supporting service methods other than the existing `GET` type.
- Introducing a general endpoint editor or changing the URL into an input.
- Redesigning the surrounding service list or data-fetching behavior.
- Requiring consumers to migrate immediately to a new discriminated union.

## Public API

The existing props remain valid. The component adds three optional props:

```ts
export type ServiceEndpointRowProps = {
  title: string
  subtitle: string
  method: "GET"
  url: string
  onCopy: () => void
  onCopyError?: (error: unknown) => void
  copyLabel: string
  copiedLabel?: string
  icon?: ReactNode
  openDisabled?: boolean
  openTooltip?: string
  openLabel: string
  openHref?: string
  onOpen?: () => void
}
```

- `copiedLabel` supplies localized success feedback. When omitted, the component falls back to `copyLabel`, never to a language-specific primitive default.
- `onCopyError` receives clipboard failures from `CopyButton`.
- `openHref` represents actual navigation. It takes precedence over callback-only rendering and is opened in a new browsing context.
- `onOpen` remains supported. Without `openHref`, it represents an application-controlled button action. With `openHref`, it is an auxiliary click callback suitable for status updates or analytics and must not replace navigation.
- The open action is considered disabled when `openDisabled` is true or when both `openHref` and `onOpen` are absent. This prevents an enabled no-op control.

The props intentionally remain a single backward-compatible object type. Documentation will describe the valid combinations instead of making existing TypeScript consumers adopt a breaking union.

## Component Structure and Behavior

### Header

- The optional leading icon is decorative because the adjacent title already names the endpoint; its wrapper is hidden from assistive technology.
- Title and subtitle containers use `min-w-0` and truncate visually when space is constrained.
- Native `title` attributes preserve discoverability of the full title and subtitle with a pointer.
- The subtitle uses normal readable casing rather than forced uppercase.
- The method is rendered with the shared neutral outlined `Tag` primitive instead of a bespoke status-colored span.

### URL display

- Replace `InputGroup`/`fieldset` with a semantic `<code>` display region. The URL is output, not a form control or group of controls.
- The `<code>` element is focusable with `tabIndex={0}`, uses horizontal overflow, and shows the standard focus ring so keyboard users can reach and scroll long values.
- Apply `dir="ltr"` and `translate="no"` because endpoint URLs are machine-readable identifiers even in RTL/localized pages.
- Expose the complete URL through its accessible name and `title` attribute while keeping the visual presentation on one line.
- Render URL segments without semantic warning/info/success colors. Parameter emphasis uses typography and neutral decoration rather than status colors.
- The URL display remains 32 px high and fills the available width in a `minmax(0, 1fr)` grid column.

### Copy action

- Extend `CopyButton` with an optional icon-button size prop while preserving its current default.
- `ServiceEndpointRow` uses the 32 px size so it aligns with the URL display and open action.
- Pass `copiedLabel ?? copyLabel` and `onCopyError` explicitly.
- Keep the existing `onCopy` callback behavior after a successful clipboard write.

### Open action

- When `openHref` exists and the action is enabled, render a real `<a>` with `target="_blank"` and `rel="noopener noreferrer"`. Do not render an anchor through the Base UI button primitive because that would retain button semantics.
- Extract/export the shared icon-button class variants so the link and button have identical 32 px styling without duplicating the design contract.
- When only `onOpen` exists, render the existing `IconButton` and call the callback.
- When disabled or actionless, render a focusable button with `aria-disabled="true"` and guard pointer/keyboard activation. Do not use the native `disabled` attribute, because the tooltip explaining the disabled state must remain reachable.
- The tooltip content uses `openTooltip` when supplied and otherwise uses `openLabel`. The accessible name always uses `openLabel`.

### Layout and responsive behavior

- Keep the URL, copy action, and open action in one row, as requested.
- Use a three-column grid: flexible URL, fixed copy action, fixed open action.
- All three interactive/display surfaces are 32 px high. Gaps use the spacing scale.
- Long URLs scroll inside the first column instead of forcing the row wider or moving actions to a second line.
- The root preserves its existing compact visual footprint and token-driven border/background treatment.

## Accessibility and Internationalization

- The URL display has a visible focus state and a complete accessible name.
- Disabled controls expose `aria-disabled`; handlers prevent activation without removing the control from keyboard navigation.
- Link and button variants keep their native semantics.
- Decorative showcase and component icons use `aria-hidden="true"`.
- The showcase result message becomes an `<output aria-live="polite">` so copy, open, disabled, and error feedback is announced.
- The showcase supplies localized `copyLabel`, `copiedLabel`, `openLabel`, disabled explanations, and error messages.
- RTL verification confirms that the component layout follows page direction while the endpoint itself remains LTR.

## Shared Primitive Changes

Two backward-compatible primitive changes are allowed:

1. Export the icon-button variant function and size type from `registry/ui/icon-button.tsx` so a semantic link can reuse the same visual contract.
2. Add an optional icon-button size prop to `registry/ui/copy-button.tsx`; retain the current size as the default for all existing consumers.

These changes must include focused tests so they do not alter existing default rendering or interaction behavior.

## Registry, Showcase, and Documentation

- Replace the block registry dependency on `@mapseek/input-group` with `@mapseek/tag`; keep copy button, icon button, and tooltip dependencies synchronized with imports.
- Update the showcase to demonstrate:
  - an enabled semantic link action;
  - a callback-only open action if useful for compatibility coverage;
  - a disabled, tooltip-explained action;
  - localized copied and clipboard-error feedback;
  - neutral method/icon styling and an announced status output.
- Update both Chinese and English documentation with the complete prop list, valid open-action combinations, semantic URL behavior, and error handling.
- Regenerate any derived source-catalog artifacts through the repository's normal generation/build process instead of editing generated content manually.

## Verification Strategy

Implementation follows red-green-refactor:

1. Add failing component tests for URL semantics/focusability, LTR behavior, neutral method Tag, long-content affordances, localized copied feedback, clipboard failures, semantic link rendering, callback rendering, and disabled/actionless guarding.
2. Add failing primitive tests for shared icon-link styling support and the configurable `CopyButton` icon size.
3. Implement the minimal changes needed to pass those tests.
4. Extend the docs visual QA for narrow width, RTL, keyboard focus/scroll, link semantics, disabled tooltip reachability, localized copied state, and clipboard failure.
5. Run targeted unit tests, type checking, linting, registry validation/build tasks, and the scoped browser QA.
6. Review the final diff against `DESIGN.md` and verify that unrelated dirty-worktree changes were neither staged nor overwritten.

## Compatibility and Risks

- Existing callback-only rows remain buttons and continue to call `onOpen`.
- Existing rows that omit `onOpen` become correctly disabled instead of appearing actionable.
- Existing `CopyButton` consumers retain their current default size.
- Adding `title` attributes is a lightweight full-value affordance; it does not replace the accessible name or focusable URL region.
- An enabled `openHref` changes only consumers that explicitly opt into navigation.
- The main implementation risk is styling drift between icon links and icon buttons; exporting one shared variant source and testing both forms controls that risk.

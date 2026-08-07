# Sonner semantic background design

**Date:** 2026-08-07
**Status:** Approved for planning

## Goal

Make typed Sonner notifications visually distinguishable with restrained semantic background tints, matching the visual treatment of the Alert primitive. The change applies only to toast backgrounds; it does not change toast dimensions, placement, API, or interaction behavior.

## Scope

- Update the `Toaster` styling in `registry/ui/sonner.tsx`.
- Keep the existing square corners, shadowless surface, icons, type-specific text, and borders.
- Preserve the neutral `popover` background for untyped/default toasts.
- Leave the existing user-authored `TODO.md` change untouched.

## Visual treatment

Typed toast surfaces derive from the existing semantic color tokens and retain the current type-specific icon, text, and border treatment.

| Toast type | Background tint | Existing border | Existing text/icon |
| --- | --- | --- | --- |
| success | primary at 5% over the popover surface | primary | primary |
| error | destructive at 10% over the popover surface | destructive | destructive |
| warning | warning at 10% over the popover surface | warning | warning |
| info | info at 10% over the popover surface | info | info |
| default | popover | border | popover foreground |

The tints must remain subtle enough to preserve the compact, non-modal character of a toast and to avoid treating success green as a primary-action surface. The toast itself stays at its current width, padding, typography, and top-center placement.

## Implementation boundary

Use Sonner's per-type CSS background variables in the existing `Toaster` configuration, compositing each semantic token with `--popover`. Do not add component-specific color tokens, change the exported `Toaster`/`toast` API, or modify call sites and documentation copy.

## Accessibility and fallback behavior

Color is supplementary: the existing filled type icons and semantic text remain in place. Default toasts remain neutral. If a caller supplies custom Sonner styling, its explicit styling continues to override the defaults as it does today.

## Verification

- Add a focused Sonner styling test that asserts the per-type surface mapping and retains the default neutral surface.
- Run the focused test, formatting/lint checks for the edited files, TypeScript checking, and the relevant docs visual check for the Sonner showcase.
- Inspect the showcase in light and dark themes to confirm the tints remain subtle and readable.

## Non-goals

- No changes to Alert variants or its existing token decision.
- No change to action/cancel button colors or hover behavior.
- No new semantic status tokens or changes to the page layout.

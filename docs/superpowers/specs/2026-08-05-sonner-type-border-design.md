# Sonner Type Color Design

## Goal

Keep the existing one-pixel, square, shadowless Sonner toast treatment while making its border, title, and description colors match the toast type.

## Visual Mapping

- Default: `--border`
- Success: `--primary`
- Error: `--destructive`
- Warning: `--warning`
- Info: `--info`

The title and description use the same mapping. The Info icon also uses the semantic `info` token so the icon, border, and text communicate the same type.

## Implementation

Keep `!border` for the one-pixel width and `!border-border` as the default color. Use Sonner's `data-type` attribute to apply semantic border utilities for success, error, warning, and info toasts. Mark the toast as a Tailwind group so the title and description can use the same parent `data-type` state without duplicating toast markup or introducing new CSS variables. This preserves the calm background treatment because Sonner only applies its native per-type variables when `richColors` also changes the toast background.

Default toast text retains the existing foreground and muted-description colors. No changes are made to toast backgrounds, typography, dimensions, placement, corner radius, or shadow.

## Verification

- Extend the Toaster regression test to cover every semantic `data-type` border class and the matching title and description classes.
- Verify default, success, error, warning, and info toast computed border, title, and description colors in the local component page.
- Run the focused test, formatter/static checks, registry build, and registry validation.

---
version: alpha
name: Mapseek UI
description: "A compact, zero-radius design system for GIS analysis, map styling, data inspection, and resource management. It uses neutral OKLCH surfaces, a reserved green action color, and a single monospaced interface voice."
colors:
  background: "oklch(0.9900 0.0020 149)"
  foreground: "oklch(0.2500 0.0100 149)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.2500 0.0100 149)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.2500 0.0100 149)"
  primary: "oklch(0.6270 0.1940 149)"
  primary-foreground: "oklch(1 0 0)"
  secondary: "oklch(0.9600 0.0050 149)"
  secondary-foreground: "oklch(0.3000 0.0500 149)"
  muted: "oklch(0.9700 0.0020 149)"
  muted-foreground: "oklch(0.5000 0.0200 149)"
  accent: "oklch(0.9600 0.0100 149)"
  accent-foreground: "oklch(0.3000 0.1000 149)"
  destructive: "oklch(0.6000 0.1800 25)"
  warning: "oklch(0.769 0.188 70.08)"
  info: "oklch(0.623 0.17 245)"
  border: "oklch(0.9200 0.0050 149)"
  border-strong: "oklch(0.8500 0.0080 149)"
  input: "oklch(0.9400 0.0050 149)"
  input-surface: "transparent"
  ring: "oklch(0.6270 0.1940 149)"
  selection-bg: "oklch(0.9500 0.0300 149)"
  selection-bg-mid: "oklch(0.9200 0.0500 149)"
  selection-bg-deep: "oklch(0.8800 0.0700 149)"
typography:
  headline-lg:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline-sm:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-base:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-lg:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  control-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0px
  body-sm:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  label-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.04em"
  data-display:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 42px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: '"tnum" 1, "zero" 1'
rounded:
  none: 0px
  full: 9999px
spacing:
  hairline: 1px
  micro: 2px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  3xl: 32px
components:
  app-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.control-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, {colors.primary}, transparent 20%)"
    textColor: "{colors.primary-foreground}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.control-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.control-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
  button-destructive:
    backgroundColor: "color-mix(in oklch, {colors.destructive}, transparent 90%)"
    textColor: "{colors.destructive}"
    typography: "{typography.control-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
  button-xs:
    typography: "{typography.control-md}"
    rounded: "{rounded.none}"
    height: 24px
    padding: 0px 8px
  button-sm:
    typography: "{typography.control-md}"
    rounded: "{rounded.none}"
    height: 28px
    padding: 0px 10px
  button-lg:
    typography: "{typography.control-md}"
    rounded: "{rounded.none}"
    height: 36px
    padding: 0px 10px
  accent-surface:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.none}"
  input:
    backgroundColor: "{colors.input-surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 0px 10px
  input-border:
    backgroundColor: "{colors.input}"
    height: 1px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  divider-strong:
    backgroundColor: "{colors.border-strong}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.ring}"
    size: 3px
  selected-surface:
    backgroundColor: "{colors.selection-bg}"
    textColor: "{colors.foreground}"
  selected-surface-emphasized:
    backgroundColor: "{colors.selection-bg-mid}"
    textColor: "{colors.foreground}"
  selected-surface-strong:
    backgroundColor: "{colors.selection-bg-deep}"
    textColor: "{colors.foreground}"
  warning-status:
    textColor: "{colors.warning}"
  info-status:
    textColor: "{colors.info}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 16px
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 10px
  badge:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    typography: "{typography.control-md}"
    rounded: "{rounded.none}"
    height: 20px
    padding: 0px 8px
  table-header:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.control-md}"
    height: 40px
---

# Mapseek UI Design Rules

[Chinese version](./DESIGN.zh-CN.md)

## Overview

Mapseek UI is the working interface for GIS analysis, map styling, data inspection, and resource management. Its character is **precision-first technical minimalism**: compact, calm, and explicit about state. It should feel like a calibrated professional instrument, not a marketing site. Maps, rasters, charts, coordinates, schemas, and resource metadata are the visual content; chrome exists to organize and operate on that content.

The defining visual rhythm is a near-neutral canvas, square 1px-bounded surfaces, and a restrained green that only signals the current action, focus, or selection. A single monospaced typeface keeps coordinates, identifiers, counts, and data values easy to scan and compare during long desktop sessions.

**Key characteristics:**

- Neutral light and dark canvases; green is functional rather than decorative.
- Geist Mono Variable for all UI text and technical data.
- Zero-radius rectangular controls, panels, cards, menus, and dialogs.
- Compact 24px, 28px, 32px, and 36px control sizes on a 4px spacing rhythm.
- Borders and small surface changes establish hierarchy; components are shadowless by default.
- Selected, loading, empty, error, and disabled states never rely on color alone.
- Desktop-first data and panel layouts remain understandable when space narrows.

### Source of Truth

- `registry/theme/registry.json` owns the runtime theme variables, including dark-theme values, shadowless compatibility tokens, motion, charts, categories, and sidebar tokens.
- `registry/ui/` owns primitive variants, sizing, keyboard behavior, and accessibility.
- `registry/blocks/` composes primitives into GIS and resource-management patterns.
- `packages/docs/` and `showcase/` are the visual acceptance surfaces.
- This front matter mirrors the primary light-theme variables consumed by components. When a runtime extension is not represented here, use `registry/theme/registry.json`; do not create a competing token.

## Colors

Mapseek uses a green-axis OKLCH palette surrounded by low-chroma neutrals. The primary green identifies a meaningful active state, while maps, raster previews, charts, and symbology remain the visual emphasis.

### Action, State, and Text

- **Primary** (`{colors.primary}`) is the single high-emphasis action, selected navigation treatment, keyboard focus source, and limited progress accent. Its foreground is `{colors.primary-foreground}`.
- **Secondary** (`{colors.secondary}`) and **accent** (`{colors.accent}`) provide lower-emphasis actions and grouped choices. Their foregrounds are the matching `*-foreground` tokens.
- **Interaction and selection** use separate surfaces: ordinary interactive elements use `{colors.accent}` at 50% opacity, matching the documentation sidebar hover treatment. Persistent selections use the full `{colors.selection-bg}` token with `{colors.primary}` text and may progress toward `{colors.selection-bg-deep}`; selected, expanded, and active elements retain both their state surface and primary text on hover instead of applying the ordinary hover treatment. They must also use selected semantics, an edge, a checkmark, or another lasting indicator.
- **Destructive**, **warning**, and **info** are semantic signals, not decorative categories. Pair them with text or an icon; destructive actions remain tinted rather than solid red.

### Surfaces, Borders, and Dark Theme

- **Background** (`{colors.background}`) is the application floor; **card** and **popover** are discrete elevated surfaces with their matching foreground tokens.
- **Muted** supports table headers, metadata bands, and empty-state scaffolding; it is not the default interactive hover fill. Do not use `{colors.muted-foreground}` for essential small text.
- **Border** is the default 1px structure; **border-strong** is reserved for emphasized boundaries and active drop targets.
- Inputs use `{colors.input}` for their border and `{colors.input-surface}` for their fill. The light theme deliberately keeps the fill transparent.
- Dark mode reuses the same semantic names with the `.dark` values in the runtime theme; it is not a mechanical inversion. Dark panels remain only slightly lighter than the application floor, and editable inputs use a quiet translucent fill.

### Data Palettes

Chart and category palettes are runtime extensions. Preserve their declared order in `registry/theme/registry.json` unless the data domain supplies a stable semantic mapping. Color ramps, satellite imagery, and map symbology are content palettes and never redefine the interface palette.

## Typography

Mapseek uses **Geist Mono Variable** as its UI and data family. This single technical voice makes coordinates, filenames, field names, timestamps, storage figures, and code-like values comparable without switching visual language.

### Hierarchy

| Token | Size | Weight | Line height | Letter spacing | Use |
|---|---:|---:|---:|---:|---|
| `{typography.headline-lg}` | 18px | 600 | 1.2 | -0.02em | Page and major panel titles |
| `{typography.headline-md}` | 15px | 600 | 1.25 | -0.02em | Dialog and section titles |
| `{typography.headline-sm}` | 14px | 500 | 1.3 | -0.01em | Card titles and grouped controls |
| `{typography.body-base}` | 16px | 400 | 1.5 | 0 | Root document scale and prose-oriented surfaces |
| `{typography.body-lg}` | 13px | 400 | 1.5 | 0 | Prominent interface copy and resource names |
| `{typography.body-md}` | 12px | 400 | 1.5 | 0 | Content text in tables, fields, and panels |
| `{typography.control-md}` | 12px | 500 | 1.5 | 0 | Interactive controls, tabs, badges, and table headers |
| `{typography.body-sm}` | 11px | 400 | 1.5 | 0 | Metadata, counts, and compact status text |
| `{typography.label-md}` | 10px | 500 | 1.2 | 0.04em | Short taxonomy and section labels |
| `{typography.data-display}` | 42px | 600 | 1 | -0.02em | Exceptional data or specimen previews |

### Type Rules

- Use weights 400, 500, and 600. The data-display token is an exception, not a general page-heading style.
- Apply uppercase tracking only to brief taxonomy or eyebrow labels, never to sentences or buttons.
- Use tabular numerals for coordinates, statistics, storage, timestamps, and counts.
- Long identifiers and data values must truncate with a discoverable full value or scroll horizontally; never shrink them into unreadability.
- Do not introduce a contrasting editorial or geometric display face. Hierarchy comes from size, weight, spacing, and structure.

## Layout

The layout system is desktop-first and built on a 4px baseline, with 2px and 6px intermediate steps for exact alignment. Keep related controls close and preserve breathing room between independent groups.

### Spacing System

- `{spacing.hairline}` (1px): rules and borders.
- `{spacing.micro}` (2px): icon correction and tightly-coupled state details.
- `{spacing.xs}` (4px) and `{spacing.sm}` (6px): compact toolbar and control gaps.
- `{spacing.md}` (8px) and `{spacing.lg}` (12px): field groups, row padding, and small containers.
- `{spacing.xl}` (16px): standard card, dialog, and panel padding.
- `{spacing.2xl}` (24px) and `{spacing.3xl}` (32px): major separations and spacious empty states.

### Application Structure

- The common shell is **top bar → navigation or resource rail → working canvas → contextual panel or overlay**.
- Toolbars use one control height per cluster. Keep persistent actions in the top bar or a panel footer.
- Sidebars and editors have stable widths, a 1px boundary, and independent scrolling. The primary working area owns remaining width and must retain `min-width: 0` behavior.
- Resource grids use `auto-fill` with domain-specific minimum card widths. Tables use an explicit bounded container and horizontal overflow rather than compressed columns.
- Field rows can be vertical, inline, or responsive, but editor layouts retain a stable label column and a flexible content column when space permits.

### Responsive Behavior

- Below 640px, stack dialog actions, preserve 16px viewport margins, collapse multi-column grids, and move secondary panel content behind an explicit trigger.
- Between 640px and 1023px, preserve the working canvas first; collapse or overlay secondary rails when they would make the map, table, or editor unusable.
- At 1024px and above, use the complete desktop shell with persistent sidebars, toolbars, working canvas, and contextual panels.
- Toolbars may wrap only at meaningful action-group boundaries. Prefer an overflow menu for low-frequency actions.

## Elevation & Depth

Mapseek is **border-first and surface-first**. Static panels do not float above the workspace. Depth comes from 1px rules, subtle neutral surface changes, and explicit overlays.

| Level | Treatment | Use |
|---|---|---|
| Flat | Background only | App shell, map canvas, content regions |
| Structured | 1px `{colors.border}` | Panels, tables, cards, grouped controls |
| Selected | Selection fill plus primary edge or indicator | Current row, resource, layer, or navigation item |
| Floating | Popover surface with a 1px border or ring | Menus, popovers, tooltips, dialogs, toasts |
| Map floating | Bordered surface with clear contrast | Controls directly above map content |

- All component shadow tokens resolve to `none` by default; use borders, outlines, and surface contrast to establish separation.
- Dialog scrims are light (`black/10`) and may use a small blur so spatial context remains visible.
- Existing primitives use short, functional transitions. Prefer opacity, color, and small transforms; honor reduced motion and do not invent long choreography for routine UI.
- Use established z-index tiers for app chrome, map controls, floating choices, and modal layers. Do not increment z-index ad hoc.

## Shapes

Zero radius is a defining Mapseek characteristic. Rectangular controls, fields, cards, tables, menus, popovers, dialogs, sheets, and panels use `{rounded.none}`. Do not reintroduce framework corner radii.

- `{rounded.full}` is reserved for naturally circular status dots, avatar masks, switch tracks, and switch thumbs.
- Icon-only controls are square and follow the 24px, 28px, 32px, and 36px size scale.
- Tabler Icons are the default icon language. Within a toolbar or row, keep icon size and stroke consistent.
- Separators are 1px; do not stack outlines, use thick strokes, or add decorative frames to create hierarchy.
- Preserve `public/img/mapseek.png` in its full, transparent, unmodified form.
- Checkerboards, color ramps, glyph samples, and map thumbnails belong only inside clearly bounded data-preview regions.

## Components

Components follow a fixed ownership model: theme → primitives → domain blocks → product screens. The theme defines semantic values, primitives define reusable behavior, blocks define GIS composition, and products supply data and business actions.

### Buttons and Actions

- **`button-primary`** is a 32px green action with 12px type and 10px horizontal padding. Use one dominant primary action per local task. Hover lowers primary intensity; press can translate by 1px; focus adds a visible ring.
- **Outline, secondary, ghost, and link variants** preserve hierarchy without creating a new action color. `link` is for genuine inline navigation or low-chrome actions.
- **`button-destructive`** uses a tinted destructive surface and text. Ask for confirmation when an action is irreversible or difficult to recover.
- **Icon buttons** are square and sized 24–36px. They need an accessible name and, where the symbol is not self-evident, a tooltip.

### Forms and Selection

- **`input`** is 32px high, square, uses 12px type, a 1px input border, 10px horizontal padding, and a transparent light-theme fill. Placeholder text supports, but never replaces, a label.
- **Transparent input contrast contract.** `input`, `textarea`, and `input-group` use `{colors.input-surface}`, so evaluate their text contrast after compositing with the host surface. They may appear only on `background`, `card`, or `popover`, and each supported theme must meet a 4.5:1 text contrast ratio. Do not place them on primary, destructive, imagery, maps, data visualizations, or any unlisted colored surface. `muted` is not an approved host until it is explicitly added to the contrast matrix.
- **`field`** composes label, description, control, and error. Invalid controls expose `aria-invalid` and visible error copy; `FieldError` announces with `role="alert"`.
- **Checkbox, switch, slider, select, combobox, toggle, and tabs** keep their existing Base UI keyboard semantics. Checked and selected states require a persistent indicator beyond hover.

### Containers and Overlays

- **`card`** groups related content with a square 1px ring, 16px default spacing, and a 12px compact variant.
- **`dialog`** uses `DialogContent → DialogHeader / DialogBody / DialogFooter`, 16px padding, a readable title, and end-aligned footer actions that stack on narrow screens.
- **`sheet`** serves long editing or detail workflows; **popover**, **dropdown**, **context menu**, **command**, and **tooltip** offer local floating choices without obscuring the active task.

### Data and Domain Blocks

- **`table`** is bordered and horizontally scrollable. Its header is 40px high; compact cells preserve readable 12px data type.
- **`badge`** is 20px high with 8px horizontal padding and holds short state or category labels only.
- **Progress, skeleton, empty, sonner, and notification center** match feedback scope. Persistent state must not live only in a temporary toast.
- **MapControls, MapCoordinateStatus, and MapSwitcher** use map-specific floating elevation and retain labels or tooltips.
- **ResourceSidebar, ResourceGrid, LayerPanel, LayerStyleEditor, AttrTable, AttrInspector, GeoJSONView, and JSONEditor** keep data density, injected labels, overflow handling, and state visibility consistent with the primitives.

## Do's and Don'ts

### Do

- Use semantic theme tokens and existing primitive variants before adding local styles.
- Keep neighboring controls aligned to one established height and preserve the 4px spacing rhythm.
- Use green only for primary action, current focus, selection, and high-value progress.
- Pair state color with text, an icon, a border, progress, or another structural change.
- Verify light mode, dark mode, keyboard navigation, RTL, narrow widths, overflow, reduced motion, and loading/empty/error states.
- Update the theme, this document, bilingual documentation, and the relevant showcase together when a public visual contract changes.

### Don't

- Do not introduce marketing-page whitespace, hero typography, gradients, glassmorphism, or decorative blur.
- Do not round rectangular cards, controls, panels, dialogs, menus, or fields.
- Do not add shadows to UI components or use elevation as decoration.
- Do not use primary green for unrelated categories, every chart series, or passive ornament.
- Do not copy color literals into components when a semantic token exists.
- Do not hide essential actions behind an unlabeled icon, hover-only treatment, or color-only affordance.
- Do not duplicate primitive behavior or embed non-injectable product copy and network behavior inside domain blocks.

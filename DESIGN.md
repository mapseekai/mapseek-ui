---
version: alpha
name: Mapseek UI
description: A compact, precision-first design system for geospatial analysis, map styling, data inspection, and resource-management tools.
colors:
  primary: "oklch(0.6270 0.1940 149)"
  on-primary: "oklch(1 0 0)"
  background: "oklch(0.9900 0.0020 149)"
  on-background: "oklch(0.2500 0.0100 149)"
  surface: "oklch(1 0 0)"
  on-surface: "oklch(0.2500 0.0100 149)"
  secondary: "oklch(0.9600 0.0050 149)"
  on-secondary: "oklch(0.3000 0.0500 149)"
  muted: "oklch(0.9700 0.0020 149)"
  on-muted: "oklch(0.5000 0.0200 149)"
  accent: "oklch(0.9600 0.0100 149)"
  on-accent: "oklch(0.3000 0.1000 149)"
  border: "oklch(0.9200 0.0050 149)"
  border-strong: "oklch(0.8500 0.0080 149)"
  input: "oklch(0.9400 0.0050 149)"
  input-surface: "transparent"
  ring: "oklch(0.6270 0.1940 149)"
  destructive: "oklch(0.6000 0.1800 25)"
  warning: "oklch(0.769 0.188 70.08)"
  info: "oklch(0.623 0.17 245)"
  selection: "oklch(0.9500 0.0300 149)"
  dark-primary: "oklch(0.6800 0.1940 149)"
  dark-on-primary: "oklch(0.1500 0.0100 149)"
  dark-background: "oklch(0.1500 0.0100 149)"
  dark-on-background: "oklch(0.9500 0.0050 149)"
  dark-surface: "oklch(0.2000 0.0100 149)"
  dark-on-surface: "oklch(0.9500 0.0050 149)"
  dark-muted: "oklch(0.2400 0.0080 149)"
  dark-on-muted: "oklch(0.6500 0.0200 149)"
  dark-input: "oklch(1 0 0 / 15%)"
  dark-input-surface: "oklch(1 0 0 / 4.5%)"
  dark-destructive: "oklch(0.7000 0.1800 25)"
typography:
  headline-lg:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.25
  headline-sm:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
  body-base:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-lg:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.06em
  data-display:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: 42px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.02em
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  xl: 0px
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
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
  surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
  surface-muted:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.on-muted}"
    rounded: "{rounded.none}"
  surface-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.none}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 10px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 10px
  button-xs:
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 24px
    padding: 8px
  button-sm:
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 28px
    padding: 10px
  button-lg:
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 36px
    padding: 10px
  input:
    backgroundColor: "{colors.input-surface}"
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 32px
    padding: 10px
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
  selection:
    backgroundColor: "{colors.selection}"
    textColor: "{colors.on-background}"
  destructive-action:
    textColor: "{colors.destructive}"
  warning-status:
    textColor: "{colors.warning}"
  info-status:
    textColor: "{colors.info}"
  badge:
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    height: 20px
    padding: 8px
  table-header:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.on-muted}"
    typography: "{typography.body-md}"
    height: 40px
  dark-app-shell:
    backgroundColor: "{colors.dark-background}"
    textColor: "{colors.dark-on-background}"
  dark-surface:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-on-surface}"
  dark-muted-surface:
    backgroundColor: "{colors.dark-muted}"
    textColor: "{colors.dark-on-muted}"
  dark-button-primary:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
  dark-input:
    backgroundColor: "{colors.dark-input-surface}"
  dark-input-control:
    backgroundColor: "{colors.dark-input}"
  dark-destructive-action:
    textColor: "{colors.dark-destructive}"
---

# Mapseek UI Design Rules

[Chinese version](./DESIGN.zh-CN.md)

## Overview

Mapseek UI is a component registry for GIS analysis, map styling, data inspection, and resource-management products. Its visual language is **precision-first technical minimalism**: dense without feeling cramped, explicit about state, quiet around data, and optimized for long desktop sessions.

The interface should resemble a calibrated professional instrument rather than a marketing site. Maps, rasters, charts, coordinates, schemas, and resource metadata are the visual content; chrome exists to organize and operate on that content. Green signals the current action or selection, hairlines establish structure, and a single monospaced voice keeps values easy to scan and compare.

**Key characteristics:**

- Near-white and near-black neutral canvases with a restrained green action color.
- Geist Mono Variable for interface copy, labels, identifiers, coordinates, and numeric data.
- Zero-radius rectangular controls, panels, cards, menus, and dialogs.
- Compact 24-36px control heights and a 4px spacing baseline.
- One-pixel borders and surface shifts as the primary depth devices; shadows are reserved for floating layers.
- Clear selected, loading, empty, error, and disabled states that never depend on color alone.
- Desktop-first panel and data-grid layouts that remain operable on narrow viewports.

### Source of Truth

- `registry/theme/registry.json` owns runtime colors, typography, radii, shadows, motion, and Tailwind mappings.
- `registry/ui/` owns reusable primitives, variants, sizes, states, and accessibility behavior.
- `registry/blocks/` composes primitives into geospatial and resource-management patterns.
- `packages/docs/` and `showcase/` are the visual and interaction acceptance surfaces.
- The YAML front matter is the normative contract for the tokens it lists. `registry/theme/registry.json` remains the source of truth for runtime extensions such as chart, category, sidebar, and derived opacity colors. The prose explains why and when to apply both sets.

### Design Principles

1. **Precision before decoration.** Alignment, boundaries, data legibility, and state clarity take precedence over visual effects.
2. **Dense, not cramped.** Use compact controls and short gaps, but preserve consistent grouping and a readable scan path.
3. **Data before chrome.** UI surfaces remain neutral so maps, charts, color ramps, and resource previews carry the visual emphasis.
4. **Semantic tokens only.** Consume `primary`, `muted`, `border`, and other semantic roles instead of copying color literals into components.
5. **Reuse before invention.** Compose existing primitives first; create a block only when a domain pattern repeats.
6. **State is never color-only.** Pair color with text, icons, borders, progress, or structural change.

## Colors

The palette uses a green-axis OKLCH system surrounded by low-chroma neutrals. The green is functional, not decorative: it identifies the primary action, focus, selection, and limited progress emphasis. Large surfaces stay neutral so spatial and scientific data remain dominant.

### Brand & Action

- **Primary** (`{colors.primary}`): Current primary action, selected navigation item, focus ring, and key progress. Avoid multiple competing primary buttons within one local task.
- **On Primary** (`{colors.on-primary}`): Foreground for solid primary surfaces in the light theme. Icons and `currentColor` SVGs inherit this value.
- **Secondary / Accent** (`{colors.secondary}`, `{colors.accent}`): Low-emphasis actions, hover fills, grouped choices, and selected backgrounds where a solid primary surface would be too strong.
- **Selection** (`{colors.selection}`): Persistent selection fill. Combine it with a primary border, indicator bar, checkmark, or selected semantics.

### Surfaces & Text

- **Background** (`{colors.background}`): Application floor and the default map-adjacent workspace.
- **Surface** (`{colors.surface}`): Cards, popovers, dialogs, and discrete panels.
- **Muted** (`{colors.muted}`): Table headers, secondary bands, subdued hover states, and empty-state scaffolding.
- **On Background / On Surface** (`{colors.on-background}`, `{colors.on-surface}`): Primary interface text.
- **On Muted** (`{colors.on-muted}`): Metadata, descriptions, counts, and secondary labels. Do not use it for essential instructions at small sizes.

### Borders & Inputs

- **Border** (`{colors.border}`): Default 1px separators, panel edges, card rings, and table rules.
- **Border Strong** (`{colors.border-strong}`): Emphasized structure, active drop zones, and input boundaries that need more contrast.
- **Input** (`{colors.input}`): Input borders, disabled fills, and the dark-theme field tint. Editable fields stay transparent in the light theme so they remain visually integrated with the surrounding panel.
- **Ring** (`{colors.ring}`): Keyboard focus. Focus treatment must remain visible in both themes and must not be replaced by hover styling.

### Semantic & Data Colors

- **Destructive** (`{colors.destructive}`): Irreversible actions and errors. Destructive buttons use a tinted background plus destructive text rather than a large solid-red surface.
- **Warning** (`{colors.warning}`) and **Info** (`{colors.info}`): Status accents accompanied by a label or icon.
- Chart colors use this runtime order: `--chart-1` green, `--chart-2` dark green, `--chart-3` cyan-green, `--chart-4` pale green, and `--chart-5` muted green.
- Category colors use this runtime order: `--cat-1` green, `--cat-2` blue, `--cat-3` amber, `--cat-4` red, `--cat-5` violet, and `--cat-6` cyan. Preserve the order unless the data domain defines a stable semantic mapping.
- Color ramps, satellite imagery, raster previews, and map symbology are content palettes. They do not redefine the interface palette.

### Dark Mode

Dark mode uses the matching `dark-*` semantic values rather than mechanically inverting light colors. Panels are only slightly lighter than the application background, borders stay translucent, and primary foreground changes to a dark value for readable contrast. Editable text fields use `{colors.dark-input-surface}`, derived from 30% of `{colors.dark-input}`, as a quiet surface tint. Preserve the same hierarchy and component states across themes.

## Typography

Mapseek uses **Geist Mono Variable** as both its sans and mono runtime family. A single monospaced voice reinforces the product's technical character and makes coordinates, identifiers, layer names, counts, and code-like values directly comparable.

### Hierarchy

| Token | Size | Weight | Line height | Use |
|---|---:|---:|---:|---|
| `{typography.headline-lg}` | 18px | 600 | 1.2 | Page and major panel titles |
| `{typography.headline-md}` | 15px | 600 | 1.25 | Dialog and section titles |
| `{typography.headline-sm}` | 14px | 500 | 1.3 | Card titles and grouped controls |
| `{typography.body-base}` | 16px | 400 | 1.5 | Root document scale and prose-oriented surfaces |
| `{typography.body-lg}` | 13px | 400 | 1.5 | Prominent interface copy and resource names |
| `{typography.body-md}` | 12px | 400 | 1.5 | Default controls, tables, fields, and panels |
| `{typography.body-sm}` | 11px | 400 | 1.5 | Metadata, counts, and compact status text |
| `{typography.label-md}` | 10px | 500 | 1.2 | Uppercase taxonomy and section labels |
| `{typography.data-display}` | 42px | 600 | 1 | Font specimens and exceptional data previews |

### Principles

- Use weights 400, 500, and 600 for most UI. Reserve 700 for the product mark or an exceptional display need.
- Use uppercase and `0.04em-0.06em` tracking only for short taxonomy labels and section eyebrows, never for sentences or buttons.
- Enable tabular numerals for coordinates, statistics, storage, timestamps, and counts.
- Keep identifiers, endpoints, code, and long data values monospaced; allow truncation with a discoverable full value or horizontal scrolling.
- The 42px data display is a specimen treatment, not a general page-heading style.
- Do not introduce a contrasting editorial or geometric display family. Hierarchy comes from size, weight, spacing, and structure.

## Layout

The layout system is built on a 4px baseline with 2px and 6px intermediate steps for compact alignment. Controls commonly use 4-8px gaps, containers use 8-16px padding, and major panels use 16-24px separation.

### Spacing System

- `{spacing.hairline}` 1px: rules and borders.
- `{spacing.micro}` 2px: icon corrections and tightly coupled state details.
- `{spacing.xs}` 4px and `{spacing.sm}` 6px: compact control and toolbar gaps.
- `{spacing.md}` 8px and `{spacing.lg}` 12px: field groups, row padding, and small containers.
- `{spacing.xl}` 16px: standard card, dialog, and panel padding.
- `{spacing.2xl}` 24px and `{spacing.3xl}` 32px: major sections and spacious empty states.

### Application Structure

- The primary shell follows **top bar -> navigation or resource rail -> working canvas -> contextual panel or overlay**.
- Toolbars stay one row where possible and use one control height per cluster.
- Sidebars and editing panels use stable widths, a 1px boundary, and independent scrolling. The resource sidebar baseline is 220px.
- The main area may host a map, virtualized table, adaptive resource grid, schema form, or editor. It owns remaining width and must keep `min-width: 0` behavior.
- Persistent actions belong in the top bar or panel footer. Destructive actions must not receive the same visual weight as the primary action.

### Grids, Tables & Forms

- Resource grids use `auto-fill` with domain-specific minimum card widths. Preserve shared gaps, borders, and selection rules across icon, sprite, and font modes.
- Tables live in an explicit bordered container with horizontal overflow. Headers are approximately 40px high; cells remain compact and whitespace is intentional.
- Field layouts may be vertical, inline, or responsive. Default editor rows use a stable label column, optional action column, and flexible content column.
- Dialogs cap width against the viewport and retain at least 16px outer space on narrow screens. Use sheets for long forms or detail inspection and popovers for local choices.
- Use logical direction properties (`start`, `end`, `ps`, `pe`, `ms`, `me`) so layouts remain RTL-compatible.

## Elevation & Depth

Mapseek is **border-first and surface-first**. Most hierarchy comes from 1px rules, small neutral surface shifts, and overlays. Static cards and panels do not float above the workspace.

| Level | Treatment | Use |
|---|---|---|
| Flat | Background only | App shell, map canvas, content regions |
| Structured | 1px `{colors.border}` | Panels, tables, cards, grouped controls |
| Selected | `{colors.selection}` plus primary edge or indicator | Current row, resource, layer, or navigation item |
| Floating | Surface plus theme shadow | Menus, popovers, tooltips, dialogs, toasts |
| Map floating | `--shadow-map-float` | Controls that sit directly above map content |

- Avoid shadows on ordinary cards, toolbars, sidebars, table rows, and form sections.
- Use the existing theme shadow scale only for components that detach from document flow.
- Dialog backdrops stay light (`black/10`) with a small blur so spatial context remains visible.
- Motion is fast and functional: 120ms for immediate feedback, 180ms for standard transitions, and 260ms for larger reveals. Prefer opacity, color, and short transform changes; honor reduced motion.
- Maintain deliberate z-index tiers for app chrome, map controls, menus/tooltips, and modal layers. Do not increment z-index ad hoc.

## Shapes

Zero radius is a defining Mapseek characteristic. All rectangular controls, fields, cards, tables, menus, popovers, dialogs, sheets, and panels use `{rounded.none}`. Do not allow framework defaults to reintroduce rounded corners.

### Shape Rules

- `{rounded.full}` is reserved for naturally circular status dots, avatar masks, and switch tracks or thumbs.
- Icon-only controls are square. Standard icon-button sizes follow the 24px, 28px, 32px, and 36px control scale.
- Tabler Icons are the default icon language. Typical interface icons are 12-16px with a 1.5-1.75 stroke.
- Use a consistent icon size and stroke within each toolbar or data row.
- Separators are 1px. Do not create hierarchy with stacked outlines, thick strokes, or decorative frames.
- The official product asset is `public/img/mapseek.png`. Preserve its transparency, aspect ratio, and full mark; do not recolor, crop, or redraw it.
- Data previews may use checkerboards, color ramps, glyph samples, or map thumbnails, but those treatments stay inside a clearly bounded preview region.

## Components

Components follow a fixed ownership model: theme -> primitives -> domain blocks -> product screens. The theme defines tokens, primitives define reusable behavior, blocks define domain composition, and product screens supply data and business actions.

### Buttons & Actions

**`button-primary`** - Green primary action, 32px high, 12px interface type, zero radius. Use one dominant primary action per local task. Hover lowers intensity; press may translate by 1px; focus adds a ring.

**Secondary variants** - Outline, secondary, and ghost treatments preserve hierarchy without inventing another action color. Use `link` only for genuine inline navigation or low-chrome actions.

**Destructive action** - Destructive text is normative in front matter; the runtime button derives its background from the same token at 10% opacity (20% in dark mode). Require confirmation when the outcome is irreversible or difficult to recover.

**Icon button** - Square 24-36px action with a 12-16px icon. Provide an accessible name and, when meaning is not obvious, a tooltip. Never use an unlabeled icon as the only description of a critical action.

### Forms & Selection

**`input`** - 32px high, zero radius, 12px text, 10px horizontal padding, explicit border, transparent light-theme surface, 30% `{colors.dark-input}` dark-theme tint, and a 3px translucent focus ring. Placeholder text is secondary; it does not replace a label. `textarea` and `input-group` use the same surface treatment.

**`field`** - Composes label, description, control, and error. Invalid controls use both `aria-invalid` and visible error copy; `FieldError` announces with `role="alert"`.

**Checkbox, switch, slider, select, combobox, toggle, and tabs** - Keep their Base UI semantics and existing keyboard behavior. Selected and checked states require a persistent visual indicator beyond hover.

### Containers & Overlays

**`card`** - Group related content only. Default cards use 16px padding and gap; small cards use 12px. The default ring is subtle and corners stay square.

**`dialog`** - Uses `DialogContent -> DialogHeader / DialogBody / DialogFooter`, 16px padding, 16px section gaps, and a readable title. Footer actions stack on narrow screens and align to the end at `sm` and above.

**`sheet`** - Long editing or detail workflows that need more vertical room than a dialog.

**Popover, dropdown, context menu, command, and tooltip** - Local floating choices. Match the trigger's alignment, retain keyboard navigation, and keep the surrounding task visible.

### Data & Status

**`table`** - Bordered, horizontally scrollable, 12px data type, 40px header, 8px cell padding. Hover and selected states must remain distinguishable.

**`badge`** - 20px high with 8px horizontal padding. Use for concise state or category labels, not for paragraph-like copy.

**Progress, skeleton, empty, sonner, and notification center** - Match feedback scope: local work stays near its source; global or background work may use notifications. Persistent state must not exist only in a temporary toast.

**JSON viewer/editor and chart** - Preserve monospaced alignment and data semantics. Large datasets need scrolling, virtualization, or incremental rendering rather than smaller unreadable type.

### Domain Blocks

- **AppTopBar**: Compact application chrome with navigation, identity, document state, central tools, and end-aligned primary action.
- **ResourceSidebar / ResourceGrid**: Stable navigation rail paired with adaptive resource cards; selected state combines tinted fill, green text or edge, and semantic state.
- **LayerPanel / LayerStyleEditor / StylePanel**: Dense inspector structures built from reusable fields and grouped sections.
- **LoomLayerPanel / LoomToolbox / LoomToolbar / CustomColormap**: Controlled map-editing surfaces for project layers, spatial tools, editing modes, and committed-versus-draft color schemes.
- **MapControls / MapCoordinateStatus / MapSwitcher**: Small floating map tools that use the dedicated map elevation and keep labels or tooltips discoverable.
- **AttrTable / AttrInspector / GeoJSONView / JSONEditor**: Data-first inspection surfaces with overflow and long-value handling.
- **ProcessingTimeline / ServiceStatus / ResourceStatus / NotificationCenter**: Explicit progress and status patterns with text, icon, and color working together.
- Blocks receive data, labels, and handlers through props. They must not embed a product engine, network request, or non-injectable business copy.

## Do's and Don'ts

### Do

- Use semantic theme tokens and existing primitive variants before adding styles.
- Keep controls compact and align neighboring controls to one height.
- Preserve the green primary color for current action, focus, selection, and limited high-value emphasis.
- Use 1px borders and small surface shifts to establish structure.
- Keep rectangular components at zero radius.
- Use Geist Mono and tabular numerals for technical values.
- Pair every state color with text, an icon, a border, progress, or a structural change.
- Keep icon-only actions square, accessible, and discoverable.
- Test light mode, dark mode, keyboard navigation, RTL, narrow widths, overflow, and reduced motion.

### Don't

- Don't introduce marketing-page whitespace, oversized hero typography, gradients, glassmorphism, or decorative blur.
- Don't round cards, controls, panels, dialogs, or menus.
- Don't add shadows to static surfaces or use elevation as decoration.
- Don't use primary green for unrelated categories, every chart series, or passive decoration.
- Don't copy hex or OKLCH literals into components when a semantic token exists.
- Don't shrink data type below the documented compact scale to make content fit.
- Don't use hover as the only signal for selection or availability.
- Don't duplicate primitive behavior inside domain blocks.
- Don't hide essential actions behind an unlabeled icon or color-only affordance.

## Responsive Behavior

Mapseek is desktop-first, but every component must remain understandable and operable on narrower screens. Responsive behavior should preserve task priority rather than simply scaling everything down.

### Breakpoints

| Range | Expected behavior |
|---|---|
| `< 640px` | Stack dialog actions, keep 16px viewport margins, collapse multi-column grids to one column, and move secondary panel content behind an explicit trigger. |
| `640-767px` | Allow two-column resource grids when minimum card width is preserved; keep compact controls but enlarge touch hit areas when required by the product shell. |
| `768-1023px` | Collapse or overlay secondary rails when the working canvas would become unusable; preserve the primary map, table, or editor. |
| `>= 1024px` | Use the full desktop shell with persistent sidebars, toolbars, working canvas, and contextual panels. |

### Collapsing Strategy

- Preserve the working canvas first, then the primary action, then current context; collapse secondary navigation and metadata after those.
- Toolbars may wrap only at meaningful action-group boundaries. Prefer overflow menus for low-frequency actions.
- Resource grids adapt through `auto-fill/minmax`; tables scroll horizontally instead of compressing columns into unreadable values.
- Sidebars become sheets or explicitly triggered overlays on narrow layouts.
- Touch products may expand the visual control's hit region toward 44px without changing the desktop density contract.

## Iteration Guide

1. Start with the nearest existing primitive or block; do not begin from raw HTML and local literals.
2. Keep token changes in `registry/theme/registry.json`, then regenerate or synchronize consuming surfaces and this document.
3. Use the existing 24/28/32/36px control scale, 4px spacing baseline, zero-radius geometry, and Tabler icon language.
4. Add component variants through the established CVA or `data-*` pattern; keep state names semantic.
5. Keep visible block copy injectable through `labels` and behavioral data injectable through props.
6. Verify loading, empty, error, disabled, selected, long-content, overflow, dark, RTL, keyboard, and reduced-motion cases.
7. Provide or update bilingual documentation and a deep-linkable showcase for every public primitive or block.
8. Run `pnpm run lint`, `pnpm run typecheck`, `pnpm test`, `pnpm run registry:validate`, and `pnpm run design:lint` after relevant changes.

## Known Gaps

- Light-theme `{components.button-primary}` currently has a 3.22:1 white-on-green contrast ratio. This passes for large text and many non-text indicators but is below WCAG AA's 4.5:1 target for normal text; the design-system owner must resolve the primary or foreground value.
- `{components.input}` is intentionally transparent in the light theme and inherits its containing background or surface. Contrast must be evaluated against that composed surface; automated checks that compare text directly with transparent black do not represent the rendered result.
- Full mobile editing flows are product-shell decisions. The registry defines narrow-layout behavior, but it does not promise that every desktop GIS workflow is touch-first.
- Chart and category token order exists at runtime, but a color-vision-safe pairing and sequencing policy is not yet documented.
- Motion tokens are defined, but complex map transitions, timeline choreography, and editor reveal sequences remain product-specific.
- Some data-heavy blocks rely on the consuming product to supply virtualization, paging, or streaming boundaries.

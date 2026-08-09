# Toolbar Complete Rename and Design Audit Specification

## Goal

Rename the public `LoomToolbar` block to `Toolbar` everywhere while preserving its existing controlled map-editing behavior. The result has one canonical component name, registry slug, documentation route, showcase entry, and set of public types. The same work records the current `DESIGN.md` compliance findings without folding visual or interaction fixes into the rename.

## Naming Contract

This is a complete breaking rename. No deprecated aliases, duplicate registry entries, redirects, or compatibility routes are retained.

| Current | Replacement |
| --- | --- |
| `LoomToolbar` | `Toolbar` |
| `LoomToolbarProps` | `ToolbarProps` |
| `LoomToolbarTool` | `ToolbarTool` |
| `LoomToolbarGroup` | `ToolbarGroup` |
| `LoomToolbarLabels` | `ToolbarLabels` |
| `LOOM_TOOLBAR_LABELS_ZH_CN` | `TOOLBAR_LABELS_ZH_CN` |
| `LOOM_TOOLBAR_LABELS_EN` | `TOOLBAR_LABELS_EN` |
| `loomToolbarGroups` | `toolbarGroups` |
| `LoomToolbarDemo` | `ToolbarDemo` |
| `LoomToolbarShowcase.tsx` | `ToolbarShowcase.tsx` |
| `loom-toolbar` | `toolbar` |
| `data-slot="loom-toolbar"` | `data-slot="toolbar"` |

The source directory becomes `registry/blocks/toolbar`, the main component file becomes `Toolbar.tsx`, and the bilingual documentation pages become `toolbar.mdx` and `toolbar.en.mdx`. Imports, registry targets, generated source catalogs, visual-QA cases, tests, navigation metadata, and documentation examples use only the replacement names.

## Component Boundary

`Toolbar` remains a controlled map-editing block. The caller continues to own tool groups, the active mode and layer, editing and dirty state, snapping, undo/redo availability, labels, and every action callback. The block continues to render the map-context scaffold, floating editing controls, and current-mode status surface.

The existing props, callback behavior, state flow, control order, labels, responsive behavior, and styling remain unchanged except for renamed public symbols and identifiers. This change does not make the block domain-generic, move its map scaffold into the Showcase, or alter interaction behavior.

## Rename Surfaces

The implementation updates all public and repository-owned references:

- `registry/blocks/toolbar/**` for the renamed component, labels, types, exports, and tests.
- `registry/blocks/registry.json` for the canonical `toolbar` item, source paths, and install targets.
- `showcase/src/showcases/ToolbarShowcase.tsx` and `showcase/src/showcases/block-catalog.ts` for the renamed demo and route key.
- `packages/docs/content/docs/blocks/toolbar.mdx`, `toolbar.en.mdx`, and both block navigation metadata files.
- Registry model, required-docs, documentation coverage, component-composition, and visual-QA references that currently identify `loom-toolbar`.
- `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`, regenerated through the existing documentation source command rather than edited as an independent source of truth.

The old directory, files, docs slugs, registry item, source-catalog key, and exported names are removed. Existing unrelated working-tree changes must be preserved and excluded from Toolbar-specific commits.

## Design Audit Findings

The audit compares the existing block with `DESIGN.md`, the repository primitives, the current shadcn component guidance, and browser behavior at desktop, narrow, light, dark, and keyboard-focus states.

Confirmed inconsistencies are reported but are explicitly out of scope for this rename:

1. The same toolbar cluster mixes 28px text actions with 32px icon actions, conflicting with the one-control-height-per-cluster rule. The primary editing action is also smaller than the documented 32px primary button.
2. Tool-mode and snapping selections locally restyle ghost `Button` controls with a solid primary fill instead of using the persistent selection surface and the existing `Toggle` primitive.
3. A local `Separator` function duplicates the existing `Separator` primitive, bypassing the documented theme → primitive → block ownership boundary.
4. At a 390px viewport, the toolbar scroller exposes 296px of 767px of content. Most actions depend on horizontal scrolling without a visible overflow affordance instead of using the preferred low-frequency overflow menu.
5. Icon controls rely on native `title` attributes rather than the design-system `Tooltip` surface described by `DESIGN.md`.

The audit also confirms that the current block uses the required zero radius, shadowless surfaces, semantic colors, Tabler icons, accessible icon-button names, 3px focus ring, and valid light/dark foreground inversion. Those conforming behaviors remain unchanged.

## Testing Strategy

Implementation follows red-green-refactor:

1. Update focused tests and repository assertions first so they expect the new `Toolbar` exports, slug, file paths, data slot, docs route, visual-QA key, and absence of legacy identifiers; verify that the old implementation fails those expectations.
2. Perform the minimal coordinated rename needed to pass the focused tests without changing styling or behavior.
3. Regenerate the documentation source catalog through its repository command.
4. Run the focused Toolbar test and the affected registry, documentation coverage, registry model, component-composition, and visual-QA tests.
5. Run type checking, linting, registry validation, and documentation-source validation in proportion to the affected surfaces.
6. Use Playwright against `/blocks/toolbar/` in light and dark themes at desktop and 390px widths. Confirm rendering, horizontal scrolling, action state changes, accessible names, keyboard focus, and absence of browser errors.
7. Search tracked source surfaces for remaining `loom-toolbar`, `LoomToolbar`, and `LOOM_TOOLBAR` identifiers; only historical design documents may retain them when referring to the previous name.

## Compatibility and Non-Goals

- The old `/blocks/loom-toolbar/` route, `loom-toolbar` registry item, `LoomToolbar*` exports, and `LOOM_TOOLBAR_*` constants are removed.
- Consumers must update imports, registry slugs, type names, and documentation links to the new `Toolbar` contract.
- No compatibility alias or redirect is added.
- No design inconsistency listed above is fixed in this change; each remains a separate follow-up decision.
- Tool grouping, map-editing semantics, snapping, undo/redo, save behavior, localization, map scaffold, status display, and controlled-state ownership remain unchanged.
- The change does not rename other `Loom*` blocks or introduce a generic toolbar primitive.

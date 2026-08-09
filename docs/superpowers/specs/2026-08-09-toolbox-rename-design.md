# Toolbox Rename and Design Compliance Specification

## Goal

Rename the public `LoomToolbox` block to the generic `Toolbox` name everywhere and bring the block into alignment with `DESIGN.md` without changing its controlled-state behavior. The result has one canonical component name, registry slug, documentation route, showcase entry, and set of public types.

## Naming Contract

This is a complete breaking rename. No deprecated aliases, duplicate registry entries, or compatibility route are retained.

| Current | Replacement |
| --- | --- |
| `LoomToolbox` | `Toolbox` |
| `LoomToolboxProps` | `ToolboxProps` |
| `LoomToolboxLabels` | `ToolboxLabels` |
| `LoomToolboxTab` | `ToolboxTab` |
| `LoomTool` | `ToolboxTool` |
| `LOOM_TOOLBOX_LABELS_ZH_CN` | `TOOLBOX_LABELS_ZH_CN` |
| `LOOM_TOOLBOX_LABELS_EN` | `TOOLBOX_LABELS_EN` |
| `loom-toolbox` | `toolbox` |
| `LoomToolboxShowcase` / `LoomToolboxDemo` | `ToolboxShowcase` / `ToolboxDemo` |
| `data-slot="loom-toolbox"` | `data-slot="toolbox"` |

The source directory becomes `registry/blocks/toolbox`, the main component file becomes `Toolbox.tsx`, and the bilingual documentation pages become `toolbox.mdx` and `toolbox.en.mdx`. Imports, registry targets, generated source catalogs, visual-QA cases, tests, navigation metadata, and documentation examples use the replacement names.

## Component Boundary

`Toolbox` remains a controlled spatial-analysis panel. The caller continues to own tool data, the active tab, search query, favorites, recents, selected tool, parameter values, open state, and completion state. The block continues to own filtering and the interaction structure only.

The existing callback behavior and state flow remain unchanged. This change does not add data fetching, persistence, routing, tool execution logic, or new parameter types.

## Layout and Responsive Behavior

The open panel uses a stable 360px default width and retains `min-w-0` and `max-w-full`, so it stays useful as a desktop GIS side panel while shrinking to its host width on narrow screens. The existing 560px default height, bordered card surface, zero radius, clipped outer shell, and independently scrolling content area remain unchanged.

The Showcase wrapper uses the same 360px preferred width instead of constraining the component back to 320px. Documentation and visual checks cover both a normal desktop viewport and a narrow viewport.

## Design Compliance Changes

The implementation resolves the issues found by comparing the current block with `DESIGN.md`:

1. Passive header, quick-access, list, and detail icons use neutral semantic surfaces and text instead of primary green. Green remains reserved for the selected tab, favorite state, primary run action, and completion feedback.
2. Quick-access cards gain the documented card hover treatment: a subtle primary-tinted surface and primary edge. The card still contains separate open-tool and favorite actions, so no nested interactive element is introduced.
3. Truncated tool labels, group/description summaries, and clamped quick-access descriptions expose the complete value through a discoverable native title.
4. Tool counts use tabular numerals through the existing `tnum` utility.
5. Icons rendered inside `Button` rely on the primitive's icon sizing instead of local size overrides. Standalone decorative icons may retain explicit dimensions and are hidden from the accessibility tree when needed.
6. The search field keeps its visible accessible name and adds a stable `name` plus `autoComplete="off"`. Search placeholder copy uses an ellipsis in both locales.

All colors remain semantic tokens. No radius, shadow, raw color, new z-index, or competing design token is introduced.

## Files and Generated Artifacts

The change covers these source surfaces:

- `registry/blocks/toolbox/**` for the renamed block, labels, types, exports, and tests.
- `registry/blocks/registry.json` for the `toolbox` registry item and install targets.
- `showcase/src/showcases/ToolboxShowcase.tsx` and `showcase/src/showcases/block-catalog.ts` for the renamed demo.
- `packages/docs/content/docs/blocks/toolbox.mdx`, `toolbox.en.mdx`, and both block navigation metadata files.
- Registry, documentation, composition, and visual-QA allowlists/tests that currently identify `loom-toolbox`.
- `packages/docs/src/components/ShowcaseDemo/source-catalog.generated.ts`, regenerated through the existing documentation source command rather than edited as an independent source of truth.

Existing unrelated working-tree changes, including the in-progress layer-panel work, must be preserved and excluded from Toolbox-specific commits.

## Testing Strategy

Implementation follows red-green-refactor:

1. Add or update focused tests first so they fail on the old slug, exports, width, data slot, semantic icon treatment, discoverable truncation, and tabular count behavior.
2. Rename and update the minimal production files required to pass those tests.
3. Run the focused Toolbox and registry/documentation tests.
4. Run type checking, linting, registry validation, documentation source generation/checks, and the repository's relevant visual-QA path.
5. Use Playwright against `/blocks/toolbox/` at desktop and narrow widths to confirm rendering, no horizontal overflow, list/detail interaction, keyboard focus, and both light and dark themes.

## Compatibility and Non-Goals

- The old `LoomToolbox` symbols, `loom-toolbox` registry item, directory, docs route, and showcase key are removed.
- Consumers must update imports and type names to the new `Toolbox` contract.
- Tool filtering, favorites, recents, detail navigation, parameter validation, and run behavior remain semantically unchanged.
- The change does not virtualize large tool collections, redesign the panel information architecture, add additional tool parameters, or alter other Loom-prefixed blocks.

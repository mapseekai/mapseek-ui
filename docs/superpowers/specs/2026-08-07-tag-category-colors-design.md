# Tag category color design

**Date:** 2026-08-07
**Status:** Approved for planning

## Goal

Add a reusable `Tag` primitive for compact, non-interactive category labels. It must match the Badge outline variant's square, 20px geometry while adding restrained colored backgrounds so category labels are immediately distinguishable.

## Public API

```tsx
<Tag>Featured</Tag>
<Tag color="blue">Vector</Tag>
```

`Tag` accepts the standard Base UI `render` and span props, plus a `color` prop with this union:

```ts
"green" | "blue" | "yellow" | "orange" | "purple" | "cyan" | "gray"
```

`green` is the default and uses the theme's primary green, as requested. Export `Tag`, `TagColor`, and `tagVariants`.

## Visual treatment

The component reuses Badge outline's compact geometry: square corners, 20px height, 8px horizontal padding, 13px medium text, 1px border, and inline icon spacing. Each color has a 10% background tint, a 30% same-color border, and same-color text.

| `color` | Token mapping |
| --- | --- |
| green | `primary` |
| blue | `cat-2` |
| yellow | `cat-3` |
| orange | `cat-4` |
| purple | `cat-5` |
| cyan | `cat-6` |
| gray | `border` + muted surface/foreground |

The Tag is intentionally static by default. When rendered as an anchor or button through `render`, it retains the focus-visible treatment inherited from the Badge outline structure. Tag copy must explain its category without relying on color alone.

## Implementation boundary

- Add `registry/ui/tag.tsx` as an independent primitive rather than adding category colors to `Badge` or wrapping it.
- Add a registry entry with the same Base UI, CVA, theme, and utility dependencies as Badge.
- Add focused tests, bilingual docs, a showcase demo, component navigation metadata, and regenerated registry/docs artifacts.
- Reuse existing semantic and category tokens only; do not add theme colors or modify Badge.

## Verification

- Add test-first coverage for the default green mapping and all explicit color mappings.
- Validate the registry and generated docs artifacts, run the focused tests, formatter/lint, and TypeScript checks.
- Inspect the Tag docs page in light and dark themes using ego-browser, including the default green and all explicit colors.

## Non-goals

- No dismiss button, selection state, count behavior, or dynamic status semantics.
- No changes to the existing Badge API, variants, or consumer call sites.

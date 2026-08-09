# PixelProbe Prose Isolation Design

## Context

`PixelProbe` renders semantic `dl`, `dt`, and `dd` elements inside documentation and other content surfaces. On the docs page, prose typography rules add margins to those elements. The live page shows that the component's intended 10px list gap is compounded by a 20px top margin on every `dt`, an additional top margin on every `dd`, and margins on the `dl` itself. This stretches each field row and forces unnecessary scrolling.

## Goal

Restore the compact spacing already expressed by `PixelProbe`'s own layout classes while preserving its single-column information hierarchy, semantic markup, public API, navigation behavior, and responsive width.

## Design

Add Tailwind Typography's `not-prose` class to the `PixelProbe` root `section`. This establishes the component as a self-contained UI surface and prevents surrounding prose styles from changing descendant spacing or typography. All existing component-owned spacing remains unchanged:

- the details list keeps its 10px row gap and 10px vertical padding;
- each label/value pair keeps its 4px internal gap;
- value rows remain 28px high and horizontally scrollable when needed;
- header, footer, empty state, and field semantics remain unchanged.

Root-level isolation is preferred over resetting margins on each semantic child because it also protects the component from other present or future prose rules. Applying `not-prose` only in the showcase is rejected because consumers can embed the block in their own prose containers.

## Testing

Extend the existing server-rendered `PixelProbe` test to assert that the root section carries `not-prose`. The assertion will fail before the production change and pass after it. Then run the focused test suite and verify the docs example in the local browser, confirming that computed `dl`, `dt`, and `dd` margins are zero and that all seven fields fit with the intended compact rhythm.

## Scope

Only `PixelProbe` and its focused test are implementation targets. No API, data model, documentation copy, showcase dimensions, or unrelated components will change.

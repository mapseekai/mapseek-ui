import {
  Children,
  type ElementType,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import {
  type ColormapPreset,
  CustomColormapEditor,
  DEFAULT_CUSTOM_COLORMAP,
} from "../raster-style-panel"
import { CustomColormap } from "./CustomColormap"
import {
  CUSTOM_COLORMAP_LABELS_EN,
  CUSTOM_COLORMAP_LABELS_ZH_CN,
  type CustomColormapDialogLabels,
} from "./labels"

const englishPresets: ColormapPreset[] = [
  {
    id: "terrain",
    name: "Terrain",
    stops: ["#2a6fdb", "#34b75f", "#d4c456", "#d97757", "#f5f5f5"],
  },
]

function findElementByType(node: ReactNode, type: ElementType): ReactElement | null {
  if (!isValidElement(node)) return null
  if (node.type === type) return node

  const children = (node.props as { children?: ReactNode }).children
  for (const child of Children.toArray(children)) {
    const match = findElementByType(child, type)
    if (match) return match
  }

  return null
}

describe("CustomColormap", () => {
  it("formats summaries with localized interpolation and color-space labels", () => {
    expect(CUSTOM_COLORMAP_LABELS_ZH_CN.summary(3, "linear", "oklch")).toBe(
      "3 个色停 · 线性 · OKLCH",
    )
    expect(CUSTOM_COLORMAP_LABELS_EN.summary(3, "linear", "oklch")).toBe("3 stops · Linear · OKLCH")
  })

  it("renders the committed color ramp inside a bounded preview", () => {
    const html = renderToStaticMarkup(
      <CustomColormap
        value={DEFAULT_CUSTOM_COLORMAP}
        draft={DEFAULT_CUSTOM_COLORMAP}
        open={false}
        labels={CUSTOM_COLORMAP_LABELS_ZH_CN}
        onOpenChange={() => {}}
        onDraftChange={() => {}}
        onApply={() => {}}
      />,
    )

    expect(html).toContain("3 个色停 · 线性 · OKLCH")
    expect(html).toMatch(
      /data-slot="custom-colormap-preview"[^>]*class="[^"]*border border-border[^"]*"/,
    )
  })

  it("keeps caller-supplied preset names and accepts legacy label objects", () => {
    const legacyLabels: CustomColormapDialogLabels = {
      title: CUSTOM_COLORMAP_LABELS_EN.title,
      description: CUSTOM_COLORMAP_LABELS_EN.description,
      edit: CUSTOM_COLORMAP_LABELS_EN.edit,
      cancel: CUSTOM_COLORMAP_LABELS_EN.cancel,
      apply: CUSTOM_COLORMAP_LABELS_EN.apply,
      summary: CUSTOM_COLORMAP_LABELS_EN.summary,
      editor: CUSTOM_COLORMAP_LABELS_EN.editor,
    }
    const tree = CustomColormap({
      value: DEFAULT_CUSTOM_COLORMAP,
      draft: DEFAULT_CUSTOM_COLORMAP,
      open: false,
      labels: legacyLabels,
      presets: englishPresets,
      onOpenChange: () => {},
      onDraftChange: () => {},
      onApply: () => {},
    })
    const editor = findElementByType(tree, CustomColormapEditor)

    expect(legacyLabels.close).toBeUndefined()
    expect(legacyLabels.presetNames).toBeUndefined()
    expect(editor).not.toBeNull()
    if (!editor) throw new Error("Expected CustomColormapEditor")
    expect((editor.props as { presets?: ColormapPreset[] }).presets).toBe(englishPresets)
  })
})

describe("CustomColormapEditor", () => {
  it("renders compact circular remove controls that appear when a stop is hovered", () => {
    const html = renderToStaticMarkup(
      <CustomColormapEditor
        value={DEFAULT_CUSTOM_COLORMAP}
        labels={CUSTOM_COLORMAP_LABELS_EN.editor}
        onChange={() => {}}
      />,
    )
    const removeButtons = html.match(/<button[^>]*aria-label="Remove stop"[^>]*>/g) ?? []

    expect(removeButtons).toHaveLength(3)
    expect(html.match(/class="group\/stop relative size-7 shrink-0"/g)).toHaveLength(3)
    for (const button of removeButtons) {
      expect(button).toContain("size-3.5")
      expect(button).toContain("rounded-full")
      expect(button).toContain("opacity-0")
      expect(button).toContain("group-hover/stop:opacity-100")
    }
  })

  it("bounds previews, adapts the preset grid, and inherits action typography", () => {
    const html = renderToStaticMarkup(
      <CustomColormapEditor
        value={DEFAULT_CUSTOM_COLORMAP}
        labels={CUSTOM_COLORMAP_LABELS_EN.editor}
        presets={englishPresets}
        onChange={() => {}}
      />,
    )

    expect(html).toMatch(
      /data-slot="custom-colormap-editor-preview"[^>]*class="[^"]*border border-border[^"]*"/,
    )
    expect(html).toMatch(
      /data-slot="custom-colormap-presets"[^>]*class="[^"]*grid-cols-2[^"]*sm:grid-cols-4[^"]*"/,
    )
    expect(html).toContain(">Terrain</span>")
    expect(html).not.toContain('text-[10px] text-muted-foreground">Terrain')
    expect(html).toMatch(
      /<span class="[^"]*min-w-0[^"]*whitespace-normal[^"]*break-words[^"]*">Terrain<\/span>/,
    )
  })

  it("marks section and action glyphs as decorative", () => {
    const html = renderToStaticMarkup(
      <CustomColormapEditor
        value={DEFAULT_CUSTOM_COLORMAP}
        labels={CUSTOM_COLORMAP_LABELS_EN.editor}
        onChange={() => {}}
      />,
    )

    expect(html.match(/<svg[^>]*aria-hidden="true"/g)?.length ?? 0).toBeGreaterThanOrEqual(8)
  })
})

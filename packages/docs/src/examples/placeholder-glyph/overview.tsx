import { PlaceholderGlyph } from "@registry/blocks/placeholder-glyph"
import { Button } from "@registry/ui/button"
import { useState } from "react"

type PlaceholderGlyphFixture = {
  readonly seed: string
  readonly label: string
}

export type PlaceholderGlyphDemoLabels = {
  readonly toggleTone: string
  readonly tone: string
  readonly normal: string
  readonly muted: string
  readonly glyphs: PlaceholderGlyphFixture[]
}

export const zhPlaceholderGlyphLabels = {
  toggleTone: "切换 muted",
  tone: "当前色调",
  normal: "普通",
  muted: "muted",
  glyphs: [
    { seed: "search", label: "搜索" },
    { seed: "layer", label: "图层" },
    { seed: "heatmap", label: "热力图" },
    { seed: "poi", label: "POI" },
    { seed: "g_basic-0", label: "基础 0" },
    { seed: "g_map-3", label: "地图 3" },
    { seed: "sp_basic-2", label: "雪碧 2" },
    { seed: "delta", label: "Delta" },
  ],
} satisfies PlaceholderGlyphDemoLabels

export const enPlaceholderGlyphLabels = {
  toggleTone: "Toggle muted",
  tone: "Current tone",
  normal: "normal",
  muted: "muted",
  glyphs: [
    { seed: "search", label: "search" },
    { seed: "layer", label: "layer" },
    { seed: "heatmap", label: "heatmap" },
    { seed: "poi", label: "poi" },
    { seed: "g_basic-0", label: "g_basic-0" },
    { seed: "g_map-3", label: "g_map-3" },
    { seed: "sp_basic-2", label: "sp_basic-2" },
    { seed: "delta", label: "delta" },
  ],
} satisfies PlaceholderGlyphDemoLabels

export function PlaceholderGlyphDemo({ labels }: { readonly labels: PlaceholderGlyphDemoLabels }) {
  const [mono, setMono] = useState(false)

  return (
    <div data-demo="placeholder-glyph" className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="placeholder-glyph-toggle"
          onClick={() => setMono((current) => !current)}
        >
          {labels.toggleTone}
        </Button>
        <span
          data-demo-status="placeholder-glyph"
          className="font-mono text-xs text-muted-foreground"
        >
          {labels.tone}: {mono ? labels.muted : labels.normal}
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-px border border-border bg-border">
        {labels.glyphs.map((item) => (
          <div
            key={item.seed}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 bg-background p-2"
          >
            <PlaceholderGlyph size={28} seed={item.seed} mono={mono} />
            <span className="font-mono text-[9px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-6 overflow-x-auto">
        {[16, 24, 32, 48, 72].map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <PlaceholderGlyph size={size} seed="g_map-3" mono={mono} />
            <span className="font-mono text-[10px] text-muted-foreground">{size}px</span>
          </div>
        ))}
      </div>
    </div>
  )
}

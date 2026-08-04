import { LayerEditorGroup } from "@registry/blocks/layer-editor-group"
import { buildLayerEditorSections, layerEditorGroupLabels } from "./layer-editor-sections"
import type { LocalizedDemoProps } from "./types"

export function LayerEditorGroupDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = layerEditorGroupLabels[locale]
  return (
    <div className="space-y-3">
      <div>
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.title}
        </h3>
        <p className="mt-1 mb-0 max-w-2xl text-xs text-muted-foreground">{demoLabels.intro}</p>
      </div>
      <div
        data-demo-panel="layer-editor-group"
        className="h-[420px] w-full max-w-[380px] overflow-y-auto border border-border bg-card"
      >
        <LayerEditorGroup sections={buildLayerEditorSections(locale)} />
      </div>
    </div>
  )
}

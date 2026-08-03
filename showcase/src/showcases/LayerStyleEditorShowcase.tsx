import { LayerStyleEditor, type LayerStyleEditorTab } from "@registry/blocks/layer-style-editor"
import { useState } from "react"
import { buildLayerEditorSections } from "./layer-editor-sections"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    heading: "完整样式编辑面板",
    title: "图层：'background'",
    intro: "统一右侧样式编辑器的 header、操作菜单、关闭按钮、底部 tabs 和内部分组。",
    ariaLabel: "图层编辑器",
    actionMenu: "图层选项",
    close: "关闭图层编辑器",
    duplicate: "复制图层",
    hide: "隐藏",
    moveUp: "上移图层",
    delete: "删除",
    closed: "已关闭",
    selectedAction: "已选择操作",
    tabStyle: "样式",
    tabData: "数据",
    tabJson: "JSON",
  },
  en: {
    heading: "Complete style editor panel",
    title: "Layer: 'background'",
    intro:
      "A complete right-side editor shell with header actions, close control, tabs, and grouped sections.",
    ariaLabel: "Layer editor",
    actionMenu: "Layer options",
    close: "Close layer editor",
    duplicate: "Duplicate layer",
    hide: "Hide",
    moveUp: "Move layer up",
    delete: "Delete",
    closed: "Closed",
    selectedAction: "Selected action",
    tabStyle: "Style",
    tabData: "Data",
    tabJson: "JSON",
  },
}

export function LayerStyleEditorDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [status, setStatus] = useState<string>(demoLabels.intro)
  const sections = buildLayerEditorSections(locale)
  const tabs: LayerStyleEditorTab[] = [
    {
      id: "style",
      label: demoLabels.tabStyle,
      sections: sections.slice(0, 3),
    },
    {
      id: "data",
      label: demoLabels.tabData,
      sections: sections.slice(3, 4),
    },
    {
      id: "json",
      label: demoLabels.tabJson,
      sections: sections.slice(4),
    },
  ]

  return (
    <div className="space-y-3">
      <div>
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.heading}
        </h3>
        <p className="mt-1 mb-0 max-w-2xl text-xs text-muted-foreground">{demoLabels.intro}</p>
      </div>
      <div className="h-[560px] w-full max-w-[420px] overflow-hidden border border-border">
        <LayerStyleEditor
          dataWdKey="docs-layer-style-editor"
          title={demoLabels.title}
          ariaLabel={demoLabels.ariaLabel}
          actionMenuLabel={demoLabels.actionMenu}
          closeLabel={demoLabels.close}
          onClose={() => setStatus(demoLabels.closed)}
          actions={[
            {
              id: "duplicate",
              label: demoLabels.duplicate,
              dataWdKey: "layer-style-editor-duplicate",
              onSelect: () => setStatus(`${demoLabels.selectedAction}: ${demoLabels.duplicate}`),
            },
            {
              id: "hide",
              label: demoLabels.hide,
              dataWdKey: "layer-style-editor-hide",
              onSelect: () => setStatus(`${demoLabels.selectedAction}: ${demoLabels.hide}`),
            },
            {
              id: "move-up",
              label: demoLabels.moveUp,
              dataWdKey: "layer-style-editor-move-up",
              onSelect: () => setStatus(`${demoLabels.selectedAction}: ${demoLabels.moveUp}`),
              disabled: true,
            },
            {
              id: "delete",
              label: demoLabels.delete,
              dataWdKey: "layer-style-editor-delete",
              onSelect: () => setStatus(`${demoLabels.selectedAction}: ${demoLabels.delete}`),
              variant: "destructive",
            },
          ]}
          tabs={tabs}
        />
      </div>
      <span
        data-demo-status="layer-style-editor"
        className="font-mono text-xs text-muted-foreground"
      >
        {status}
      </span>
    </div>
  )
}

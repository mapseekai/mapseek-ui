import { LayerStyleEditor, type LayerStyleEditorTab } from "@registry/blocks/layer-style-editor"
import { useState } from "react"
import {
  buildLayerEditorSections,
  enLayerEditorGroupLabels,
  type LayerEditorGroupDemoLabels,
  zhLayerEditorGroupLabels,
} from "../layer-editor-group/overview"

export type LayerStyleEditorDemoLabels = {
  readonly title: string
  readonly intro: string
  readonly ariaLabel: string
  readonly actionMenu: string
  readonly close: string
  readonly duplicate: string
  readonly hide: string
  readonly moveUp: string
  readonly delete: string
  readonly closed: string
  readonly selectedAction: string
  readonly tabStyle: string
  readonly tabData: string
  readonly tabJson: string
  readonly group: LayerEditorGroupDemoLabels
}

export const zhLayerStyleEditorLabels = {
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
  group: zhLayerEditorGroupLabels,
} satisfies LayerStyleEditorDemoLabels

export const enLayerStyleEditorLabels = {
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
  group: enLayerEditorGroupLabels,
} satisfies LayerStyleEditorDemoLabels

export function LayerStyleEditorDemo({ labels }: { readonly labels: LayerStyleEditorDemoLabels }) {
  const [status, setStatus] = useState(labels.intro)
  const sections = buildLayerEditorSections(labels.group)
  const tabs: LayerStyleEditorTab[] = [
    {
      id: "style",
      label: labels.tabStyle,
      sections: sections.slice(0, 3),
    },
    {
      id: "data",
      label: labels.tabData,
      sections: sections.slice(3, 4),
    },
    {
      id: "json",
      label: labels.tabJson,
      sections: sections.slice(4),
    },
  ]

  return (
    <div data-demo="layer-style-editor" className="space-y-3">
      <div>
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          Complete style editor panel
        </h3>
        <p className="mt-1 mb-0 max-w-2xl text-xs text-muted-foreground">{labels.intro}</p>
      </div>
      <div className="h-[560px] w-full max-w-[420px] overflow-hidden border border-border">
        <LayerStyleEditor
          dataWdKey="docs-layer-style-editor"
          title={labels.title}
          ariaLabel={labels.ariaLabel}
          actionMenuLabel={labels.actionMenu}
          closeLabel={labels.close}
          onClose={() => setStatus(labels.closed)}
          actions={[
            {
              id: "duplicate",
              label: labels.duplicate,
              dataWdKey: "layer-style-editor-duplicate",
              onSelect: () => setStatus(`${labels.selectedAction}: ${labels.duplicate}`),
            },
            {
              id: "hide",
              label: labels.hide,
              dataWdKey: "layer-style-editor-hide",
              onSelect: () => setStatus(`${labels.selectedAction}: ${labels.hide}`),
            },
            {
              id: "move-up",
              label: labels.moveUp,
              dataWdKey: "layer-style-editor-move-up",
              onSelect: () => setStatus(`${labels.selectedAction}: ${labels.moveUp}`),
              disabled: true,
            },
            {
              id: "delete",
              label: labels.delete,
              dataWdKey: "layer-style-editor-delete",
              onSelect: () => setStatus(`${labels.selectedAction}: ${labels.delete}`),
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

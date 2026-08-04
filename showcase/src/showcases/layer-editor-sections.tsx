import type { LayerEditorGroupSection } from "@registry/blocks/layer-editor-group"
import { Input } from "@registry/ui/input"
import { JsonViewer } from "@registry/ui/json-viewer"
import { Label } from "@registry/ui/label"
import { Textarea } from "@registry/ui/textarea"
import { IconBraces, IconBrush, IconFilter, IconLayout, IconStack2 } from "@tabler/icons-react"
import type { LocalizedDemoProps } from "./types"

export const layerEditorGroupLabels = {
  "zh-CN": {
    title: "粘性分组编辑器",
    intro: "业务组件接收任意数量的 sections；每个 section 的内容由调用方提供。",
    fields: {
      layerId: "图层 ID",
      type: "类型",
      minZoom: "最小缩放",
      maxZoom: "最大缩放",
      note: "注释",
      color: "颜色",
      pattern: "图案",
      opacity: "不透明度",
      visibility: "可见性",
      sortKey: "排序键",
    },
    values: {
      note: "地图底图背景。",
    },
    sections: {
      layer: "图层",
      paint: "绘制属性",
      layout: "布局属性",
      filter: "过滤器",
      json: "JSON",
    },
  },
  en: {
    title: "Sticky section editor",
    intro: "The block receives any number of caller-owned sections and renders sticky headers.",
    fields: {
      layerId: "Layer ID",
      type: "Type",
      minZoom: "Min zoom",
      maxZoom: "Max zoom",
      note: "Note",
      color: "Color",
      pattern: "Pattern",
      opacity: "Opacity",
      visibility: "Visibility",
      sortKey: "Sort key",
    },
    values: {
      note: "Map basemap background.",
    },
    sections: {
      layer: "Layer",
      paint: "Paint",
      layout: "Layout",
      filter: "Filter",
      json: "JSON",
    },
  },
}

function FieldRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Label className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input value={value} readOnly className="font-mono" />
    </Label>
  )
}

export function buildLayerEditorSections(
  locale: LocalizedDemoProps["locale"] = "zh-CN",
): LayerEditorGroupSection[] {
  const demoLabels = layerEditorGroupLabels[locale]
  return [
    {
      id: "layer",
      dataWdKey: "layer",
      title: demoLabels.sections.layer,
      icon: IconStack2,
      children: (
        <div className="space-y-3 p-4">
          <FieldRow label={demoLabels.fields.layerId} value="background" />
          <FieldRow label={demoLabels.fields.type} value="background" />
          <FieldRow label={demoLabels.fields.minZoom} value="0" />
          <FieldRow label={demoLabels.fields.maxZoom} value="24" />
          <Label className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
            <span className="pt-2 text-xs font-medium text-muted-foreground">
              {demoLabels.fields.note}
            </span>
            <Textarea value={demoLabels.values.note} readOnly className="min-h-20 resize-none" />
          </Label>
        </div>
      ),
    },
    {
      id: "paint",
      dataWdKey: "paint",
      title: demoLabels.sections.paint,
      icon: IconBrush,
      children: (
        <div className="space-y-3 p-4">
          <FieldRow label={demoLabels.fields.color} value="rgb(242,243,240)" />
          <FieldRow label={demoLabels.fields.pattern} value="" />
          <FieldRow label={demoLabels.fields.opacity} value="1" />
        </div>
      ),
    },
    {
      id: "layout",
      dataWdKey: "layout",
      title: demoLabels.sections.layout,
      icon: IconLayout,
      children: (
        <div className="space-y-3 p-4">
          <FieldRow label={demoLabels.fields.visibility} value="visible" />
          <FieldRow label={demoLabels.fields.sortKey} value="0" />
        </div>
      ),
    },
    {
      id: "filter",
      dataWdKey: "filter",
      title: demoLabels.sections.filter,
      icon: IconFilter,
      children: (
        <div className="space-y-2 p-4">
          <Input value='["==", "class", "park"]' readOnly className="font-mono" />
        </div>
      ),
    },
    {
      id: "json",
      dataWdKey: "json",
      title: demoLabels.sections.json,
      icon: IconBraces,
      children: (
        <JsonViewer
          data={{
            id: "background",
            type: "background",
            paint: {
              "background-color": "rgb(242,243,240)",
            },
          }}
          defaultExpanded
          className="border-0"
        />
      ),
    },
  ]
}

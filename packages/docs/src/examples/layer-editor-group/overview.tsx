import { LayerEditorGroup, type LayerEditorGroupSection } from "@registry/blocks/layer-editor-group"
import { Input } from "@registry/ui/input"
import { JsonViewer } from "@registry/ui/json-viewer"
import { Label } from "@registry/ui/label"
import { Textarea } from "@registry/ui/textarea"
import { IconBraces, IconBrush, IconFilter, IconLayout, IconStack2 } from "@tabler/icons-react"

export type LayerEditorGroupDemoLabels = {
  readonly title: string
  readonly intro: string
  readonly fields: {
    readonly layerId: string
    readonly type: string
    readonly minZoom: string
    readonly maxZoom: string
    readonly note: string
    readonly color: string
    readonly pattern: string
    readonly opacity: string
    readonly visibility: string
    readonly sortKey: string
  }
  readonly values: {
    readonly note: string
  }
  readonly sections: {
    readonly layer: string
    readonly paint: string
    readonly layout: string
    readonly filter: string
    readonly json: string
  }
}

export const zhLayerEditorGroupLabels = {
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
} satisfies LayerEditorGroupDemoLabels

export const enLayerEditorGroupLabels = {
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
} satisfies LayerEditorGroupDemoLabels

function FieldRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Label className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input value={value} readOnly className="font-mono" />
    </Label>
  )
}

export function buildLayerEditorSections(
  labels: LayerEditorGroupDemoLabels,
): LayerEditorGroupSection[] {
  return [
    {
      id: "layer",
      dataWdKey: "layer",
      title: labels.sections.layer,
      icon: IconStack2,
      children: (
        <div className="space-y-3 p-4">
          <FieldRow label={labels.fields.layerId} value="background" />
          <FieldRow label={labels.fields.type} value="background" />
          <FieldRow label={labels.fields.minZoom} value="0" />
          <FieldRow label={labels.fields.maxZoom} value="24" />
          <Label className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
            <span className="pt-2 text-xs font-medium text-muted-foreground">
              {labels.fields.note}
            </span>
            <Textarea value={labels.values.note} readOnly className="min-h-20 resize-none" />
          </Label>
        </div>
      ),
    },
    {
      id: "paint",
      dataWdKey: "paint",
      title: labels.sections.paint,
      icon: IconBrush,
      children: (
        <div className="space-y-3 p-4">
          <FieldRow label={labels.fields.color} value="rgb(242,243,240)" />
          <FieldRow label={labels.fields.pattern} value="" />
          <FieldRow label={labels.fields.opacity} value="1" />
        </div>
      ),
    },
    {
      id: "layout",
      dataWdKey: "layout",
      title: labels.sections.layout,
      icon: IconLayout,
      children: (
        <div className="space-y-3 p-4">
          <FieldRow label={labels.fields.visibility} value="visible" />
          <FieldRow label={labels.fields.sortKey} value="0" />
        </div>
      ),
    },
    {
      id: "filter",
      dataWdKey: "filter",
      title: labels.sections.filter,
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
      title: labels.sections.json,
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

export function LayerEditorGroupDemo({ labels }: { readonly labels: LayerEditorGroupDemoLabels }) {
  return (
    <div data-demo="layer-editor-group" className="space-y-3">
      <div>
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">{labels.title}</h3>
        <p className="mt-1 mb-0 max-w-2xl text-xs text-muted-foreground">{labels.intro}</p>
      </div>
      <div
        data-demo-panel="layer-editor-group"
        className="h-[420px] w-full max-w-[380px] overflow-y-auto border border-border bg-card"
      >
        <LayerEditorGroup sections={buildLayerEditorSections(labels)} />
      </div>
    </div>
  )
}

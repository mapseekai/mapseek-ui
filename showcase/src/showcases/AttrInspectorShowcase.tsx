import {
  type AttrFieldMeta,
  AttrInspector,
  type AttrInspectorFeature,
  type AttrInspectorMode,
} from "@registry/blocks/attr-inspector"
import { ToggleGroup, ToggleGroupItem } from "@registry/ui/toggle-group"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const feature: AttrInspectorFeature = {
  id: 1024,
  layer: "land_use",
  properties: {
    fid: 1024,
    use: "Residential R2",
    code: "R2",
    area_m2: 48210,
    owner: "West District Office",
    updated: "2024-03-12",
  },
}

const fields: AttrFieldMeta[] = [
  { name: "use", enumOptions: ["Residential R2", "Industrial M1", "Park G1", "Commercial C2"] },
]

const labels = {
  "zh-CN": {
    read: "只读 read",
    edit: "读写 edit",
    intro: "单要素浮动属性面板。fid 自动推断为主键只读，use 使用枚举控件。",
    changed: "已编辑字段",
    confirmed: "已确认",
    cancelled: "已取消",
    deleted: "已请求删除",
    closed: "已关闭",
    geojson: "打开 GeoJSON",
    added: "添加字段",
    inspector: {
      title: "属性",
      primaryKey: "主键 · 只读",
      close: "关闭",
      addField: "添加字段",
      delete: "删除",
      viewGeoJSON: "GeoJSON",
      cancel: "取消",
      confirm: "确定",
    },
  },
  en: {
    read: "Read only",
    edit: "Editable",
    intro:
      "Floating inspector for one feature. fid is inferred as read-only primary key; use is enum-backed.",
    changed: "Edited field",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    deleted: "Delete requested",
    closed: "Closed",
    geojson: "Open GeoJSON",
    added: "Add field",
    inspector: {
      title: "Attributes",
      primaryKey: "Primary key · read-only",
      close: "Close",
      addField: "Add field",
      delete: "Delete",
      viewGeoJSON: "GeoJSON",
      cancel: "Cancel",
      confirm: "Confirm",
    },
  },
}

export function AttrInspectorDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [mode, setMode] = useState<AttrInspectorMode>("edit")
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [status, setStatus] = useState(demoLabels.changed)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          value={[mode]}
          size="sm"
          onValueChange={(nextModes) => {
            const nextMode = nextModes.at(-1) as AttrInspectorMode | undefined
            if (nextMode) setMode(nextMode)
          }}
        >
          {(["read", "edit"] as const).map((item) => (
            <ToggleGroupItem
              key={item}
              value={item}
              data-demo-action={`mode-${item}`}
              aria-label={item === "read" ? demoLabels.read : demoLabels.edit}
            >
              {item === "read" ? demoLabels.read : demoLabels.edit}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <span data-demo-status="attr-inspector" className="font-mono text-xs text-muted-foreground">
          {status}
        </span>
      </div>
      <p className="m-0 text-xs text-muted-foreground">{demoLabels.intro}</p>
      <div className="relative h-[544px] overflow-hidden border border-border bg-muted/20">
        <AttrInspector
          className="absolute top-4 left-1/2 w-[340px] max-w-[calc(100%-2rem)] -translate-x-1/2 shadow-none"
          feature={feature}
          mode={mode}
          fields={fields}
          draft={draft}
          labels={demoLabels.inspector}
          onFieldChange={(key, value) => {
            setDraft((current) => ({ ...current, [key]: value }))
            setStatus(`${demoLabels.changed}: ${key}`)
          }}
          onAddField={() => setStatus(demoLabels.added)}
          onViewGeoJSON={() => setStatus(demoLabels.geojson)}
          onDelete={() => setStatus(demoLabels.deleted)}
          onConfirm={() => {
            setDraft({})
            setStatus(demoLabels.confirmed)
          }}
          onCancel={() => {
            setDraft({})
            setStatus(demoLabels.cancelled)
          }}
          onClose={() => setStatus(demoLabels.closed)}
        />
      </div>
    </div>
  )
}

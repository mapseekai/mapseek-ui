import {
  type AttrFieldMeta,
  AttrInspector,
  type AttrInspectorFeature,
  type AttrInspectorLabels,
  type AttrInspectorMode,
} from "@registry/blocks/attr-inspector"
import { useState } from "react"

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

export type AttrInspectorDemoLabels = {
  readonly read: string
  readonly edit: string
  readonly intro: string
  readonly changed: string
  readonly confirmed: string
  readonly cancelled: string
  readonly deleted: string
  readonly closed: string
  readonly geojson: string
  readonly added: string
  readonly inspector: AttrInspectorLabels
}

export const zhAttrInspectorLabels = {
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
} satisfies AttrInspectorDemoLabels

export const enAttrInspectorLabels = {
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
} satisfies AttrInspectorDemoLabels

export function AttrInspectorDemo({ labels }: { readonly labels: AttrInspectorDemoLabels }) {
  const [mode, setMode] = useState<AttrInspectorMode>("edit")
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [status, setStatus] = useState(labels.changed)

  return (
    <div data-demo="attr-inspector" className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["read", "edit"] as const).map((item) => (
          <button
            key={item}
            type="button"
            data-demo-action={`mode-${item}`}
            className={[
              "border border-border px-3 py-1 font-mono text-xs",
              mode === item
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted",
            ].join(" ")}
            onClick={() => setMode(item)}
          >
            {item === "read" ? labels.read : labels.edit}
          </button>
        ))}
        <span data-demo-status="attr-inspector" className="font-mono text-xs text-muted-foreground">
          {status}
        </span>
      </div>
      <p className="m-0 text-xs text-muted-foreground">{labels.intro}</p>
      <div className="relative h-[520px] overflow-hidden border border-border bg-muted/20">
        <AttrInspector
          className="absolute top-4 right-4 w-[340px] max-w-[calc(100%-2rem)] shadow-[var(--shadow-map-float)]"
          feature={feature}
          mode={mode}
          fields={fields}
          draft={draft}
          labels={labels.inspector}
          onFieldChange={(key, value) => {
            setDraft((current) => ({ ...current, [key]: value }))
            setStatus(`${labels.changed}: ${key}`)
          }}
          onAddField={() => setStatus(labels.added)}
          onViewGeoJSON={() => setStatus(labels.geojson)}
          onDelete={() => setStatus(labels.deleted)}
          onConfirm={() => {
            setDraft({})
            setStatus(labels.confirmed)
          }}
          onCancel={() => {
            setDraft({})
            setStatus(labels.cancelled)
          }}
          onClose={() => setStatus(labels.closed)}
        />
      </div>
    </div>
  )
}

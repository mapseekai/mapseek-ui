import { GeoJSONView, stringifyGeoJSON } from "@registry/blocks/geojson-view"
import { Checkbox } from "@registry/ui/checkbox"
import { Label } from "@registry/ui/label"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const sample = {
  type: "Feature",
  properties: { fid: 1024, use: "Residential R2", code: "R2", area_m2: 48210 },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [114.05, 22.54],
        [114.06, 22.54],
        [114.06, 22.55],
        [114.05, 22.55],
        [114.05, 22.54],
      ],
    ],
  },
}

const labels = {
  "zh-CN": {
    intro: "只读 GeoJSON 树。空值、解析失败和不支持的 primitive 会显示明确状态。",
    emptyToggle: "模拟无选中",
    invalidToggle: "模拟解析失败",
    primitiveToggle: "模拟 primitive 值",
    empty: "无选中要素",
    title: "GeoJSON",
    viewer: {
      expandAll: "全部展开",
      collapseAll: "全部收起",
      copy: "复制 GeoJSON",
      copied: "已复制 GeoJSON",
      item: "项",
      items: "项",
      parseError: "GeoJSON 解析失败",
      unsupportedValue: "GeoJSON 必须是对象或数组",
    },
  },
  en: {
    intro: "Read-only GeoJSON tree with explicit empty, parse-error, and primitive-value states.",
    emptyToggle: "Simulate no selection",
    invalidToggle: "Simulate parse failure",
    primitiveToggle: "Simulate primitive value",
    empty: "No selected feature",
    title: "GeoJSON",
    viewer: {
      expandAll: "Expand all",
      collapseAll: "Collapse all",
      copy: "Copy GeoJSON",
      copied: "Copied GeoJSON",
      item: "item",
      items: "items",
      parseError: "GeoJSON could not be parsed",
      unsupportedValue: "GeoJSON must be an object or array",
    },
  },
}

export function GeoJSONViewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [empty, setEmpty] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [primitive, setPrimitive] = useState(false)
  const json = empty
    ? null
    : invalid
      ? "{ invalid geojson"
      : primitive
        ? '"point"'
        : stringifyGeoJSON(sample)

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="m-0 text-xs text-muted-foreground">{demoLabels.intro}</p>
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Checkbox id="docs-geojson-view-empty" checked={empty} onCheckedChange={setEmpty} />
          <Label htmlFor="docs-geojson-view-empty">{demoLabels.emptyToggle}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="docs-geojson-view-invalid"
            checked={invalid}
            onCheckedChange={(checked) => {
              setInvalid(checked)
              if (checked) setPrimitive(false)
            }}
            disabled={empty}
          />
          <Label htmlFor="docs-geojson-view-invalid">{demoLabels.invalidToggle}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="docs-geojson-view-primitive"
            checked={primitive}
            onCheckedChange={(checked) => {
              setPrimitive(checked)
              if (checked) setInvalid(false)
            }}
            disabled={empty}
          />
          <Label htmlFor="docs-geojson-view-primitive">{demoLabels.primitiveToggle}</Label>
        </div>
      </div>
      <div className="h-[360px] min-w-0">
        <GeoJSONView
          json={json}
          emptyLabel={demoLabels.empty}
          title={demoLabels.title}
          labels={demoLabels.viewer}
        />
      </div>
    </div>
  )
}

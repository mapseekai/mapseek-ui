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
    intro: "只读 GeoJSON 树。空值和解析失败会回退到带行号的 pre 视图。",
    emptyToggle: "模拟无选中",
    invalidToggle: "模拟解析失败",
    empty: "无选中要素",
    title: "GeoJSON",
  },
  en: {
    intro:
      "Read-only GeoJSON tree. Empty values and parse failures fall back to a line-numbered pre view.",
    emptyToggle: "Simulate no selection",
    invalidToggle: "Simulate parse failure",
    empty: "No selected feature",
    title: "GeoJSON",
  },
}

export function GeoJSONViewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [empty, setEmpty] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const json = empty ? null : invalid ? "{ invalid geojson" : stringifyGeoJSON(sample)

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
            onCheckedChange={setInvalid}
            disabled={empty}
          />
          <Label htmlFor="docs-geojson-view-invalid">{demoLabels.invalidToggle}</Label>
        </div>
      </div>
      <div className="h-[360px] min-w-0">
        <GeoJSONView json={json} emptyLabel={demoLabels.empty} title={demoLabels.title} />
      </div>
    </div>
  )
}

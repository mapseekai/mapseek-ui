import { GeoJSONView, stringifyGeoJSON } from "@registry/blocks/geojson-view"
import { useState } from "react"

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

export type GeoJSONViewDemoLabels = {
  readonly intro: string
  readonly emptyToggle: string
  readonly invalidToggle: string
  readonly empty: string
  readonly title: string
}

export const zhGeoJSONViewLabels = {
  intro: "只读 GeoJSON 树。空值和解析失败会回退到带行号的 pre 视图。",
  emptyToggle: "模拟无选中",
  invalidToggle: "模拟解析失败",
  empty: "无选中要素",
  title: "GeoJSON",
} satisfies GeoJSONViewDemoLabels

export const enGeoJSONViewLabels = {
  intro:
    "Read-only GeoJSON tree. Empty values and parse failures fall back to a line-numbered pre view.",
  emptyToggle: "Simulate no selection",
  invalidToggle: "Simulate parse failure",
  empty: "No selected feature",
  title: "GeoJSON",
} satisfies GeoJSONViewDemoLabels

export function GeoJSONViewDemo({ labels }: { readonly labels: GeoJSONViewDemoLabels }) {
  const [empty, setEmpty] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const json = empty ? null : invalid ? "{ invalid geojson" : stringifyGeoJSON(sample)

  return (
    <div data-demo="geojson-view" className="flex w-full flex-col gap-4">
      <p className="m-0 text-xs text-muted-foreground">{labels.intro}</p>
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={empty}
            onChange={(event) => setEmpty(event.target.checked)}
          />
          {labels.emptyToggle}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={invalid}
            onChange={(event) => setInvalid(event.target.checked)}
            disabled={empty}
          />
          {labels.invalidToggle}
        </label>
      </div>
      <div className="h-[360px] min-w-0">
        <GeoJSONView json={json} emptyLabel={labels.empty} title={labels.title} />
      </div>
    </div>
  )
}

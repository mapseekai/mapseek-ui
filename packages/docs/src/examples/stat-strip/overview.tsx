import { type StatItem, StatStrip } from "@registry/blocks/stat-strip"
import { Badge } from "@registry/ui/badge"
import { Button } from "@registry/ui/button"
import { IconBox, IconDatabase, IconMap2 } from "@tabler/icons-react"
import { useState } from "react"

export type StatStripDemoLabels = {
  readonly toggle: string
  readonly dataset: string
  readonly raster: string
  readonly features: string
  readonly geometry: string
  readonly fields: string
  readonly crs: string
  readonly size: string
  readonly bands: string
  readonly resolution: string
  readonly status: string
  readonly ready: string
}

function createStats(labels: StatStripDemoLabels): {
  datasetStats: StatItem[]
  rasterStats: StatItem[]
} {
  return {
    datasetStats: [
      {
        label: labels.features,
        value: "385",
        mono: true,
        icon: <IconDatabase size={16} stroke={1.5} />,
      },
      { label: labels.geometry, value: "MultiPolygon" },
      { label: labels.fields, value: "12", mono: true },
      { label: labels.crs, value: "EPSG:4326", mono: true },
    ],
    rasterStats: [
      {
        label: labels.size,
        value: "10,980 x 10,980",
        unit: "px",
        mono: true,
        icon: <IconBox size={16} stroke={1.5} className="text-warning" />,
      },
      { label: labels.bands, value: "4", unit: "UInt16", mono: true },
      { label: labels.resolution, value: "10", unit: "m / px", mono: true },
      {
        label: labels.status,
        value: labels.ready,
        badge: <Badge variant="outline">API</Badge>,
        icon: <IconMap2 size={16} stroke={1.5} className="text-primary" />,
      },
    ],
  }
}

export const zhStatStripLabels = {
  toggle: "切换统计",
  dataset: "数据集统计",
  raster: "栅格统计",
  features: "要素",
  geometry: "几何类型",
  fields: "字段",
  crs: "坐标系",
  size: "尺寸",
  bands: "波段",
  resolution: "分辨率",
  status: "状态",
  ready: "就绪",
} satisfies StatStripDemoLabels

export const enStatStripLabels = {
  toggle: "Toggle stats",
  dataset: "Dataset stats",
  raster: "Raster stats",
  features: "Features",
  geometry: "Geometry",
  fields: "Fields",
  crs: "CRS",
  size: "Size",
  bands: "Bands",
  resolution: "Resolution",
  status: "Status",
  ready: "ready",
} satisfies StatStripDemoLabels

export function StatStripDemo({ labels }: { readonly labels: StatStripDemoLabels }) {
  const [raster, setRaster] = useState(false)
  const { datasetStats, rasterStats } = createStats(labels)
  const items = raster ? rasterStats : datasetStats

  return (
    <div data-demo="stat-strip" className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="stat-strip-toggle"
          onClick={() => setRaster((current) => !current)}
        >
          {labels.toggle}
        </Button>
        <span data-demo-status="stat-strip" className="font-mono text-xs text-muted-foreground">
          {raster ? labels.raster : labels.dataset}
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <StatStrip items={items} />
        </div>
      </div>
    </div>
  )
}

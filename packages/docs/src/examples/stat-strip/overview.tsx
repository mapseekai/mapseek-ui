import { type StatItem, StatStrip } from "@registry/blocks/stat-strip"
import { Badge } from "@registry/ui/badge"
import { Button } from "@registry/ui/button"
import { IconBox, IconDatabase, IconMap2 } from "@tabler/icons-react"
import { useState } from "react"

const datasetStats: StatItem[] = [
  { label: "Features", value: "385", mono: true, icon: <IconDatabase size={16} stroke={1.5} /> },
  { label: "Geometry", value: "MultiPolygon" },
  { label: "Fields", value: "12", mono: true },
  { label: "CRS", value: "EPSG:4326", mono: true },
]

const rasterStats: StatItem[] = [
  {
    label: "Size",
    value: "10,980 x 10,980",
    unit: "px",
    mono: true,
    icon: <IconBox size={16} stroke={1.5} className="text-warning" />,
  },
  { label: "Bands", value: "4", unit: "UInt16", mono: true },
  { label: "Resolution", value: "10", unit: "m / px", mono: true },
  {
    label: "Status",
    value: "ready",
    badge: <Badge variant="outline">API</Badge>,
    icon: <IconMap2 size={16} stroke={1.5} className="text-primary" />,
  },
]

export const zhStatStripLabels = {
  toggle: "切换统计",
  dataset: "数据集统计",
  raster: "栅格统计",
}

export const enStatStripLabels = {
  toggle: "Toggle stats",
  dataset: "Dataset stats",
  raster: "Raster stats",
}

export function StatStripDemo({ labels }: { readonly labels: typeof zhStatStripLabels }) {
  const [raster, setRaster] = useState(false)
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

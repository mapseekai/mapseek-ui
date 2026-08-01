import { BandStat, type BandStatData, type BandStatLabels } from "@registry/blocks/band-stat"
import { Button } from "@registry/ui/button"
import { useState } from "react"

function peakedHistogram(center: number, scale: number): number[] {
  return Array.from({ length: 64 }, (_, index) =>
    Math.round(scale * Math.exp(-((index - center) ** 2) / 40) + index * 3),
  )
}

const bands: BandStatData[] = [
  {
    band: "B1",
    name: "Coastal aerosol",
    type: "UINT16",
    min: 0,
    max: 16382,
    mean: 1182,
    stddev: 432,
    histogram: peakedHistogram(12, 1000),
  },
  {
    band: "B4",
    name: "Near infrared",
    type: "UINT16",
    min: 0,
    max: 16382,
    mean: 3214,
    stddev: 1124,
    histogram: peakedHistogram(28, 1400),
  },
]

export type BandStatDemoLabels = BandStatLabels & {
  readonly nextBand: string
  readonly currentBand: string
}

export const zhBandStatLabels = {
  min: "最小值 min",
  max: "最大值 max",
  mean: "均值 mean",
  stddev: "标准差 σ",
  histogram: "直方图",
  histogramMeta: "64 BINS · 全图采样",
  histogramYAxis: "像元数量",
  histogramXAxis: "像元值区间",
  histogramCount: "数量",
  nextBand: "切换波段",
  currentBand: "当前波段",
} satisfies BandStatDemoLabels

export const enBandStatLabels = {
  min: "Minimum",
  max: "Maximum",
  mean: "Mean",
  stddev: "Std. dev.",
  histogram: "Histogram",
  histogramMeta: "64 BINS · full raster sample",
  histogramYAxis: "Pixel count",
  histogramXAxis: "Pixel value range",
  histogramCount: "Count",
  nextBand: "Switch band",
  currentBand: "Current band",
} satisfies BandStatDemoLabels

export function BandStatDemo({ labels }: { readonly labels: BandStatDemoLabels }) {
  const [index, setIndex] = useState(0)
  const band = bands[index]

  return (
    <div data-demo="band-stat" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="band-stat-next"
          onClick={() => setIndex((current) => (current + 1) % bands.length)}
        >
          {labels.nextBand}
        </Button>
        <span data-demo-status="band-stat" className="font-mono text-xs text-muted-foreground">
          {labels.currentBand}: {band.band}
        </span>
      </div>
      <BandStat data={band} labels={labels} />
    </div>
  )
}

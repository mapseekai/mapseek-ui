export type BandStatData = {
  band: string // "B1"
  name: string // "波段 1"
  type: string // "UINT16"
  min: number
  max: number
  mean: number
  stddev: number
  histogram: number[] // 64 bins
}

export type BandStatLabels = {
  min: string
  max: string
  mean: string
  stddev: string
  histogram: string
  histogramMeta: string // "64 BINS · 全图采样"
  histogramYAxis: string // "像元数量"
  histogramXAxis: string // "像元值区间"
  histogramCount: string // "数量"
}

export type BandStatProps = { data: BandStatData; labels: BandStatLabels }

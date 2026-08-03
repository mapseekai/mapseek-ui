export type BandStatData = {
  band: string // "B1"
  name: string // "Band 1"
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
  histogramMeta: string // "64 BINS · full raster sample"
  histogramYAxis: string // "Pixel count"
  histogramXAxis: string // "Pixel value range"
  histogramCount: string // "Count"
}

export type BandStatProps = { data: BandStatData; labels: BandStatLabels }

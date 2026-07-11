export type ColormapName =
  | "viridis"
  | "magma"
  | "inferno"
  | "plasma"
  | "cividis"
  | "turbo"
  | "greys"
  | "custom"

export type StretchMode = "custom" | "minmax" | "percent" | "stddev"

export type Resampling = "nearest" | "bilinear" | "cubic" | "cubic-spline" | "lanczos" | "average"

export type TileSize = 64 | 128 | 256 | 512 | 1024

export type RasterFormatValue = "png" | "webp" | "jpeg"

export type MosaicPixelSelection = "first" | "highest" | "lowest" | "mean" | "median"

export type NoDataKind = "nan" | "inf" | "-inf" | "custom"

export interface RasterBand {
  /** 1-indexed band number (TiTiler `bidx`). */
  idx: number
  /** Optional dtype/label shown next to the chip (e.g. "Float32"). */
  label?: string
  /** R/G/B channel assignment for multi-band composites. */
  channel?: "R" | "G" | "B"
}

export interface RasterStretch {
  mode: StretchMode
  /** Single-band custom rescale [min, max]. */
  rescale?: [number, number]
  /** Multi-band custom rescale, one [min, max] per band (bidx order). */
  rescaleBands?: [number, number][]
  /** Percentile clip [low, high]. */
  percent?: [number, number]
  /** Standard-deviation multiplier. */
  sigma?: number
}

export interface RasterNoData {
  kind: NoDataKind
  /** Used when kind === "custom". */
  custom?: number
}

export interface RasterStyleValue {
  bands: RasterBand[]
  /** Multi-band (RGB) composite: disables colormap, enables color_formula. */
  multiband: boolean
  colormap: ColormapName
  stretch: RasterStretch
  nodata: RasterNoData
  resampling: Resampling
  tileSize: TileSize
  /** Output tile encoding. JPEG is lossy with no alpha (nodata renders black). */
  format: RasterFormatValue
  /** Rio-Color post-processing formula (multi-band only). */
  colorFormula?: string
}

/** A read-only stat cell in the band/size readout above the form. */
export interface RasterStat {
  label: string
  value: string
  unit?: string
}

export interface RasterStyleLabels {
  band: string
  renderMode?: string
  renderSingle?: string
  renderRgb?: string
  /** Kept for older callers; fixed band choices are now generated from `bandCount`. */
  bandAppend: string
  colormap: string
  customColormap: string
  stretch: string
  stretchModes: Record<StretchMode, string>
  minmaxHint: string
  percentHint: string
  sigmaHint: string
  sigmaSuffix: string
  auto: string
  nodata: string
  nodataDescriptions?: Partial<Record<NoDataKind, string>>
  nodataRecommendations?: number[]
  resampling: string
  resamplingModes: Record<Resampling, string>
  tileSize: string
  format: string
  formatModes: Record<RasterFormatValue, string>
  /** Help text shown for the JPEG option (no alpha). */
  formatJpegNote?: string
  colorFormula: string
  colorFormulaPlaceholder: string
  /** Note shown where colormap would be, in multi-band mode. */
  multibandNote: string
  mosaicSelection?: string
  mosaicSelectionModes?: Record<MosaicPixelSelection, string>
  /** Optional per-control help text (rendered as a help tooltip). */
  help?: Partial<
    Record<"band" | "colormap" | "stretch" | "nodata" | "resampling" | "colorFormula", string>
  >
}

export interface RasterStylePanelProps {
  value: RasterStyleValue
  onChange: (next: RasterStyleValue) => void
  /** Total bands available in the raster. Enables single-band/RGB choices. */
  bandCount?: number
  /** Band/size/min/max readout shown above the form. Omit to hide. */
  stats?: RasterStat[]
  labels: RasterStyleLabels
  /** Pre-fill target for the custom-stretch "Auto" button. */
  autoRange?: [number, number]
  mosaic?: {
    pixelSelection: MosaicPixelSelection
    onPixelSelectionChange: (next: MosaicPixelSelection) => void
  }
  className?: string
}

// ── Custom colormap editor ───────────────────────────────────────────────

export type ColormapInterpolation = "linear" | "step" | "smooth"
export type ColormapColorSpace = "oklch" | "srgb" | "hsl"

export interface CustomColormap {
  /** Ordered color stops (any CSS color; native picker emits hex). */
  stops: string[]
  interpolation: ColormapInterpolation
  colorSpace: ColormapColorSpace
}

export interface ColormapPreset {
  id: string
  name: string
  stops: string[]
}

export interface CustomColormapLabels {
  stops: string
  /** Suffix after the stop count, e.g. "stops". */
  stopsUnit: string
  addStop: string
  removeStop: string
  interpolation: string
  interpolationModes: Record<ColormapInterpolation, string>
  colorSpace: string
  colorSpaceHint: string
  colorSpaceModes: Record<ColormapColorSpace, string>
  importPreset: string
  importHint: string
}

export interface CustomColormapEditorProps {
  value: CustomColormap
  onChange: (next: CustomColormap) => void
  /** Preset gradients shown under "import"; defaults to DEFAULT_COLORMAP_PRESETS. */
  presets?: ColormapPreset[]
  labels: CustomColormapLabels
  /** Minimum stops kept (remove disabled at this count). Default 2. */
  minStops?: number
  className?: string
}

export const DEFAULT_CUSTOM_COLORMAP: CustomColormap = {
  stops: ["#2a6fdb", "#f6f4ef", "#d97757"],
  interpolation: "linear",
  colorSpace: "oklch",
}

export const DEFAULT_RASTER_STYLE: RasterStyleValue = {
  bands: [{ idx: 1 }],
  multiband: false,
  colormap: "viridis",
  stretch: { mode: "stddev", sigma: 2.0 },
  nodata: { kind: "nan" },
  resampling: "nearest",
  tileSize: 256,
  format: "webp",
}

export type ColormapName =
  | "viridis"
  | "magma"
  | "inferno"
  | "plasma"
  | "turbo"
  | "terrain"
  | "greys"
  | "custom"

export type StretchMode = "custom" | "minmax" | "percent" | "stddev"

export type Resampling =
  | "nearest"
  | "bilinear"
  | "cubic"
  | "cubicspline"
  | "lanczos"
  | "average"
  | "mode"

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
  /** Custom output ranges, one [min, max] per selected output. */
  ranges?: [number, number][]
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

export type RasterBandAssignments = Partial<
  Record<"red" | "green" | "blue" | "nir" | "swir", number>
>

export type RasterSelector =
  | { kind: "bands"; bands: number[]; assignments: RasterBandAssignments }
  | {
      kind: "index"
      index: "ndvi" | "ndwi" | "ndbi" | "evi" | "savi"
      assignments: RasterBandAssignments
    }

export type RasterCanonicalColormap =
  | { kind: "none" }
  | { kind: "named"; name: Exclude<ColormapName, "custom"> }
  | {
      kind: "custom"
      value: {
        entries: Array<{ value: number; color: string }>
        nodataColor?: string
      }
    }

export interface RasterStyleValue {
  mode: "SINGLE" | "MOSAIC"
  selector: RasterSelector
  colormap: RasterCanonicalColormap
  stretch?: RasterStretch
  nodata?: RasterNoData
  resampling: Resampling
  tileSize: TileSize
  /** Output tile encoding. JPEG is lossy with no alpha (nodata renders black). */
  format: RasterFormatValue
  /** Rio-Color post-processing formula (multi-band only). */
  colorFormula?: string
  unscale?: boolean
  mosaicPixelSelection?: MosaicPixelSelection
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
  onValidityChange?: (valid: boolean) => void
  /** Changes when authoritative profile data is replaced, even if scalar values are equal. */
  resetKey?: string | number
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

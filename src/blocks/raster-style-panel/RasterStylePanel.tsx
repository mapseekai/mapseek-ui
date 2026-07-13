import { useEffect, useState } from "react"
import { Input } from "../../components/input"
import { Select } from "../../components/select"
import { cn } from "../../lib/utils"
import { ColormapPicker } from "./ColormapPicker"
import { Segmented } from "./Segmented"
import { StretchControl } from "./StretchControl"
import type {
  MosaicPixelSelection,
  RasterBandAssignments,
  RasterFormatValue,
  RasterStat,
  RasterStylePanelProps,
  Resampling,
  TileSize,
} from "./types"

const RESAMPLINGS: Resampling[] = [
  "nearest",
  "bilinear",
  "cubic",
  "cubicspline",
  "lanczos",
  "average",
  "mode",
]
const TILE_SIZES: TileSize[] = [64, 128, 256, 512, 1024]
const FORMATS: RasterFormatValue[] = ["png", "webp", "jpeg"]
const MOSAIC_SELECTIONS: MosaicPixelSelection[] = ["first", "highest", "lowest", "mean", "median"]
const INDEXES = ["ndvi", "ndwi", "ndbi", "evi", "savi"] as const
const CHANNELS = ["red", "green", "blue"] as const
const INDEX_INPUTS: Record<(typeof INDEXES)[number], Array<keyof RasterBandAssignments>> = {
  ndvi: ["red", "nir"],
  ndwi: ["green", "nir"],
  ndbi: ["nir", "swir"],
  evi: ["red", "blue", "nir"],
  savi: ["red", "nir"],
}
const labelCls =
  "self-center font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground"

function StatGrid({ stats }: { stats: RasterStat[] }) {
  return (
    <div className="mb-2 grid grid-cols-2 gap-1.5 border border-border bg-muted p-2">
      {stats.map((s) => (
        <div key={s.label}>
          <div className="font-mono text-[9px] text-muted-foreground">{s.label}</div>
          <div className="font-mono text-xs">
            {s.value}
            {s.unit}
          </div>
        </div>
      ))}
    </div>
  )
}

function DraftNumber({
  value,
  label,
  onValid,
  onValidityChange,
}: {
  value: string
  label: string
  onValid: (value: number | "nan" | "inf" | "-inf") => void
  onValidityChange?: (valid: boolean) => void
}) {
  const [raw, setRaw] = useState(value)
  useEffect(() => setRaw(value), [value])
  return (
    <Input
      type="text"
      aria-label={label}
      value={raw}
      onChange={(event) => {
        const next = event.target.value
        setRaw(next)
        const trimmed = next.trim()
        const valid =
          ["nan", "inf", "-inf"].includes(trimmed) ||
          (trimmed !== "" && Number.isFinite(Number(trimmed)))
        onValidityChange?.(valid)
        if (["nan", "inf", "-inf"].includes(trimmed)) onValid(trimmed as "nan" | "inf" | "-inf")
        else if (trimmed !== "" && Number.isFinite(Number(trimmed))) onValid(Number(trimmed))
      }}
    />
  )
}

export function RasterStylePanel({
  value,
  onChange,
  bandCount = 1,
  stats,
  labels,
  autoRange,
  mosaic,
  className,
  onValidityChange,
}: RasterStylePanelProps) {
  const set = (patch: Partial<typeof value>) => onChange({ ...value, ...patch })
  const bandOptions = Array.from({ length: Math.max(1, bandCount) }, (_, i) => i + 1)
  const assignments = value.selector.assignments
  const stretchValue = value.rescale
    ? value.rescale.length > 1
      ? { mode: "custom" as const, rescaleBands: value.rescale }
      : { mode: "custom" as const, rescale: value.rescale[0] }
    : (value.stretch ?? { mode: "minmax" as const })
  const isRgb =
    value.selector.kind === "bands" && CHANNELS.every((key) => assignments[key] !== undefined)
  const selectorMode = value.selector.kind === "index" ? "index" : isRgb ? "rgb" : "single"
  const selectBand = (label: string, selected: number, update: (band: number) => void) => (
    <Select
      aria-label={label}
      value={String(selected)}
      onValueChange={(raw) => update(Number(raw))}
      className="h-[26px] rounded-none px-2 font-mono text-[11px]"
    >
      {bandOptions.map((band) => (
        <Select.Item key={band} value={String(band)}>
          {labels.band} {band}
        </Select.Item>
      ))}
    </Select>
  )
  const setSelectorMode = (mode: "single" | "rgb" | "index") => {
    if (mode === "index")
      return set({
        selector: {
          kind: "index",
          index: "ndvi",
          assignments: { red: 1, nir: Math.min(2, bandCount) },
        },
      })
    if (mode === "rgb")
      return set({
        selector: {
          kind: "bands",
          bands: [1, Math.min(2, bandCount), Math.min(3, bandCount)],
          assignments: { red: 1, green: Math.min(2, bandCount), blue: Math.min(3, bandCount) },
        },
      })
    set({
      selector: {
        kind: "bands",
        bands: [value.selector.kind === "bands" ? value.selector.bands[0] : 1],
        assignments: {},
      },
    })
  }
  return (
    <div className={cn("flex flex-col", className)}>
      {stats?.length ? <StatGrid stats={stats} /> : null}
      <div className="grid grid-cols-[56px_1fr] gap-x-3 gap-y-2.5">
        {mosaic ? (
          <>
            <label className={labelCls}>{labels.mosaicSelection}</label>
            <Segmented
              options={MOSAIC_SELECTIONS.map((x) => ({
                value: x,
                label: labels.mosaicSelectionModes?.[x] ?? x,
              }))}
              value={mosaic.pixelSelection}
              onChange={mosaic.onPixelSelectionChange}
            />
          </>
        ) : null}
        <label className={labelCls}>{labels.renderMode ?? "Render"}</label>
        <Segmented
          options={[
            { value: "single" as const, label: labels.renderSingle ?? "Single" },
            { value: "rgb" as const, label: labels.renderRgb ?? "RGB" },
            { value: "index" as const, label: "Index" },
          ]}
          value={selectorMode}
          onChange={setSelectorMode}
        />
        <label className={labelCls}>{labels.band}</label>
        {value.selector.kind === "index" ? (
          <div className="flex flex-col gap-1.5">
            <Segmented
              options={INDEXES.map((index) => ({ value: index, label: index.toUpperCase() }))}
              value={value.selector.index}
              onChange={(index) =>
                set({ selector: { kind: "index", index, assignments: value.selector.assignments } })
              }
            />
            {INDEX_INPUTS[value.selector.index].map((key) => (
              <div key={key} className="grid grid-cols-[40px_1fr] items-center gap-1">
                <span className="font-mono text-[10px] uppercase">{key}</span>
                {selectBand(`${key} ${labels.band}`, assignments[key] ?? 1, (band) =>
                  set({
                    selector: { ...value.selector, assignments: { ...assignments, [key]: band } },
                  }),
                )}
              </div>
            ))}
          </div>
        ) : isRgb ? (
          <div className="flex flex-col gap-1.5">
            {CHANNELS.map((key) => (
              <div key={key} className="grid grid-cols-[40px_1fr] items-center gap-1">
                <span className="font-mono text-[10px] uppercase">{key}</span>
                {selectBand(
                  `${({ red: "R", green: "G", blue: "B" } as const)[key]} ${labels.band}`,
                  assignments[key]!,
                  (band) => {
                    const next = { ...assignments, [key]: band }
                    set({
                      selector: {
                        kind: "bands",
                        bands: CHANNELS.map((channel) => next[channel]!),
                        assignments: next,
                      },
                    })
                  },
                )}
              </div>
            ))}
          </div>
        ) : (
          selectBand(labels.band, value.selector.bands[0] ?? 1, (band) =>
            set({ selector: { kind: "bands", bands: [band], assignments: {} } }),
          )
        )}
        <label className={labelCls}>{labels.colormap}</label>
        <ColormapPicker
          value={value.colormap.kind === "named" ? value.colormap.name : "custom"}
          onChange={(name) =>
            name === "custom" ? undefined : set({ colormap: { kind: "named", name } })
          }
          customLabel={labels.customColormap}
        />
        <label className={labelCls}>{labels.stretch}</label>
        <StretchControl
          value={stretchValue}
          onChange={(stretch) => {
            if (stretch.mode === "custom") {
              const rescale =
                stretch.rescaleBands ?? (stretch.rescale ? [stretch.rescale] : undefined)
              if (rescale) set({ rescale })
            } else {
              onChange({ ...value, stretch, rescale: undefined })
            }
          }}
          bands={
            value.selector.kind === "bands" && value.selector.bands.length > 1
              ? value.selector.bands.map((idx) => ({ idx }))
              : undefined
          }
          autoRange={autoRange}
          labels={{
            modes: labels.stretchModes,
            minmaxHint: labels.minmaxHint,
            percentHint: labels.percentHint,
            sigmaHint: labels.sigmaHint,
            sigmaSuffix: labels.sigmaSuffix,
            auto: labels.auto,
          }}
          onValidityChange={onValidityChange}
        />
        <label className={labelCls}>{labels.nodata}</label>
        <DraftNumber
          label="Custom NoData"
          value={
            value.nodata?.kind === "custom"
              ? String(value.nodata.custom)
              : (value.nodata?.kind ?? "")
          }
          onValid={(next) =>
            set({
              nodata: typeof next === "number" ? { kind: "custom", custom: next } : { kind: next },
            })
          }
          onValidityChange={onValidityChange}
        />
        <label className={labelCls}>{labels.resampling}</label>
        <Segmented
          columns={3}
          options={RESAMPLINGS.map((x) => ({ value: x, label: labels.resamplingModes[x] }))}
          value={value.resampling}
          onChange={(resampling) => set({ resampling })}
        />
        <label className={labelCls}>{labels.format}</label>
        <Segmented
          options={FORMATS.map((x) => ({ value: x, label: labels.formatModes[x] }))}
          value={value.format}
          onChange={(format) => set({ format })}
        />
        <label className={labelCls}>{labels.tileSize}</label>
        <Segmented
          options={TILE_SIZES.map((x) => ({ value: String(x), label: x }))}
          value={String(value.tileSize)}
          onChange={(x) => set({ tileSize: Number(x) as TileSize })}
        />
        <label className={labelCls}>{labels.colorFormula}</label>
        <Input
          value={value.colorFormula ?? ""}
          onChange={(e) => set({ colorFormula: e.target.value })}
        />
      </div>
    </div>
  )
}

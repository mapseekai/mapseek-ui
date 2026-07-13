import { useCallback, useEffect, useRef, useState } from "react"
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
  RasterSelector,
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
const CHANNEL_LABEL = { red: "R", green: "G", blue: "B" } as const
const INDEX_INPUTS: Record<(typeof INDEXES)[number], Array<keyof RasterBandAssignments>> = {
  ndvi: ["red", "nir"],
  ndwi: ["green", "nir"],
  ndbi: ["nir", "swir"],
  evi: ["red", "blue", "nir"],
  savi: ["red", "nir"],
}
const labelCls =
  "self-center font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
const colorPattern = /^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i

type DraftReporter = (key: string, valid: boolean | null) => void

function DraftInput({
  id,
  label,
  value,
  resetKey,
  report,
  validate,
  onValid,
}: {
  id: string
  label: string
  value: string
  resetKey: string | number | undefined
  report: DraftReporter
  validate: (raw: string) => boolean
  onValid: (raw: string) => void
}) {
  const [raw, setRaw] = useState(value)
  useEffect(() => {
    setRaw(value)
    report(id, validate(value))
    return () => report(id, null)
  }, [id, resetKey])
  return (
    <Input
      aria-label={label}
      value={raw}
      onChange={(event) => {
        const next = event.target.value
        setRaw(next)
        const valid = validate(next)
        report(id, valid)
        if (valid) onValid(next)
      }}
    />
  )
}

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

function selectorComplete(selector: RasterSelector) {
  if (selector.kind === "bands")
    return (
      selector.bands.length > 0 &&
      selector.bands.every((band) => Number.isInteger(band) && band > 0)
    )
  return INDEX_INPUTS[selector.index].every(
    (key) => Number.isInteger(selector.assignments[key]) && selector.assignments[key]! > 0,
  )
}

export function RasterStylePanel({
  value,
  onChange,
  onValidityChange,
  resetKey,
  bandCount = 1,
  stats,
  labels,
  autoRange,
  mosaic,
  className,
}: RasterStylePanelProps) {
  const drafts = useRef(new Map<string, boolean>())
  const [, refresh] = useState(0)
  const report = useCallback<DraftReporter>(
    (key, valid) => {
      if (valid === null) drafts.current.delete(key)
      else drafts.current.set(key, valid)
      const all = [...drafts.current.values()].every(Boolean)
      onValidityChange?.(all)
      refresh((x) => x + 1)
    },
    [onValidityChange],
  )
  const [selector, setSelector] = useState(value.selector)
  useEffect(() => {
    setSelector(value.selector)
    report("selector", selectorComplete(value.selector))
  }, [resetKey])
  const assignments = selector.assignments
  const isRgb = selector.kind === "bands" && CHANNELS.every((key) => assignments[key] !== undefined)
  const selectorMode = selector.kind === "index" ? "index" : isRgb ? "rgb" : "single"
  const bands = Array.from({ length: Math.max(1, bandCount) }, (_, i) => i + 1)
  const updateSelector = (next: RasterSelector) => {
    setSelector(next)
    const valid = selectorComplete(next)
    report("selector", valid)
    if (valid) onChange({ ...value, selector: next })
  }
  const selectBand = (
    label: string,
    selected: number | undefined,
    onSelect: (band: number) => void,
  ) => (
    <Select
      aria-label={label}
      value={selected ? String(selected) : ""}
      onValueChange={(raw) => onSelect(Number(raw))}
    >
      {bands.map((band) => (
        <Select.Item key={band} value={String(band)}>
          {labels.band} {band}
        </Select.Item>
      ))}
    </Select>
  )
  const switchSelector = (mode: "single" | "rgb" | "index") => {
    if (mode === "index") return updateSelector({ kind: "index", index: "ndvi", assignments: {} })
    if (mode === "rgb")
      return updateSelector({
        kind: "bands",
        bands: [1, Math.min(2, bandCount), Math.min(3, bandCount)],
        assignments: { red: 1, green: Math.min(2, bandCount), blue: Math.min(3, bandCount) },
      })
    updateSelector({
      kind: "bands",
      bands: [selector.kind === "bands" ? selector.bands[0] : 1],
      assignments: {},
    })
  }
  const setColormap = (colormap: typeof value.colormap) => onChange({ ...value, colormap })
  const custom = value.colormap.kind === "custom" ? value.colormap.value : null
  const numberValid = (raw: string) => raw.trim() !== "" && Number.isFinite(Number(raw))
  const updateEntry = (index: number, patch: Partial<{ value: number; color: string }>) =>
    custom &&
    setColormap({
      kind: "custom",
      value: {
        ...custom,
        entries: custom.entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
      },
    })
  return (
    <div className={cn("flex flex-col", className)}>
      {stats?.length ? <StatGrid stats={stats} /> : null}
      <div className="grid grid-cols-[72px_1fr] gap-x-3 gap-y-2.5">
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
          onChange={switchSelector}
        />
        <label className={labelCls}>{labels.band}</label>
        {selector.kind === "index" ? (
          <div className="flex flex-col gap-1.5">
            <Segmented
              options={INDEXES.map((index) => ({ value: index, label: index.toUpperCase() }))}
              value={selector.index}
              onChange={(index) => updateSelector({ kind: "index", index, assignments: {} })}
            />
            {INDEX_INPUTS[selector.index].map((key) => (
              <div key={key} className="grid grid-cols-[42px_1fr] items-center gap-1">
                <span className="font-mono text-[10px] uppercase">{key}</span>
                {selectBand(`${key} ${labels.band}`, assignments[key], (band) =>
                  updateSelector({ ...selector, assignments: { ...assignments, [key]: band } }),
                )}
              </div>
            ))}
          </div>
        ) : isRgb ? (
          <div className="flex flex-col gap-1.5">
            {CHANNELS.map((key) => (
              <div key={key} className="grid grid-cols-[42px_1fr] items-center gap-1">
                <span className="font-mono text-[10px]">{CHANNEL_LABEL[key]}</span>
                {selectBand(`${CHANNEL_LABEL[key]} ${labels.band}`, assignments[key], (band) => {
                  const next = { ...assignments, [key]: band }
                  updateSelector({
                    kind: "bands",
                    bands: CHANNELS.map((channel) => next[channel]!),
                    assignments: next,
                  })
                })}
              </div>
            ))}
          </div>
        ) : (
          selectBand(labels.band, selector.bands[0], (band) =>
            updateSelector({ kind: "bands", bands: [band], assignments: {} }),
          )
        )}
        <label className={labelCls}>{labels.colormap}</label>
        <div className="flex flex-col gap-2">
          <Segmented
            options={[
              { value: "none" as const, label: "None" },
              { value: "named" as const, label: "Named" },
              { value: "custom" as const, label: "Custom" },
            ]}
            value={value.colormap.kind}
            onChange={(kind) =>
              kind === "none"
                ? setColormap({ kind: "none" })
                : kind === "named"
                  ? setColormap({ kind: "named", name: "viridis" })
                  : setColormap({
                      kind: "custom",
                      value: {
                        entries: [
                          { value: 0, color: "#000000" },
                          { value: 1, color: "#ffffff" },
                        ],
                      },
                    })
            }
          />
          {value.colormap.kind === "named" ? (
            <ColormapPicker
              value={value.colormap.name}
              onChange={(name) => name !== "custom" && setColormap({ kind: "named", name })}
              customLabel={labels.customColormap}
            />
          ) : null}
          {custom ? (
            <div className="flex flex-col gap-1">
              {custom.entries.map((entry, index) => (
                <div key={index} className="grid grid-cols-2 gap-1">
                  <DraftInput
                    id={`cmap-value-${index}`}
                    label={`Colormap stop ${index + 1} value`}
                    value={String(entry.value)}
                    resetKey={resetKey}
                    report={report}
                    validate={numberValid}
                    onValid={(raw) => updateEntry(index, { value: Number(raw) })}
                  />
                  <DraftInput
                    id={`cmap-color-${index}`}
                    label={`Colormap stop ${index + 1} color`}
                    value={entry.color}
                    resetKey={resetKey}
                    report={report}
                    validate={(raw) => colorPattern.test(raw)}
                    onValid={(color) => updateEntry(index, { color })}
                  />
                </div>
              ))}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setColormap({
                      kind: "custom",
                      value: {
                        ...custom,
                        entries: [
                          ...custom.entries,
                          {
                            value: custom.entries[custom.entries.length - 1]?.value ?? 0,
                            color: "#ffffff",
                          },
                        ],
                      },
                    })
                  }
                >
                  Add stop
                </button>
                {custom.entries.length > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setColormap({
                        kind: "custom",
                        value: { ...custom, entries: custom.entries.slice(0, -1) },
                      })
                    }
                  >
                    Remove stop
                  </button>
                ) : null}
              </div>
              <DraftInput
                id="cmap-nodata"
                label="Colormap NoData color"
                value={custom.nodataColor ?? ""}
                resetKey={resetKey}
                report={report}
                validate={(raw) => raw === "" || colorPattern.test(raw)}
                onValid={(color) =>
                  setColormap({
                    kind: "custom",
                    value: {
                      ...custom,
                      ...(color ? { nodataColor: color } : { nodataColor: undefined }),
                    },
                  })
                }
              />
            </div>
          ) : null}
        </div>
        <label className={labelCls}>{labels.stretch}</label>
        <StretchControl
          value={value.stretch ?? { mode: "minmax" }}
          onChange={(stretch) => onChange({ ...value, stretch })}
          autoRange={autoRange}
          labels={{
            modes: labels.stretchModes,
            minmaxHint: labels.minmaxHint,
            percentHint: labels.percentHint,
            sigmaHint: labels.sigmaHint,
            sigmaSuffix: labels.sigmaSuffix,
            auto: labels.auto,
          }}
          resetKey={resetKey}
          reportDraft={report}
          outputCount={selector.kind === "bands" ? selector.bands.length : 1}
        />
        <label className={labelCls}>{labels.nodata}</label>
        <DraftInput
          id="nodata"
          label="Custom NoData"
          value={
            value.nodata?.kind === "custom"
              ? String(value.nodata.custom)
              : (value.nodata?.kind ?? "")
          }
          resetKey={resetKey}
          report={report}
          validate={(raw) =>
            (raw === "" && value.nodata === undefined) ||
            ["nan", "inf", "-inf"].includes(raw) ||
            numberValid(raw)
          }
          onValid={(raw) =>
            onChange({
              ...value,
              nodata:
                raw === ""
                  ? undefined
                  : ["nan", "inf", "-inf"].includes(raw)
                    ? { kind: raw as "nan" | "inf" | "-inf" }
                    : { kind: "custom", custom: Number(raw) },
            })
          }
        />
        <label className={labelCls}>{labels.resampling}</label>
        <Segmented
          columns={3}
          options={RESAMPLINGS.map((x) => ({ value: x, label: labels.resamplingModes[x] }))}
          value={value.resampling}
          onChange={(resampling) => onChange({ ...value, resampling })}
        />
        <label className={labelCls}>{labels.format}</label>
        <Segmented
          options={FORMATS.map((x) => ({ value: x, label: labels.formatModes[x] }))}
          value={value.format}
          onChange={(format) => onChange({ ...value, format })}
        />
        <label className={labelCls}>{labels.tileSize}</label>
        <Segmented
          options={TILE_SIZES.map((x) => ({ value: String(x), label: x }))}
          value={String(value.tileSize)}
          onChange={(raw) => onChange({ ...value, tileSize: Number(raw) as TileSize })}
        />
        <label className={labelCls}>{labels.colorFormula}</label>
        <Input
          aria-label={labels.colorFormula}
          value={value.colorFormula ?? ""}
          onChange={(event) => onChange({ ...value, colorFormula: event.target.value })}
        />
      </div>
    </div>
  )
}

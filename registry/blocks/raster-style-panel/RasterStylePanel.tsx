import { useCallback, useEffect, useId, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { ColormapPicker } from "./ColormapPicker"
import { DEFAULT_RASTER_STYLE_PANEL_LABELS } from "./defaults"
import { Segmented } from "./Segmented"
import { StretchControl } from "./StretchControl"
import type {
  MosaicPixelSelection,
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
const CHANNELS = ["red", "green", "blue"] as const
const CHANNEL_LABEL = { red: "R", green: "G", blue: "B" } as const

function normalizeSelector(selector: RasterSelector): Extract<RasterSelector, { kind: "bands" }> {
  if (selector.kind === "bands") return selector
  const band = selector.assignments.red ?? selector.assignments.nir ?? 1
  return { kind: "bands", bands: [band], assignments: {} }
}

const labelCls =
  "self-center font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
const colorPattern = /^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i

type DraftReporter = (key: string, valid: boolean | null) => void

function useStableIds(count: number, prefix: string) {
  const scope = useId()
  return Array.from({ length: count }, (_, index) => `${scope}-${prefix}-${index}`)
}

function DraftInput({
  id,
  label,
  value,
  report,
  validate,
  onValid,
}: {
  id: string
  label: string
  value: string
  report: DraftReporter
  validate: (raw: string) => boolean
  onValid: (raw: string) => void
}) {
  const [raw, setRaw] = useState(value)
  const reportRef = useRef(report)
  const validateRef = useRef(validate)
  useEffect(() => {
    reportRef.current = report
    validateRef.current = validate
  })
  useEffect(() => {
    setRaw(value)
    reportRef.current(id, validateRef.current(value))
    return () => reportRef.current(id, null)
  }, [id, value])
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
          <div className="font-mono text-[10px] text-muted-foreground">{s.label}</div>
          <div className="font-mono text-xs">
            {s.value}
            {s.unit}
          </div>
        </div>
      ))}
    </div>
  )
}

function selectorComplete(selector: Extract<RasterSelector, { kind: "bands" }>) {
  return (
    selector.bands.length > 0 && selector.bands.every((band) => Number.isInteger(band) && band > 0)
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
  const resolvedLabels = resolveLabels(DEFAULT_RASTER_STYLE_PANEL_LABELS, labels)
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
  const [selector, setSelector] = useState(() => normalizeSelector(value.selector))
  useEffect(() => {
    const next = normalizeSelector(value.selector)
    setSelector(next)
    report("selector", selectorComplete(next))
  }, [report, value.selector])
  const panelValue = value.selector.kind === "index" ? { ...value, selector } : value
  const assignments = selector.assignments
  const isRgb = CHANNELS.every((key) => assignments[key] !== undefined)
  const isSingleBand = !isRgb
  const selectorMode = isRgb ? "rgb" : "single"
  const bands = Array.from({ length: Math.max(1, bandCount) }, (_, i) => i + 1)
  const updateSelector = (next: Extract<RasterSelector, { kind: "bands" }>) => {
    setSelector(next)
    const valid = selectorComplete(next)
    report("selector", valid)
    if (valid) onChange({ ...panelValue, selector: next })
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
  const switchSelector = (mode: "single" | "rgb") => {
    if (mode === "rgb")
      return updateSelector({
        kind: "bands",
        bands: [1, Math.min(2, bandCount), Math.min(3, bandCount)],
        assignments: {
          red: 1,
          green: Math.min(2, bandCount),
          blue: Math.min(3, bandCount),
        },
      })
    updateSelector({
      kind: "bands",
      bands: [selector.bands[0]],
      assignments: {},
    })
  }
  const setColormap = (colormap: typeof value.colormap) => onChange({ ...panelValue, colormap })
  const custom = value.colormap.kind === "custom" ? value.colormap.value : null
  const customEntryIds = useStableIds(custom?.entries.length ?? 0, "custom-entry")
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
      <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-3 gap-y-2.5">
        {mosaic ? (
          <>
            <div className={labelCls}>{labels.mosaicSelection}</div>
            <Segmented
              className="flex-wrap"
              options={MOSAIC_SELECTIONS.map((x) => ({
                value: x,
                label: labels.mosaicSelectionModes?.[x] ?? x,
              }))}
              value={mosaic.pixelSelection}
              onChange={mosaic.onPixelSelectionChange}
            />
          </>
        ) : null}
        <div className={labelCls}>{labels.renderMode ?? "Render"}</div>
        <Segmented
          className="flex-wrap"
          options={[
            {
              value: "single" as const,
              label: labels.renderSingle ?? "Single",
            },
            { value: "rgb" as const, label: labels.renderRgb ?? "RGB" },
          ]}
          value={selectorMode}
          onChange={switchSelector}
          buttonClassName="whitespace-nowrap"
        />
        <div className={labelCls}>{labels.band}</div>
        {isRgb ? (
          <div className="flex flex-col gap-1.5">
            {CHANNELS.map((key) => (
              <div key={key} className="grid grid-cols-[42px_minmax(0,1fr)] items-center gap-1">
                <span className="font-mono text-[10px]">{CHANNEL_LABEL[key]}</span>
                {selectBand(`${CHANNEL_LABEL[key]} ${labels.band}`, assignments[key], (band) => {
                  const next = { ...assignments, [key]: band }
                  const rgbBands = CHANNELS.map((channel) => next[channel]).filter(
                    (value): value is number => value !== undefined,
                  )
                  if (rgbBands.length !== CHANNELS.length) return
                  updateSelector({
                    kind: "bands",
                    bands: rgbBands,
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
        {isSingleBand && (
          <>
            <div className={labelCls}>{labels.colormap}</div>
            <div className="flex flex-col gap-1">
              <Segmented
                className="flex-wrap"
                options={[
                  {
                    value: "none" as const,
                    label: resolvedLabels.colormapNone,
                  },
                  {
                    value: "named" as const,
                    label: resolvedLabels.colormapNamed,
                  },
                  {
                    value: "custom" as const,
                    label: resolvedLabels.colormapCustom,
                  },
                ]}
                value={value.colormap.kind}
                buttonClassName="whitespace-nowrap"
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
                <>
                  {custom.entries.map((entry, index) => (
                    <div key={customEntryIds[index]} className="grid grid-cols-2 gap-1">
                      <DraftInput
                        key={`value-${resetKey ?? "initial"}`}
                        id={`cmap-value-${index}`}
                        label={`Colormap stop ${index + 1} value`}
                        value={String(entry.value)}
                        report={report}
                        validate={numberValid}
                        onValid={(raw) => updateEntry(index, { value: Number(raw) })}
                      />
                      <DraftInput
                        key={`color-${resetKey ?? "initial"}`}
                        id={`cmap-color-${index}`}
                        label={`Colormap stop ${index + 1} color`}
                        value={entry.color}
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
                            value: {
                              ...custom,
                              entries: custom.entries.slice(0, -1),
                            },
                          })
                        }
                      >
                        Remove stop
                      </button>
                    ) : null}
                  </div>
                  <DraftInput
                    key={`nodata-color-${resetKey ?? "initial"}`}
                    id="cmap-nodata"
                    label="Colormap NoData color"
                    value={custom.nodataColor ?? ""}
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
                </>
              ) : null}
            </div>
          </>
        )}
        <div className={labelCls}>{labels.stretch}</div>
        <StretchControl
          value={value.stretch ?? { mode: "minmax" }}
          onChange={(stretch) => onChange({ ...panelValue, stretch })}
          autoRange={autoRange}
          labels={{
            modes: labels.stretchModes,
            percentHint: labels.percentHint,
            sigmaHint: labels.sigmaHint,
            sigmaSuffix: labels.sigmaSuffix,
            auto: labels.auto,
          }}
          resetKey={resetKey}
          reportDraft={report}
          outputCount={selector.bands.length}
        />
        <div className={labelCls}>{labels.nodata}</div>
        <DraftInput
          key={`nodata-${resetKey ?? "initial"}`}
          id="nodata"
          label="Custom NoData"
          value={
            value.nodata?.kind === "custom"
              ? String(value.nodata.custom)
              : (value.nodata?.kind ?? "")
          }
          report={report}
          validate={(raw) =>
            (raw === "" && value.nodata === undefined) ||
            ["nan", "inf", "-inf"].includes(raw) ||
            numberValid(raw)
          }
          onValid={(raw) =>
            onChange({
              ...panelValue,
              nodata:
                raw === ""
                  ? undefined
                  : ["nan", "inf", "-inf"].includes(raw)
                    ? { kind: raw as "nan" | "inf" | "-inf" }
                    : { kind: "custom", custom: Number(raw) },
            })
          }
        />
        <div className={labelCls}>{labels.resampling}</div>
        <Segmented
          columns={3}
          options={RESAMPLINGS.map((x) => ({
            value: x,
            label: labels.resamplingModes[x],
          }))}
          value={value.resampling}
          onChange={(resampling) => onChange({ ...panelValue, resampling })}
          buttonClassName="whitespace-nowrap"
        />
        <div className={labelCls}>{labels.format}</div>
        <Segmented
          options={FORMATS.map((x) => ({
            value: x,
            label: labels.formatModes[x],
          }))}
          value={value.format}
          onChange={(format) => onChange({ ...panelValue, format })}
          buttonClassName="whitespace-nowrap"
        />
        <div className={labelCls}>{labels.tileSize}</div>
        <Segmented
          className="flex-wrap"
          options={TILE_SIZES.map((x) => ({ value: String(x), label: x }))}
          value={String(value.tileSize)}
          onChange={(raw) => onChange({ ...panelValue, tileSize: Number(raw) as TileSize })}
          buttonClassName="whitespace-nowrap"
        />
      </div>
    </div>
  )
}

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonRadioGroup, ButtonRadioGroupItem } from "@/components/ui/button-radio-group"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { ColormapPicker } from "./ColormapPicker"
import { DEFAULT_RASTER_STYLE_PANEL_LABELS } from "./defaults"
import { buildColormapGradient } from "./gradient"
import { NumberDraftInput } from "./NumberDraftInput"
import { isInDataRange, normalizeDataRange } from "./numeric-range"
import { Segmented } from "./Segmented"
import { StretchControl } from "./StretchControl"
import type {
  MosaicPixelSelection,
  RasterCustomColormap,
  RasterFormatValue,
  RasterSelector,
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
const DEFAULT_CHANNEL_LABEL = { red: "R", green: "G", blue: "B" } as const

function normalizeSelector(selector: RasterSelector): Extract<RasterSelector, { kind: "bands" }> {
  if (selector.kind === "bands") return selector
  const band = selector.assignments.red ?? selector.assignments.nir ?? 1
  return { kind: "bands", bands: [band], assignments: {} }
}

const labelCls = "self-center font-sans text-body-md uppercase text-muted-foreground"
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

function CustomColormapPreview({
  value,
  label,
  onEdit,
}: {
  value: RasterCustomColormap
  label: string
  onEdit?: () => void
}) {
  const gradient = buildColormapGradient({
    stops: value.entries.map((entry) => entry.color),
    interpolation: value.interpolation ?? "linear",
    colorSpace: value.colorSpace ?? "oklch",
  })
  const content = (
    <>
      <span
        className="h-3.5 w-full border border-primary ring-1 ring-primary"
        style={{ background: gradient }}
      />
      <span className="font-mono text-[10px] tracking-[0.04em] text-primary">{label}</span>
    </>
  )

  if (!onEdit) {
    return (
      <div
        data-slot="custom-colormap-preview"
        className="flex h-auto flex-col gap-1 border border-transparent p-1"
      >
        {content}
      </div>
    )
  }

  return (
    <Button
      aria-label={label}
      data-slot="custom-colormap-preview"
      variant="ghost"
      size="sm"
      type="button"
      onClick={onEdit}
      className="flex h-auto cursor-pointer flex-col gap-1 border border-transparent p-1 text-left bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary"
    >
      {content}
    </Button>
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
  labels,
  onEditCustomColormap,
  autoRange,
  dataRange,
  mosaic,
  className,
}: RasterStylePanelProps) {
  const resolvedLabels = resolveLabels(DEFAULT_RASTER_STYLE_PANEL_LABELS, labels)
  const normalizedDataRange = normalizeDataRange(dataRange)
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
    <Select value={selected ? String(selected) : ""} onValueChange={(raw) => onSelect(Number(raw))}>
      <SelectTrigger aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {bands.map((band) => (
            <SelectItem key={band} value={String(band)}>
              {labels.band} {band}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
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
  const editCustomColormap = () => {
    const next = custom ?? {
      entries: [
        { value: 0, color: "#000000" },
        { value: 1, color: "#ffffff" },
      ],
    }
    if (!custom) setColormap({ kind: "custom", value: next })
    onEditCustomColormap?.(next)
  }
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
        <ButtonRadioGroup
          aria-label={labels.renderMode ?? "Render"}
          className="grid grid-cols-2"
          size="xs"
          variant="soft"
          value={selectorMode}
          onValueChange={(raw) => switchSelector(raw as "single" | "rgb")}
        >
          <ButtonRadioGroupItem value="single" className="min-w-0 whitespace-nowrap">
            {labels.renderSingle ?? "Single"}
          </ButtonRadioGroupItem>
          <ButtonRadioGroupItem value="rgb" className="min-w-0 whitespace-nowrap">
            {labels.renderRgb ?? "RGB"}
          </ButtonRadioGroupItem>
        </ButtonRadioGroup>
        <div className={labelCls}>{labels.band}</div>
        {isRgb ? (
          <div className="flex flex-col gap-1.5">
            {CHANNELS.map((key) => {
              const channelLabel = labels.channelLabels?.[key] ?? DEFAULT_CHANNEL_LABEL[key]
              return (
                <div key={key} className="grid grid-cols-[42px_minmax(0,1fr)] items-center gap-1">
                  <span className="font-mono text-[10px]">{channelLabel}</span>
                  {selectBand(`${channelLabel} ${labels.band}`, assignments[key], (band) => {
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
              )
            })}
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
              <ButtonRadioGroup
                aria-label={labels.colormap}
                className="grid grid-cols-3"
                size="xs"
                variant="soft"
                value={value.colormap.kind}
                onValueChange={(raw) => {
                  const kind = raw as "none" | "named" | "custom"
                  if (kind === "none") setColormap({ kind: "none" })
                  else if (kind === "named") setColormap({ kind: "named", name: "viridis" })
                  else editCustomColormap()
                }}
              >
                <ButtonRadioGroupItem value="none" className="min-w-0 whitespace-nowrap">
                  {resolvedLabels.colormapNone}
                </ButtonRadioGroupItem>
                <ButtonRadioGroupItem value="named" className="min-w-0 whitespace-nowrap">
                  {resolvedLabels.colormapNamed}
                </ButtonRadioGroupItem>
                <ButtonRadioGroupItem value="custom" className="min-w-0 whitespace-nowrap">
                  {resolvedLabels.colormapCustom}
                </ButtonRadioGroupItem>
              </ButtonRadioGroup>
              {value.colormap.kind === "named" ? (
                <ColormapPicker
                  value={value.colormap.name}
                  onChange={(name) => name !== "custom" && setColormap({ kind: "named", name })}
                  customLabel={labels.customColormap}
                />
              ) : null}
              {custom ? (
                <CustomColormapPreview
                  value={custom}
                  label={resolvedLabels.colormapCustom}
                  onEdit={onEditCustomColormap ? editCustomColormap : undefined}
                />
              ) : null}
              {custom && !onEditCustomColormap ? (
                <>
                  {custom.entries.map((entry, index) => (
                    <div key={customEntryIds[index]} className="grid grid-cols-2 gap-1">
                      <NumberDraftInput
                        key={`value-${resetKey ?? "initial"}`}
                        id={`cmap-value-${index}`}
                        label={`Colormap stop ${index + 1} value`}
                        value={entry.value}
                        report={report}
                        min={normalizedDataRange?.[0]}
                        max={normalizedDataRange?.[1]}
                        validate={(next) => isInDataRange(next, normalizedDataRange)}
                        onValid={(next) => updateEntry(index, { value: next })}
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
                    <Button
                      variant="outline"
                      size="sm"
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
                    </Button>
                    {custom.entries.length > 1 ? (
                      <Button
                        variant="outline"
                        size="sm"
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
                      </Button>
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
          dataRange={normalizedDataRange}
          labels={{
            modes: labels.stretchModes,
            percentHint: labels.percentHint,
            sigmaHint: labels.sigmaHint,
            sigmaSuffix: labels.sigmaSuffix,
            auto: labels.auto,
          }}
          ariaLabel={labels.stretch}
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
        <Select
          value={value.resampling}
          onValueChange={(resampling) =>
            onChange({ ...panelValue, resampling: resampling as Resampling })
          }
        >
          <SelectTrigger aria-label={labels.resampling}>
            <SelectValue>
              {(resampling: Resampling | null) =>
                resampling ? labels.resamplingModes[resampling] : null
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {RESAMPLINGS.map((resampling) => (
                <SelectItem key={resampling} value={resampling}>
                  {labels.resamplingModes[resampling]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className={labelCls}>{labels.format}</div>
        <Select
          value={value.format}
          onValueChange={(format) =>
            onChange({ ...panelValue, format: format as RasterFormatValue })
          }
        >
          <SelectTrigger aria-label={labels.format}>
            <SelectValue>
              {(format: RasterFormatValue | null) => (format ? labels.formatModes[format] : null)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {FORMATS.map((format) => (
                <SelectItem key={format} value={format}>
                  {labels.formatModes[format]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className={labelCls}>{labels.tileSize}</div>
        <Select
          value={String(value.tileSize)}
          onValueChange={(raw) => onChange({ ...panelValue, tileSize: Number(raw) as TileSize })}
        >
          <SelectTrigger aria-label={labels.tileSize}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {TILE_SIZES.map((tileSize) => (
                <SelectItem key={tileSize} value={String(tileSize)}>
                  {tileSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

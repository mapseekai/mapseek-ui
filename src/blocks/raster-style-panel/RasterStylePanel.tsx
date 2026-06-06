import {
  IconBlur,
  IconChartLine,
  IconGridDots,
  IconHelpCircle,
  IconInfoCircle,
  IconMathAvg,
  IconVectorSpline,
  IconWaveSine,
  type Icon as TablerIcon,
} from "@tabler/icons-react"
import { Input } from "../../components/input"
import { Select } from "../../components/select"
import { Tooltip } from "../../components/tooltip"
import { cn } from "../../lib/utils"
import { ColormapPicker } from "./ColormapPicker"
import { Segmented } from "./Segmented"
import { StretchControl } from "./StretchControl"
import type {
  NoDataKind,
  RasterFormatValue,
  RasterStat,
  RasterStylePanelProps,
  Resampling,
  TileSize,
} from "./types"

const RESAMPLINGS: { value: Resampling; icon: TablerIcon }[] = [
  { value: "nearest", icon: IconGridDots },
  { value: "bilinear", icon: IconBlur },
  { value: "cubic", icon: IconChartLine },
  { value: "cubic-spline", icon: IconVectorSpline },
  { value: "lanczos", icon: IconWaveSine },
  { value: "average", icon: IconMathAvg },
]

const TILE_SIZES: TileSize[] = [64, 128, 256, 512, 1024]
const FORMATS: RasterFormatValue[] = ["png", "webp", "jpeg"]
const CHANNELS = ["R", "G", "B"] as const
type RenderMode = "single" | "rgb"
type Channel = (typeof CHANNELS)[number]
const CHANNEL_COLOR: Record<string, string> = {
  R: "text-destructive",
  G: "text-primary",
  B: "text-[var(--cat-2)]",
}
const DEFAULT_NODATA_DESCRIPTIONS: Record<NoDataKind, string> = {
  nan: "Use NaN as NoData.",
  inf: "Use positive infinity as NoData.",
  "-inf": "Use negative infinity as NoData.",
  custom: "",
}
const DEFAULT_NODATA_RECOMMENDATIONS = [0, 255, 65535]

const labelCls =
  "self-center font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
const numInput = "h-[26px] w-full rounded-none px-1.5 font-mono text-[11px] tabular-nums"

function ParamLabel({ text, help }: { text: string; help?: string }) {
  return (
    <label className={cn(labelCls, "inline-flex items-center gap-1")}>
      {text}
      {help && (
        <Tooltip content={help}>
          <IconHelpCircle
            size={12}
            stroke={1.75}
            className="text-muted-foreground"
          />
        </Tooltip>
      )}
    </label>
  )
}

function RasterStatGrid({ stats }: { stats: RasterStat[] }) {
  return (
    <div className="mb-2 grid grid-cols-2 gap-1.5 border border-border bg-muted p-2">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-0.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.04em] text-muted-foreground">
            {s.label}
          </span>
          <span className="font-mono text-xs tabular-nums text-foreground">
            {s.value}
            {s.unit && <span className="ml-0.5 font-normal text-muted-foreground">{s.unit}</span>}
          </span>
        </div>
      ))}
    </div>
  )
}

function clampBandIndex(idx: number | undefined, max: number) {
  if (!Number.isInteger(idx) || idx == null || idx < 1) return 1
  return Math.min(idx, max)
}

function range(count: number) {
  return Array.from({ length: count }, (_, i) => i + 1)
}

/**
 * Controlled raster styling form (TiTiler params): band/bidx, colormap,
 * stretch, NoData, resampling, tile size, and color_formula. Single-band
 * vs multi-band is derived from `value.multiband`, which toggles the
 * colormap (disabled), per-band rescale, and the color_formula row.
 */
export function RasterStylePanel({
  value,
  onChange,
  bandCount,
  stats,
  labels,
  autoRange,
  className,
}: RasterStylePanelProps) {
  const set = (patch: Partial<typeof value>) => onChange({ ...value, ...patch })
  const help = labels.help ?? {}
  const maxBand = Math.max(
    1,
    Math.floor(
      bandCount ??
        Math.max(1, ...value.bands.map((band) => band.idx).filter(Number.isFinite))
    )
  )
  const bandOptions = range(maxBand)
  const bandOptionLabel = (idx: number) => `${labels.band} ${idx}`
  const supportsRgb = maxBand > 1
  const renderMode: RenderMode = value.multiband && supportsRgb ? "rgb" : "single"
  const isRgb = renderMode === "rgb"
  const nodataDescriptions = {
    ...DEFAULT_NODATA_DESCRIPTIONS,
    ...labels.nodataDescriptions,
  }
  const nodataRecommendations =
    labels.nodataRecommendations ?? DEFAULT_NODATA_RECOMMENDATIONS

  const setRenderMode = (mode: RenderMode) => {
    if (mode === renderMode) return
    if (mode === "rgb") {
      const bands = CHANNELS.map((channel, i) => ({
        idx: clampBandIndex(value.bands[i]?.idx ?? i + 1, maxBand),
        channel,
      }))
      const firstRange =
        value.stretch.mode === "custom"
          ? value.stretch.rescale ?? value.stretch.rescaleBands?.[0]
          : undefined
      set({
        multiband: true,
        bands,
        stretch:
          value.stretch.mode === "custom" && firstRange
            ? {
                ...value.stretch,
                rescaleBands: value.stretch.rescaleBands ?? bands.map(() => firstRange),
              }
            : value.stretch,
      })
      return
    }

    const first = value.bands[0]
    const firstRange =
      value.stretch.mode === "custom"
        ? value.stretch.rescale ?? value.stretch.rescaleBands?.[0]
        : undefined
    set({
      multiband: false,
      bands: [{ idx: clampBandIndex(first?.idx, maxBand), label: first?.label }],
      stretch:
        value.stretch.mode === "custom" && firstRange
          ? { ...value.stretch, rescale: firstRange }
          : value.stretch,
    })
  }

  const setSingleBand = (idx: number) => {
    const first = value.bands[0]
    set({
      multiband: false,
      bands: [{ idx, label: first?.label }],
    })
  }

  const setRgbBand = (channel: Channel, idx: number) => {
    const bands = CHANNELS.map((ch, i) => ({
      idx: clampBandIndex(value.bands[i]?.idx ?? i + 1, maxBand),
      channel: ch,
    }))
    const target = bands.find((band) => band.channel === channel)
    if (target) target.idx = idx
    set({ multiband: true, bands })
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {stats && stats.length > 0 && <RasterStatGrid stats={stats} />}

      <div className="grid grid-cols-[56px_1fr] gap-x-3 gap-y-2.5">
        {/* Render mode */}
        {supportsRgb && (
          <>
            <ParamLabel text={labels.renderMode ?? "Render"} />
            <Segmented<RenderMode>
              options={[
                { value: "single", label: labels.renderSingle ?? "Single" },
                { value: "rgb", label: labels.renderRgb ?? "RGB" },
              ]}
              value={renderMode}
              onChange={setRenderMode}
              buttonClassName="font-sans text-[11px]"
            />
          </>
        )}

        {/* Band / bidx */}
        <ParamLabel text={labels.band} help={help.band} />
        {renderMode === "rgb" ? (
          <div className="flex flex-col gap-1.5">
            {CHANNELS.map((channel, i) => (
              <div key={channel} className="grid grid-cols-[18px_1fr] items-center gap-1.5">
                <span
                  className={cn(
                    "font-mono text-[11px] font-semibold",
                    CHANNEL_COLOR[channel]
                  )}
                >
                  {channel}
                </span>
                <Select
                  aria-label={`${channel} ${labels.band}`}
                  className="h-[26px] rounded-none px-2 font-mono text-[11px]"
                  value={String(clampBandIndex(value.bands[i]?.idx ?? i + 1, maxBand))}
                  onValueChange={(idx) => setRgbBand(channel, Number(idx))}
                >
                  {bandOptions.map((idx) => (
                    <Select.Item key={idx} value={String(idx)}>
                      {bandOptionLabel(idx)}
                    </Select.Item>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        ) : (
          <Select
            aria-label={labels.band}
            className="h-[26px] rounded-none px-2 font-mono text-[11px]"
            value={String(clampBandIndex(value.bands[0]?.idx, maxBand))}
            onValueChange={(idx) => setSingleBand(Number(idx))}
          >
            {bandOptions.map((idx) => (
              <Select.Item key={idx} value={String(idx)}>
                {bandOptionLabel(idx)}
              </Select.Item>
            ))}
          </Select>
        )}

        {/* Colormap */}
        <ParamLabel text={labels.colormap} help={help.colormap} />
        {isRgb ? (
          <span className="inline-flex items-center gap-1.5 self-center text-[11px] leading-[1.4] text-muted-foreground">
            <IconInfoCircle size={13} stroke={1.75} />
            {labels.multibandNote}
          </span>
        ) : (
          <ColormapPicker
            value={value.colormap}
            onChange={(colormap) => set({ colormap })}
            customLabel={labels.customColormap}
          />
        )}

        {/* Stretch */}
        <ParamLabel text={labels.stretch} help={help.stretch} />
        <StretchControl
          value={value.stretch}
          onChange={(stretch) => set({ stretch })}
          bands={isRgb ? value.bands : undefined}
          autoRange={isRgb ? undefined : autoRange}
          labels={{
            modes: labels.stretchModes,
            minmaxHint: labels.minmaxHint,
            percentHint: labels.percentHint,
            sigmaHint: labels.sigmaHint,
            sigmaSuffix: labels.sigmaSuffix,
            auto: labels.auto,
          }}
        />

        {/* NoData */}
        <ParamLabel text={labels.nodata} help={help.nodata} />
        <div className="flex flex-col gap-1">
          <Segmented
            options={[
              { value: "nan", label: "nan", tip: nodataDescriptions.nan },
              { value: "inf", label: "∞", tip: nodataDescriptions.inf },
              { value: "-inf", label: "−∞", tip: nodataDescriptions["-inf"] },
              {
                value: "custom",
                label: labels.stretchModes.custom,
              },
            ]}
            value={value.nodata.kind}
            onChange={(kind) =>
              set({ nodata: { ...value.nodata, kind: kind as typeof value.nodata.kind } })
            }
            className="w-full"
            buttonClassName="whitespace-nowrap px-1 text-[11px] font-mono text-muted-foreground data-[active=true]:text-primary"
          />
          {value.nodata.kind !== "custom" && (
            <p className="min-h-[14px] text-[11px] leading-[14px] text-muted-foreground">
              {nodataDescriptions[value.nodata.kind]}
            </p>
          )}
          {value.nodata.kind === "custom" && (
            <div className="grid grid-cols-5 gap-1">
              <Input
                type="number"
                aria-label="Custom NoData"
                placeholder="NoData"
                className={cn(numInput, "col-span-2 text-right")}
                value={value.nodata.custom ?? ""}
                onChange={(e) =>
                  set({ nodata: { kind: "custom", custom: Number(e.target.value) } })
                }
              />
              {nodataRecommendations.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => set({ nodata: { kind: "custom", custom: preset } })}
                  className="inline-flex h-[26px] cursor-pointer items-center justify-center border border-border bg-background px-1.5 font-mono text-[11px] tabular-nums text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resampling */}
        <ParamLabel text={labels.resampling} help={help.resampling} />
        <Segmented<Resampling>
          columns={3}
          options={RESAMPLINGS.map((r) => ({
            value: r.value,
            label: labels.resamplingModes[r.value],
            icon: r.icon,
          }))}
          value={value.resampling}
          onChange={(resampling) => set({ resampling })}
          buttonClassName="font-sans text-[11px]"
        />

        {/* Format */}
        <ParamLabel text={labels.format} />
        <div className="flex flex-col gap-1">
          <Segmented<RasterFormatValue>
            options={FORMATS.map((f) => ({
              value: f,
              label: labels.formatModes[f],
            }))}
            value={value.format}
            onChange={(format) => set({ format })}
            buttonClassName="font-sans text-[11px]"
          />
          {value.format === "jpeg" && labels.formatJpegNote && (
            <p className="min-h-[14px] text-[11px] leading-[14px] text-muted-foreground">
              {labels.formatJpegNote}
            </p>
          )}
        </div>

        {/* Tile size */}
        <ParamLabel text={labels.tileSize} />
        <Segmented<string>
          options={TILE_SIZES.map((t) => ({ value: String(t), label: t }))}
          value={String(value.tileSize)}
          onChange={(t) => set({ tileSize: Number(t) as TileSize })}
          buttonClassName="font-mono text-[11px] text-muted-foreground data-[active=true]:text-primary"
        />

        {/* Color formula (multi-band only) */}
        {isRgb && (
          <>
            <ParamLabel text={labels.colorFormula} help={help.colorFormula} />
            <Input
              type="text"
              className="h-[26px] w-full rounded-none px-1.5 text-left font-mono text-[11px]"
              value={value.colorFormula ?? ""}
              placeholder={labels.colorFormulaPlaceholder}
              onChange={(e) => set({ colorFormula: e.target.value })}
            />
          </>
        )}
      </div>
    </div>
  )
}

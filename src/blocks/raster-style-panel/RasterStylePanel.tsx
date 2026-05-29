import {
  IconBlur,
  IconChartLine,
  IconGridDots,
  IconHelpCircle,
  IconInfoCircle,
  IconMathAvg,
  IconPlus,
  IconVectorSpline,
  IconWaveSine,
  type Icon as TablerIcon,
} from "@tabler/icons-react"
import { Input } from "../../components/input"
import { Tooltip } from "../../components/tooltip"
import { cn } from "../../lib/utils"
import { ColormapPicker } from "./ColormapPicker"
import { Segmented } from "./Segmented"
import { StretchControl } from "./StretchControl"
import type {
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
const CHANNELS = ["R", "G", "B"] as const
const CHANNEL_COLOR: Record<string, string> = {
  R: "text-destructive",
  G: "text-primary",
  B: "text-[var(--cat-2)]",
}

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

/**
 * Controlled raster styling form (TiTiler params): band/bidx, colormap,
 * stretch, NoData, resampling, tile size, and color_formula. Single-band
 * vs multi-band is derived from `value.multiband`, which toggles the
 * colormap (disabled), per-band rescale, and the color_formula row.
 */
export function RasterStylePanel({
  value,
  onChange,
  stats,
  labels,
  autoRange,
  className,
}: RasterStylePanelProps) {
  const set = (patch: Partial<typeof value>) => onChange({ ...value, ...patch })
  const help = labels.help ?? {}

  const appendBand = () => {
    const nextIdx = (value.bands[value.bands.length - 1]?.idx ?? 0) + 1
    set({ bands: [...value.bands, { idx: nextIdx }] })
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {stats && stats.length > 0 && <RasterStatGrid stats={stats} />}

      <div className="grid grid-cols-[56px_1fr] gap-x-3 gap-y-2.5">
        {/* Band / bidx */}
        <ParamLabel text={labels.band} help={help.band} />
        <div className="flex flex-wrap items-center gap-1.5">
          {value.bands.map((b, i) => {
            const ch = value.multiband ? CHANNELS[i] : undefined
            return (
              <span
                key={`${b.idx}-${i}`}
                className="inline-flex h-[22px] items-center gap-1 border border-primary/25 bg-primary/10 px-2 font-mono text-[11px] text-primary"
              >
                {ch && (
                  <span className={cn("font-semibold", CHANNEL_COLOR[ch])}>{ch}</span>
                )}
                <span className="font-semibold">{b.idx}</span>
                {b.label && <span className="opacity-70">{b.label}</span>}
              </span>
            )
          })}
          <button
            type="button"
            onClick={appendBand}
            className="inline-flex h-[22px] cursor-pointer items-center gap-1 border border-dashed border-border px-2 font-mono text-[10px] uppercase tracking-[0.04em] text-muted-foreground hover:border-primary hover:text-primary"
          >
            <IconPlus size={11} stroke={1.75} /> {labels.bandAppend}
          </button>
        </div>

        {/* Colormap */}
        <ParamLabel text={labels.colormap} help={help.colormap} />
        {value.multiband ? (
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
          bands={value.multiband ? value.bands : undefined}
          autoRange={value.multiband ? undefined : autoRange}
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
        <div className="flex items-center gap-1">
          <Segmented
            grow={false}
            options={[
              { value: "nan", label: "nan" },
              { value: "inf", label: "∞" },
              { value: "-inf", label: "−∞" },
              { value: "custom", label: labels.stretchModes.custom },
            ]}
            value={value.nodata.kind}
            onChange={(kind) =>
              set({ nodata: { ...value.nodata, kind: kind as typeof value.nodata.kind } })
            }
            buttonClassName="text-[11px] font-mono text-muted-foreground data-[active=true]:text-primary"
          />
          {value.nodata.kind === "custom" && (
            <Input
              type="number"
              className={cn(numInput, "flex-1 text-right")}
              value={value.nodata.custom ?? ""}
              onChange={(e) =>
                set({ nodata: { kind: "custom", custom: Number(e.target.value) } })
              }
            />
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

        {/* Tile size */}
        <ParamLabel text={labels.tileSize} />
        <Segmented<string>
          options={TILE_SIZES.map((t) => ({ value: String(t), label: t }))}
          value={String(value.tileSize)}
          onChange={(t) => set({ tileSize: Number(t) as TileSize })}
          buttonClassName="font-mono text-[11px] text-muted-foreground data-[active=true]:text-primary"
        />

        {/* Color formula (multi-band only) */}
        {value.multiband && (
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

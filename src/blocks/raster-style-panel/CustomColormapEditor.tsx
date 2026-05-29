import {
  IconBookmark,
  IconColorSwatch,
  IconPalette,
  IconPlus,
  IconWaveSine,
  IconX,
  type Icon as TablerIcon,
} from "@tabler/icons-react"
import { cn } from "../../lib/utils"
import { buildColormapGradient } from "./gradient"
import { DEFAULT_COLORMAP_PRESETS } from "./presets"
import { Segmented } from "./Segmented"
import type {
  ColormapColorSpace,
  ColormapInterpolation,
  CustomColormapEditorProps,
} from "./types"

const INTERPOLATIONS: ColormapInterpolation[] = ["linear", "step", "smooth"]
const COLOR_SPACES: ColormapColorSpace[] = ["oklch", "srgb", "hsl"]

function SectionHead({
  icon: Icon,
  title,
  trailing,
}: {
  icon: TablerIcon
  title: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
      <Icon size={11} stroke={1.75} />
      <span>{title}</span>
      {trailing != null && (
        <span className="ml-auto text-[10px] tracking-normal normal-case">
          {trailing}
        </span>
      )}
    </div>
  )
}

/**
 * Controlled custom colormap editor: gradient preview, editable color
 * stops, interpolation + color-space, and preset import. Content only —
 * wrap in a Dialog (title/description/cancel/apply) on the consumer side.
 */
export function CustomColormapEditor({
  value,
  onChange,
  presets = DEFAULT_COLORMAP_PRESETS,
  labels,
  minStops = 2,
  className,
}: CustomColormapEditorProps) {
  const { stops } = value
  const set = (patch: Partial<typeof value>) => onChange({ ...value, ...patch })
  const canRemove = stops.length > minStops

  const updateStop = (i: number, color: string) =>
    set({ stops: stops.map((c, j) => (j === i ? color : c)) })
  const removeStop = (i: number) => {
    if (!canRemove) return
    set({ stops: stops.filter((_, j) => j !== i) })
  }
  const addStop = () =>
    set({ stops: [...stops, stops[stops.length - 1] ?? "#888888"] })

  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      {/* Preview */}
      <div
        className="h-[22px] border border-border"
        style={{ background: buildColormapGradient(value) }}
      />

      {/* Stops */}
      <section className="flex flex-col gap-1.5">
        <SectionHead
          icon={IconPalette}
          title={labels.stops}
          trailing={`${stops.length} ${labels.stopsUnit}`}
        />
        <div className="flex flex-wrap items-center gap-1">
          {stops.map((color, i) => (
            <span
              key={i}
              className="group/stop relative h-[30px] w-[30px] shrink-0 cursor-pointer border border-border-strong"
              style={{ background: color }}
            >
              <input
                type="color"
                value={color}
                aria-label={`${labels.stops} ${i + 1}`}
                onChange={(e) => updateStop(i, e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              {canRemove && (
                <button
                  type="button"
                  aria-label={labels.removeStop}
                  title={labels.removeStop}
                  onClick={() => removeStop(i)}
                  className="absolute -top-[7px] left-1/2 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full border border-border-strong bg-card opacity-0 transition-opacity group-hover/stop:opacity-100 group-focus-within/stop:opacity-100 hover:border-destructive"
                >
                  <IconX size={10} className="text-muted-foreground" />
                </button>
              )}
            </span>
          ))}
          <button
            type="button"
            aria-label={labels.addStop}
            title={labels.addStop}
            onClick={addStop}
            className="grid h-[30px] w-[30px] shrink-0 place-items-center border border-dashed border-border-strong text-muted-foreground hover:border-primary hover:text-primary"
          >
            <IconPlus size={12} stroke={1.75} />
          </button>
        </div>
      </section>

      {/* Interpolation */}
      <section className="flex flex-col gap-1.5">
        <SectionHead icon={IconWaveSine} title={labels.interpolation} />
        <Segmented<ColormapInterpolation>
          options={INTERPOLATIONS.map((m) => ({
            value: m,
            label: labels.interpolationModes[m],
          }))}
          value={value.interpolation}
          onChange={(interpolation) => set({ interpolation })}
          buttonClassName="font-sans text-[11px]"
        />
      </section>

      {/* Color space */}
      <section className="flex flex-col gap-1.5">
        <SectionHead
          icon={IconColorSwatch}
          title={labels.colorSpace}
          trailing={
            <span className="font-sans normal-case">{labels.colorSpaceHint}</span>
          }
        />
        <Segmented<ColormapColorSpace>
          options={COLOR_SPACES.map((s) => ({
            value: s,
            label: labels.colorSpaceModes[s],
          }))}
          value={value.colorSpace}
          onChange={(colorSpace) => set({ colorSpace })}
          buttonClassName="font-sans text-[11px]"
        />
      </section>

      {/* Presets */}
      <section className="flex flex-col gap-1.5">
        <SectionHead
          icon={IconBookmark}
          title={labels.importPreset}
          trailing={
            <span className="font-sans normal-case">{labels.importHint}</span>
          }
        />
        <div className="grid grid-cols-4 gap-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => set({ stops: [...p.stops] })}
              className="flex cursor-pointer flex-col gap-1 border border-border bg-background p-1 hover:bg-muted"
            >
              <span
                className="h-2.5 border border-border"
                style={{
                  background: `linear-gradient(to right, ${p.stops.join(", ")})`,
                }}
              />
              <span className="text-center font-mono text-[9px] text-muted-foreground">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

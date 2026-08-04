import {
  IconBookmark,
  IconColorSwatch,
  IconPalette,
  IconPlus,
  IconWaveSine,
  IconX,
  type Icon as TablerIcon,
} from "@tabler/icons-react"
import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ColorInput } from "@/components/ui/color-input"
import { cn } from "@/lib/utils"
import { buildColormapGradient } from "./gradient"
import { DEFAULT_COLORMAP_PRESETS } from "./presets"
import { Segmented } from "./Segmented"
import type { ColormapColorSpace, ColormapInterpolation, CustomColormapEditorProps } from "./types"

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
        <span className="ml-auto text-[10px] tracking-normal normal-case">{trailing}</span>
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
  const stopIdPrefix = useId()
  const nextStopId = useRef(stops.length)
  const [stopIds, setStopIds] = useState(() => stops.map((_, index) => `${stopIdPrefix}-${index}`))
  useEffect(() => {
    const difference = stops.length - stopIds.length
    if (difference === 0) return
    if (difference < 0) {
      setStopIds((current) => current.slice(0, stops.length))
      return
    }
    const start = nextStopId.current
    nextStopId.current += difference
    const added = Array.from(
      { length: difference },
      (_, index) => `${stopIdPrefix}-${start + index}`,
    )
    setStopIds((current) => [...current, ...added])
  }, [stopIdPrefix, stopIds.length, stops.length])
  const set = (patch: Partial<typeof value>) => onChange({ ...value, ...patch })
  const canRemove = stops.length > minStops

  const updateStop = (i: number, color: string) =>
    set({ stops: stops.map((c, j) => (j === i ? color : c)) })
  const removeStop = (i: number) => {
    if (!canRemove) return
    setStopIds((current) => current.filter((id) => id !== current[i]))
    set({ stops: stops.filter((_, j) => j !== i) })
  }
  const addStop = () => {
    const id = `${stopIdPrefix}-${nextStopId.current}`
    nextStopId.current += 1
    setStopIds((current) => [...current, id])
    set({ stops: [...stops, stops[stops.length - 1] ?? "#888888"] })
  }
  const importPreset = (presetStops: string[]) => {
    const start = nextStopId.current
    nextStopId.current += presetStops.length
    setStopIds(presetStops.map((_, index) => `${stopIdPrefix}-${start + index}`))
    set({ stops: [...presetStops] })
  }

  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      {/* Preview */}
      <div
        className="h-6"
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
              key={stopIds[i] ?? color}
              className="group/stop relative h-7 w-7 shrink-0"
            >
              <ColorInput
                value={color}
                aria-label={`${labels.stops} ${i + 1}`}
                onChange={(e) => updateStop(i, e.target.value)}
                className="size-full border-border-strong"
              />
              {canRemove && (
                <Button
                  size="icon-xs"
                  variant="ghost"
                  type="button"
                  aria-label={labels.removeStop}
                  title={labels.removeStop}
                  onClick={() => removeStop(i)}
                  className="absolute -top-1 left-1/2 grid h-4 w-4 -translate-x-1/2 place-items-center border border-border bg-background p-0 opacity-0 transition-opacity group-hover/stop:opacity-100 group-focus-within/stop:opacity-100 hover:border-destructive"
                >
                  <IconX size={10} className="text-muted-foreground" />
                </Button>
              )}
            </span>
          ))}
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-label={labels.addStop}
            title={labels.addStop}
            onClick={addStop}
            className="grid h-7 w-7 shrink-0 place-items-center border border-dashed border-border-strong text-muted-foreground hover:border-primary hover:text-primary"
          >
            <IconPlus size={12} stroke={1.75} />
          </Button>
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
          trailing={<span className="font-sans normal-case">{labels.colorSpaceHint}</span>}
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
          trailing={<span className="font-sans normal-case">{labels.importHint}</span>}
        />
        <div className="grid grid-cols-4 gap-1.5">
          {presets.map((p) => (
            <Button
              variant="ghost"
              size="sm"
              key={p.id}
              type="button"
              onClick={() => importPreset(p.stops)}
              className="flex cursor-pointer flex-col gap-1 border border-border bg-background p-1 hover:bg-muted"
            >
              <span
                aria-hidden="true"
                className="h-3 w-full"
                style={{
                  background: `linear-gradient(to right, ${p.stops.join(", ")})`,
                }}
              />
              <span className="text-center font-mono text-[10px] text-muted-foreground">
                {p.name}
              </span>
            </Button>
          ))}
        </div>
      </section>
    </div>
  )
}

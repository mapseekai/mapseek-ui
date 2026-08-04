import { IconChevronDown, IconMap2, IconWorld, type Icon as TablerIcon } from "@tabler/icons-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { CrsPicker } from "../crs-picker"
import { DEFAULT_MAP_COORDINATE_STATUS_LABELS } from "./defaults"
import type { MapCoordinateStatusLabels } from "./labels"
import type { MapCoordinateStatusProps, MapCoordinateStatusReadout } from "./types"

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isProjectedCrs(crs: string) {
  const normalized = crs.trim().toLowerCase()
  return (
    normalized === "epsg:3857" ||
    normalized === "epsg:900913" ||
    normalized === "epsg:102100" ||
    normalized.includes("mercator")
  )
}

function formatDegree(value: number, positive: string, negative: string) {
  const suffix = value < 0 ? negative : positive
  return `${Math.abs(value).toFixed(4)}° ${suffix}`
}

function formatProjected(value: number) {
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })} m`
}

function formatLevel(zoom?: number | null, scale?: number | null) {
  if (isFiniteNumber(zoom)) {
    return zoom % 1 === 0 ? String(zoom) : zoom.toFixed(2)
  }
  if (isFiniteNumber(scale)) {
    return scale.toLocaleString(undefined, { maximumFractionDigits: 0 })
  }
  return "—"
}

function buildReadouts({
  crs,
  center,
  zoom,
  scale,
  labels,
}: {
  crs: string
  center?: [number, number] | null
  zoom?: number | null
  scale?: number | null
  labels: MapCoordinateStatusLabels
}): MapCoordinateStatusReadout[] {
  const projected = isProjectedCrs(crs)
  const [x, y] = center ?? []
  const xValue = isFiniteNumber(x)
    ? projected
      ? formatProjected(x)
      : formatDegree(x, "E", "W")
    : "—"
  const yValue = isFiniteNumber(y)
    ? projected
      ? formatProjected(y)
      : formatDegree(y, "N", "S")
    : "—"

  return [
    {
      key: projected ? "y" : "lat",
      label: projected ? labels.y : labels.latitude,
      value: yValue,
    },
    {
      key: projected ? "x" : "lon",
      label: projected ? labels.x : labels.longitude,
      value: xValue,
    },
    {
      key: isFiniteNumber(zoom) ? "zoom" : "scale",
      label: isFiniteNumber(zoom) ? labels.zoom : labels.scale,
      value: formatLevel(zoom, scale),
    },
  ]
}

/**
 * Floating CRS switcher + coordinate readout for map editors.
 * Data is controlled by the caller; this component only owns popover state.
 */
export function MapCoordinateStatus({
  crs,
  center,
  zoom,
  scale,
  readouts,
  onCrsChange,
  allowedEpsgs,
  extraItems,
  labels: labelsProp,
  className,
  pickerClassName,
}: MapCoordinateStatusProps) {
  const [open, setOpen] = React.useState(false)
  const labels = resolveLabels(DEFAULT_MAP_COORDINATE_STATUS_LABELS, labelsProp)
  const projected = isProjectedCrs(crs)
  const CrsIcon: TablerIcon = projected ? IconMap2 : IconWorld
  const displayReadouts =
    readouts ??
    buildReadouts({
      crs,
      center,
      zoom,
      scale,
      labels,
    })

  async function handleCrsChange(epsg: string) {
    setOpen(false)
    if (epsg === crs) return
    await onCrsChange?.(epsg)
  }

  return (
    <div
      data-slot="map-coordinate-status"
      className={cn(
        "flex h-auto max-w-full flex-wrap items-stretch border border-border bg-card font-mono text-[11px] font-medium text-foreground sm:h-7 sm:flex-nowrap",
        className,
      )}
    >
      <div className="flex min-h-7 items-center px-1.5 sm:min-h-0">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                aria-label={labels.switchCrs}
                className={cn(
                  "h-5 gap-[3px] rounded-none border border-primary/25 px-1.5 font-mono text-[10px] tracking-[0.04em] text-primary hover:text-primary",
                  open ? "bg-primary/[0.18]" : "bg-primary/10",
                )}
              >
                <CrsIcon data-icon="inline-start" stroke={1.75} className="shrink-0" />
                {crs}
                <IconChevronDown data-icon="inline-end" className="opacity-70" />
              </Button>
            }
          />
          <PopoverContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-auto gap-0 p-0 shadow-(--shadow-lg)"
          >
            <CrsPicker
              value={crs}
              allowedEpsgs={allowedEpsgs}
              extraItems={extraItems}
              className={cn("border-0", pickerClassName)}
              onChange={handleCrsChange}
            />
          </PopoverContent>
        </Popover>
      </div>
      {displayReadouts.map((item) => (
        <div
          key={item.key}
          className="flex min-h-7 items-center border-l border-border px-1.5 whitespace-nowrap sm:min-h-0 sm:px-2.5"
        >
          <span className="mr-1.5 text-[10px] tracking-[0.04em] text-muted-foreground uppercase">
            {item.label}
          </span>
          {item.value}
        </div>
      ))}
    </div>
  )
}

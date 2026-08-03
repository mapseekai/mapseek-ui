import { IconCurrentLocation, IconHome, IconMinus, IconPlus } from "@tabler/icons-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MapControlsProps } from "./types"

function MapControlButton({
  label,
  onClick,
  divider = false,
  children,
}: {
  label: string
  onClick: () => void
  divider?: boolean
  children: ReactNode
}) {
  return (
    <span
      data-slot="map-control-item"
      className={cn("group relative inline-flex", divider && "border-t border-border")}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        onClick={onClick}
        className="size-8 rounded-none border-0 text-muted-foreground hover:text-foreground"
      >
        {children}
      </Button>
      <span
        role="tooltip"
        className="pointer-events-none absolute top-1/2 right-[calc(100%+6px)] z-50 -translate-y-1/2 whitespace-nowrap bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-sm transition-opacity after:absolute after:top-1/2 after:right-[-4px] after:size-2 after:-translate-y-1/2 after:rotate-45 after:bg-foreground group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}

/** Vertical zoom / locate / home cluster — a bottom-right map overlay. */
export function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  onHome,
  labels,
  className,
}: MapControlsProps) {
  return (
    <div className={cn("flex flex-col border border-border bg-card", className)}>
      <MapControlButton label={labels.zoomIn} onClick={onZoomIn}>
        <IconPlus size={14} stroke={1.5} />
      </MapControlButton>
      <MapControlButton label={labels.zoomOut} onClick={onZoomOut} divider>
        <IconMinus size={14} stroke={1.5} />
      </MapControlButton>
      {onLocate && (
        <MapControlButton label={labels.locate} onClick={onLocate} divider>
          <IconCurrentLocation size={14} stroke={1.5} />
        </MapControlButton>
      )}
      {onHome && (
        <MapControlButton label={labels.home} onClick={onHome} divider>
          <IconHome size={14} stroke={1.5} />
        </MapControlButton>
      )}
    </div>
  )
}

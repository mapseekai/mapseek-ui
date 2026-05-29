import {
  IconCurrentLocation,
  IconHome,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react"
import { IconButton } from "@workspace/ui/components/icon-button"
import { cn } from "@workspace/ui/lib/utils"
import type { MapControlsProps } from "./types"

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
    <div
      className={cn(
        "flex flex-col border border-border bg-card shadow-[var(--shadow-map-float)]",
        className,
      )}
    >
      <IconButton
        aria-label={labels.zoomIn}
        onClick={onZoomIn}
        className="border-b border-border"
      >
        <IconPlus />
      </IconButton>
      <IconButton
        aria-label={labels.zoomOut}
        onClick={onZoomOut}
        className="border-b border-border"
      >
        <IconMinus />
      </IconButton>
      {onLocate && (
        <IconButton
          aria-label={labels.locate}
          onClick={onLocate}
          className="border-b border-border"
        >
          <IconCurrentLocation />
        </IconButton>
      )}
      {onHome && (
        <IconButton aria-label={labels.home} onClick={onHome}>
          <IconHome />
        </IconButton>
      )}
    </div>
  )
}

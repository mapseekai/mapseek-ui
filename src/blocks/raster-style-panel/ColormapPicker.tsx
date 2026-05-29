import { COLORMAP_GRADIENTS, NAMED_COLORMAPS } from "./colormaps"
import { cn } from "../../lib/utils"
import type { ColormapName } from "./types"

export interface ColormapPickerProps {
  value: ColormapName
  onChange: (next: ColormapName) => void
  /** Which colormaps to offer (default: all named + custom). */
  options?: ColormapName[]
  /** Label for the "custom" swatch. */
  customLabel: string
  /** Fired when the "custom" cell is chosen — open the editor here. */
  onEditCustom?: () => void
  columns?: number
  disabled?: boolean
  className?: string
}

/**
 * Grid of named scientific colormaps (viridis/magma/…) as gradient strips.
 * Standalone-reusable; also used inside RasterStylePanel.
 */
export function ColormapPicker({
  value,
  onChange,
  options = NAMED_COLORMAPS,
  customLabel,
  onEditCustom,
  columns = 4,
  disabled,
  className,
}: ColormapPickerProps) {
  return (
    <div
      className={cn("grid gap-1", disabled && "pointer-events-none opacity-50", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((c) => {
        const active = c === value
        return (
          <button
            key={c}
            type="button"
            onClick={() => {
              onChange(c)
              if (c === "custom") onEditCustom?.()
            }}
            data-selected={active}
            className="flex cursor-pointer flex-col gap-1 border border-transparent"
          >
            <span
              className={cn(
                "h-3.5 w-full border border-border",
                active && "border-primary ring-1 ring-primary",
              )}
              style={{ background: COLORMAP_GRADIENTS[c] }}
            />
            <span
              className={cn(
                "font-mono text-[10px] lowercase tracking-[0.04em] text-muted-foreground",
                active && "text-primary",
              )}
            >
              {c === "custom" ? customLabel : c}
            </span>
          </button>
        )
      })}
    </div>
  )
}

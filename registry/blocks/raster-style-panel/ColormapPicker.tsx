import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { COLORMAP_GRADIENTS, NAMED_COLORMAPS } from "./colormaps"
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
  options,
  customLabel,
  onEditCustom,
  columns = 4,
  disabled,
  className,
}: ColormapPickerProps) {
  const visibleOptions =
    options ?? (value === "custom" ? [...NAMED_COLORMAPS, "custom" as const] : NAMED_COLORMAPS)
  return (
    <div
      className={cn("grid gap-1", disabled && "pointer-events-none opacity-50", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {visibleOptions.map((c) => {
        const active = c === value
        return (
          <Button
            variant="ghost"
            size="sm"
            key={c}
            type="button"
            onClick={() => {
              onChange(c)
              if (c === "custom") onEditCustom?.()
            }}
            data-selected={active}
            className={cn(
              "flex h-auto cursor-pointer flex-col gap-1 border border-transparent p-1",
              active && "bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary",
            )}
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
                "font-mono text-[10px] tracking-[0.04em] lowercase text-muted-foreground",
                active && "text-primary",
              )}
            >
              {c === "custom" ? customLabel : c}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

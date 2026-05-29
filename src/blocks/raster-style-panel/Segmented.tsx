import type { Icon as TablerIcon } from "@tabler/icons-react"
import { Tooltip } from "../../components/tooltip"
import { cn } from "../../lib/utils"

export interface SegmentedOption<T extends string> {
  value: T
  label: React.ReactNode
  icon?: TablerIcon
  tip?: string
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Render as an N-column grid (border-collapsed) instead of a flex row. */
  columns?: number
  /** Flex-row items fill equally (default true; ignored in grid mode). */
  grow?: boolean
  disabled?: boolean
  buttonClassName?: string
  className?: string
}

/**
 * Border-collapsed segmented control. Adjacent borders overlap (−1px) and
 * the active segment lifts above with `z-[1]`, matching the mockup's
 * stretch/tile-size/resampling/nodata segments.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  columns,
  grow = true,
  disabled,
  buttonClassName,
  className,
}: SegmentedProps<T>) {
  const grid = columns != null
  return (
    <div
      className={cn(
        grid ? "grid" : "flex",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      style={grid ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
    >
      {options.map((opt) => {
        const Icon = opt.icon
        const active = opt.value === value
        const btn = (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            data-active={active}
            className={cn(
              "inline-flex h-[26px] cursor-pointer items-center justify-center gap-1 border border-border bg-background px-2 text-foreground",
              grid ? "-mr-px -mb-px min-w-0" : "-ml-px first:ml-0",
              !grid && grow && "flex-1",
              active && "relative z-[1] bg-selection-bg text-primary",
              buttonClassName,
            )}
          >
            {Icon && <Icon size={11} stroke={1.75} />}
            {opt.label}
          </button>
        )
        return opt.tip ? (
          <Tooltip key={opt.value} content={opt.tip}>
            {btn}
          </Tooltip>
        ) : (
          btn
        )
      })}
    </div>
  )
}

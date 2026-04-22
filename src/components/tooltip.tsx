import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

type TooltipSide = "top" | "bottom" | "left" | "right"

type TooltipProps = React.ComponentProps<"span"> & {
  content: React.ReactNode
  side?: TooltipSide
  /** Disable the tooltip without removing the wrapper (useful for
   * conditional display: `disabled={!collapsed}`). */
  disabled?: boolean
}

const POSITION_CLASS: Record<TooltipSide, string> = {
  top: "after:bottom-[calc(100%+6px)] after:left-1/2 after:-translate-x-1/2",
  bottom: "after:top-[calc(100%+6px)] after:left-1/2 after:-translate-x-1/2",
  left: "after:right-[calc(100%+6px)] after:top-1/2 after:-translate-y-1/2",
  right: "after:left-[calc(100%+6px)] after:top-1/2 after:-translate-y-1/2",
}

function Tooltip({
  content,
  side = "top",
  disabled = false,
  className,
  children,
  ...props
}: TooltipProps) {
  const label = typeof content === "string" ? content : undefined
  return (
    <span
      data-tooltip={disabled ? undefined : label}
      className={cn(
        "relative inline-flex",
        !disabled && "hover:after:opacity-100",
        "after:pointer-events-none after:absolute after:whitespace-nowrap after:bg-foreground after:px-2 after:py-1 after:text-[11px] after:font-medium after:leading-none after:text-background after:opacity-0 after:transition-opacity after:content-[attr(data-tooltip)]",
        !disabled && POSITION_CLASS[side],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Tooltip }

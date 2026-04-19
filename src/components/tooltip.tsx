import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

type TooltipProps = React.ComponentProps<"span"> & {
  content: React.ReactNode
  side?: "top" | "bottom"
}

function Tooltip({ content, side = "top", className, children, ...props }: TooltipProps) {
  return (
    <span
      data-tooltip={typeof content === "string" ? content : undefined}
      className={cn(
        "relative inline-flex",
        "hover:after:opacity-100",
        "after:pointer-events-none after:absolute after:left-1/2 after:-translate-x-1/2 after:whitespace-nowrap after:bg-foreground after:px-2 after:py-1 after:text-[11px] after:font-medium after:leading-none after:text-background after:opacity-0 after:transition-opacity after:content-[attr(data-tooltip)]",
        side === "top" ? "after:bottom-[calc(100%+6px)]" : "after:top-[calc(100%+6px)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Tooltip }

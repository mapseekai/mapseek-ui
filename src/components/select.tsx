import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")"

function Select({ className, style, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-8 cursor-pointer appearance-none border border-border bg-background py-0 pl-2 pr-6 text-xs font-medium text-foreground outline-none transition-colors",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      style={{
        backgroundImage: chevron,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 6px center",
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }

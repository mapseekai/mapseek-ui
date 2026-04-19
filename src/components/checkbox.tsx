import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "peer relative h-3.5 w-3.5 shrink-0 cursor-pointer appearance-none border border-border bg-background transition-colors",
        "checked:bg-primary checked:border-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none",
        "after:absolute after:inset-0 after:grid after:place-items-center after:text-[10px] after:text-primary-foreground after:content-[''] checked:after:content-['✓']",
        className
      )}
      {...props}
    />
  )
}

export { Checkbox }

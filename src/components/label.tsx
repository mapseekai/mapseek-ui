import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "block text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Label }

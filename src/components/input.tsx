import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-7 w-full min-w-0 border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-[color,box-shadow,border] outline-none placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-xs file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }

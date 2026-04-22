import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

/**
 * shadcn Skeleton — a muted pulsing block used to stand in for text,
 * rows, or cards while data is loading. Width/height are consumer
 * responsibilities via className or inline style.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse bg-muted/70", className)}
      {...props}
    />
  )
}

export { Skeleton }

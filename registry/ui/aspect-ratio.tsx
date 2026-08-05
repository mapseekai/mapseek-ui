import type * as React from "react"

import { cn } from "@/registry/lib/utils"

function AspectRatio({
  ratio = 1,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio?: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ ...style, aspectRatio: ratio }}
      className={cn("relative w-full overflow-hidden", className)}
      {...props}
    />
  )
}

export { AspectRatio }

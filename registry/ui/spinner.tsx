import { IconLoader } from "@tabler/icons-react"
import type * as React from "react"

import { cn } from "@/registry/lib/utils"

type SpinnerProps = React.ComponentProps<typeof IconLoader> & {
  label?: string
}

function Spinner({ className, label, "aria-label": ariaLabel, ...props }: SpinnerProps) {
  const accessibleLabel = label ?? ariaLabel

  return (
    <IconLoader
      data-slot="spinner"
      role={accessibleLabel ? "status" : undefined}
      aria-label={accessibleLabel}
      aria-hidden={accessibleLabel ? undefined : true}
      focusable="false"
      className={cn("size-4 animate-spin motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export { Spinner, type SpinnerProps }

import { IconSelector } from "@tabler/icons-react"
import type * as React from "react"

import { cn } from "@/registry/lib/utils"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "default" }

function NativeSelect({ className, size = "default", ...props }: NativeSelectProps) {
  return (
    <div
      data-slot="native-select-wrapper"
      data-size={size}
      className={cn("relative w-fit has-disabled:opacity-50", className)}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="appearance-none border border-input bg-input-surface py-1 pe-7 ps-2.5 text-xs outline-none transition-colors hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-(length:--focus-ring-width) focus-visible:ring-ring/20 disabled:pointer-events-none data-[size=default]:h-8 data-[size=sm]:h-7"
        {...props}
      />
      <IconSelector
        data-slot="native-select-icon"
        size={16}
        stroke={1.5}
        className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  )
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }

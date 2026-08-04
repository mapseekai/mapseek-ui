import { Input as InputPrimitive } from "@base-ui/react/input"
import type * as React from "react"

import { cn } from "@/registry/lib/utils"

function ColorInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type="color"
      data-slot="color-input"
      className={cn(
        "size-7 cursor-pointer appearance-none overflow-hidden border border-input bg-transparent p-0 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0",
        className,
      )}
      {...props}
    />
  )
}

export { ColorInput }

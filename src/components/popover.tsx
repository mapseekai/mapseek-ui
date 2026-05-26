import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Popover built on @base-ui/react. Mirrors the dropdown-menu /
 * dialog stylistic choices in this package: square corners, border-first
 * elevation, fade-in/out for open/close (no slide animation to keep things
 * snappy in dense panels).
 *
 * The shadcn-style compound is preserved (Popover / PopoverTrigger /
 * PopoverContent) so consumers can refactor incrementally.
 */

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverPortal = PopoverPrimitive.Portal
const PopoverClose = PopoverPrimitive.Close

type Side = "top" | "bottom" | "left" | "right"
type Align = "start" | "center" | "end"

type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Popup> & {
  align?: Align
  side?: Side
  sideOffset?: number
  alignOffset?: number
}

function PopoverContent({
  className,
  align = "center",
  side = "bottom",
  sideOffset = 6,
  alignOffset = 0,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="z-[1000] outline-none"
      >
        <PopoverPrimitive.Popup
          className={cn(
            "min-w-[160px] border border-border bg-popover p-2 text-popover-foreground shadow-md outline-none",
            "transition-opacity duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverClose,
  PopoverContent,
}

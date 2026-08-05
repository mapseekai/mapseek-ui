import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/registry/lib/utils"
import { Separator } from "@/registry/ui/separator"

const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>[data-slot]]:focus-visible:relative [&>[data-slot]]:focus-visible:z-10",
  {
    variants: {
      orientation: {
        horizontal: "flex-row [&>[data-slot]~[data-slot]]:border-s-0",
        vertical: "flex-col [&>[data-slot]~[data-slot]]:border-t-0",
      },
    },
    defaultVariants: { orientation: "horizontal" },
  },
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-group-text"
      className={cn(
        "flex h-8 items-center border border-border bg-muted px-2.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn("relative self-stretch bg-border", className)}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants }

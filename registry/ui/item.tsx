import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/registry/lib/utils"
import { Separator } from "@/registry/ui/separator"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-group"
      className={cn("flex w-full flex-col border border-border", className)}
      {...props}
    />
  )
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="item-separator" className={cn("my-0", className)} {...props} />
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center gap-3 p-3 text-body-md transition-colors outline-none focus-visible:ring-(length:--focus-ring-width) focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: "bg-background",
        outline: "border border-border bg-background",
        muted: "bg-muted/50",
      },
      size: {
        default: "min-h-12",
        sm: "min-h-10 gap-2 px-2.5 py-2",
        xs: "min-h-8 gap-2 px-2 py-1.5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

function Item({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return (
    <div
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "icon" | "image" }) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        "flex shrink-0 items-center justify-center data-[variant=icon]:size-7 data-[variant=icon]:bg-muted [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("truncate font-medium text-foreground", className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("line-clamp-2 text-body-md text-muted-foreground", className)}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("ms-auto flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn("flex basis-full items-center justify-between", className)}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn("flex basis-full items-center justify-between", className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
}

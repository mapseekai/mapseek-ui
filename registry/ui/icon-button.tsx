"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn } from "@/registry/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/ui/tooltip"

type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl"

type IconButtonProps = Omit<ButtonPrimitive.Props, "aria-label"> & {
  label: string
  tooltip?: boolean | string
  size?: IconButtonSize
  danger?: boolean
}

const sizeClasses: Record<IconButtonSize, string> = {
  xs: "size-6 [&_svg:not([class*='size-'])]:size-3.5",
  sm: "size-7 [&_svg:not([class*='size-'])]:size-4",
  md: "size-8 [&_svg:not([class*='size-'])]:size-4",
  lg: "size-9 [&_svg:not([class*='size-'])]:size-4",
  xl: "size-10 [&_svg:not([class*='size-'])]:size-5",
}

function iconButtonVariants({
  size = "md",
  danger = false,
}: {
  size?: IconButtonSize
  danger?: boolean
} = {}) {
  return cn(
    "grid place-items-center rounded-none border border-transparent transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0",
    "cursor-pointer outline-none focus-visible:border-ring focus-visible:ring-(length:--focus-ring-width) focus-visible:ring-ring/20",
    sizeClasses[size],
    danger
      ? "text-destructive hover:bg-destructive/10"
      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent aria-disabled:hover:text-muted-foreground",
  )
}

function IconButton({
  className,
  label,
  tooltip,
  size = "md",
  danger,
  type = "button",
  ...props
}: IconButtonProps) {
  const button = (
    <ButtonPrimitive
      type={type}
      data-slot="icon-button"
      className={cn(iconButtonVariants({ size, danger }), className)}
      {...props}
      aria-label={label}
    />
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>{tooltip === true ? label : tooltip}</TooltipContent>
    </Tooltip>
  )
}

export { IconButton, type IconButtonSize, iconButtonVariants }

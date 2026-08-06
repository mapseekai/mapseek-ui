import type * as React from "react"
import { cn } from "@/registry/lib/utils"

type IconButtonProps = React.ComponentProps<"button"> & {
  size?: "sm" | "md"
  danger?: boolean
}

function IconButton({
  className,
  size = "md",
  danger,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      data-slot="icon-button"
      className={cn(
        "grid place-items-center border border-transparent transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20",
        size === "sm"
          ? "size-6 [&_svg:not([class*='size-'])]:size-3.5"
          : "size-8 [&_svg:not([class*='size-'])]:size-4",
        danger
          ? "text-destructive hover:bg-destructive/10"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { IconButton }

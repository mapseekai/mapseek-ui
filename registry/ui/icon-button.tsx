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
        "grid place-items-center border border-transparent transition-colors",
        "cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20",
        size === "sm" ? "h-6 w-6" : "h-8 w-8",
        danger
          ? "text-destructive hover:bg-destructive/10"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { IconButton }

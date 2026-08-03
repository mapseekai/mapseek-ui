import type React from "react"
import { cn } from "@/lib/utils"

export type ScrollContainerProps = React.ComponentPropsWithoutRef<"div">

/** Full-size vertically-scrollable container (x-overflow hidden). */
export const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("h-full w-full overflow-y-auto overflow-x-hidden", className)} {...props}>
      {children}
    </div>
  )
}

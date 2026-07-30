import React from "react"
import { cn } from "@/lib/utils"

export type ScrollContainerProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/** Full-size vertically-scrollable container (x-overflow hidden). */
export const ScrollContainer: React.FC<ScrollContainerProps> = ({ children, className, style }) => {
  return (
    <div className={cn("h-full w-full overflow-y-auto overflow-x-hidden", className)} style={style}>
      {children}
    </div>
  )
}

import React from "react"
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import { cn } from "../../lib/utils"

export type CollapserProps = {
  isCollapsed: boolean
  style?: React.CSSProperties
  className?: string
}

/** Caret that flips with collapse state. Pure presentational icon. */
export const Collapser: React.FC<CollapserProps> = ({
  isCollapsed,
  style,
  className,
}) => {
  const Icon = isCollapsed ? IconCaretUpFilled : IconCaretDownFilled
  return <Icon style={style} className={cn("h-5 w-5", className)} />
}

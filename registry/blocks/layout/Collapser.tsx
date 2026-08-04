import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import type React from "react"
import { cn } from "@/lib/utils"

export type CollapserProps = {
  isCollapsed: boolean
  style?: React.CSSProperties
  className?: string
}

/** Caret that flips with collapse state. Pure presentational icon. */
export const Collapser: React.FC<CollapserProps> = ({ isCollapsed, style, className }) => {
  const Icon = isCollapsed ? IconCaretUpFilled : IconCaretDownFilled
  return <Icon style={style} className={cn("size-5", className)} />
}

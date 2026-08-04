import type { IconProps } from "@tabler/icons-react"
import type * as React from "react"

export type LayerEditorGroupSection = {
  id: string
  title: React.ReactNode
  icon?: React.ComponentType<IconProps>
  children: React.ReactNode
  dataWdKey?: string
  className?: string
  headerClassName?: string
  triggerClassName?: string
  contentClassName?: string
}

export type LayerEditorGroupProps = {
  sections: LayerEditorGroupSection[]
  defaultOpenIds?: string[]
  headerHeight?: number
  stickyOffset?: number
  className?: string
  itemClassName?: string
  headerClassName?: string
  triggerClassName?: string
  contentClassName?: string
}

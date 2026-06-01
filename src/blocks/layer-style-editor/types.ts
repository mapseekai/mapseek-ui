import type * as React from "react"
import type { LayerEditorGroupSection } from "../layer-editor-group"

export type LayerStyleEditorAction = {
  id: string
  label: React.ReactNode
  onSelect: () => void
  disabled?: boolean
  variant?: "default" | "destructive"
  dataWdKey?: string
}

export type LayerStyleEditorTab = {
  id: string
  label: React.ReactNode
  sections: LayerEditorGroupSection[]
  groupKey?: React.Key
  contentClassName?: string
}

export type LayerStyleEditorProps = {
  title: React.ReactNode
  tabs: LayerStyleEditorTab[]
  ariaLabel?: string
  dataWdKey?: string
  defaultTabId?: string
  actions?: LayerStyleEditorAction[]
  actionMenuLabel?: string
  actionMenuDataWdKey?: string
  closeLabel?: string
  onClose?: () => void
  className?: string
  headerClassName?: string
  scrollClassName?: string
  footerClassName?: string
}

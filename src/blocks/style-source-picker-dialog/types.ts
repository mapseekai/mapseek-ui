import type * as React from "react"

export type StyleSourcePickerKind = "DATASET" | "TILESET"
export type StyleSourcePickerFilter = "ALL" | StyleSourcePickerKind
export type StyleSourcePickerTypeFilter = "ALL" | "vector" | "raster"
export type StyleSourcePickerViewMode = "card" | "list"

export type StyleSourcePickerOption = {
  key: string
  sourceKind: StyleSourcePickerKind
  sourceUID: string
  sourcePath?: string
  sourceName: string
  sourceURL?: string
  sourceType?: "vector" | "raster"
  mode?: string
  status?: string
  subtitle?: string
}

export type StyleSourcePickerDraft = {
  keyword: string
  sourceFilter: StyleSourcePickerFilter
  typeFilter: StyleSourcePickerTypeFilter
  viewMode: StyleSourcePickerViewMode
  selectedKeys: string[]
}

export type StyleSourcePickerLabels = {
  title: React.ReactNode
  description: React.ReactNode
  searchPlaceholder: string
  sourceFilterLabel: React.ReactNode
  typeFilterLabel: React.ReactNode
  all: React.ReactNode
  dataset: React.ReactNode
  tileset: React.ReactNode
  allTypes: React.ReactNode
  vector: React.ReactNode
  raster: React.ReactNode
  loading: React.ReactNode
  empty: React.ReactNode
  retry: React.ReactNode
  selectedCount: (count: number) => React.ReactNode
  cancel: React.ReactNode
  confirm: React.ReactNode
  confirming: React.ReactNode
  alreadyAdded: React.ReactNode
}

export type StyleSourcePickerDialogProps = {
  open: boolean
  loading: boolean
  options: StyleSourcePickerOption[]
  alreadyAddedKeys: Set<string>
  confirming: boolean
  loadErrorMessage?: React.ReactNode
  confirmErrorMessage?: React.ReactNode
  labels?: Partial<StyleSourcePickerLabels>
  onRetryLoad?: () => void
  onOpenChange: (open: boolean) => void
  onConfirm: (options: StyleSourcePickerOption[]) => void
}

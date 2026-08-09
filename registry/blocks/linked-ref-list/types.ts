import type { ReactNode } from "react"

export type LinkedRefStatusTone = "active" | "draft" | "failed" | "ready"

export type LinkedRefItem = {
  key: string
  name: string
  subtitle?: string
  id?: string
  time?: string
  status?: { label: string; tone: LinkedRefStatusTone }
}

export type LinkedRefKind = "dataset" | "mapset" | "workflow"

export type LinkedRefGroup = {
  key: string
  kind: LinkedRefKind
  title: string
  count: number
  /** "3 个引用" */
  summaryLabel: string
  /** "基于此栅格派生 / 关联的数据集" */
  summary: string
  items: LinkedRefItem[]
}

export type LinkedRefItemAction = {
  label: string
  onAction: (item: LinkedRefItem, group: LinkedRefGroup) => void
}

export type LinkedRefItemActions = {
  open?: LinkedRefItemAction
  copyLink?: LinkedRefItemAction
}

export type LinkedRefListProps = {
  groups: LinkedRefGroup[]
  kindIcons: Record<LinkedRefKind, ReactNode>
  itemActions?: LinkedRefItemActions
}

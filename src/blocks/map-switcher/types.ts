import type * as React from "react"

export interface MapSwitcherItemData {
  id: string
  label: string
  /** 缩略图 URL — Trigger 和 image 模式面板共用 */
  image?: string
  /** 无 image 时的 fallback 颜色（CSS 字符串，如 "var(--cat-1)" 或 "#5c8fa8"） */
  color?: string
}

export interface MapSwitcherProps {
  value?: string
  defaultValue?: string
  onChange?: (id: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** 面板样式，默认 "image" */
  mode?: "button" | "image"
  className?: string
  children: React.ReactNode
}

export interface MapSwitcherContextValue {
  selectedId: string | null
  onSelect: (id: string) => void
  open: boolean
  toggleOpen: () => void
  close: () => void
  mode: "button" | "image"
  registerItem: (data: MapSwitcherItemData) => void
  unregisterItem: (id: string) => void
  getItem: (id: string) => MapSwitcherItemData | undefined
}

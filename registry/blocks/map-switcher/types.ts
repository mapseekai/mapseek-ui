import type * as React from "react"

export interface MapSwitcherItemData {
  id: string
  label: string
  /** Thumbnail URL shared by Trigger and image-mode panels. */
  image?: string
  /** Fallback color when no image is provided (a CSS variable string). */
  color?: string
}

export interface MapSwitcherProps {
  value?: string
  defaultValue?: string
  onChange?: (id: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Panel style; defaults to "image". */
  mode?: "button" | "image"
  className?: string
  children: React.ReactNode
}

export interface MapSwitcherContextValue {
  selectedId: string | null
  onSelect: (id: string) => void
  open: boolean
  toggleOpen: () => void
  mode: "button" | "image"
  registerItem: (data: MapSwitcherItemData) => void
  unregisterItem: (id: string) => void
  getItem: (id: string) => MapSwitcherItemData | undefined
}

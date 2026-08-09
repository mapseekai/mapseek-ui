import type * as React from "react"

export interface MapSwitcherItemData {
  id: string
  label: string
  /** Thumbnail URL shared by the image-variant Trigger and panel items. */
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
  /**
   * "icon": layers-icon trigger with a compact list panel.
   * "image": thumbnail trigger showing the selected basemap, thumbnail grid panel.
   * Defaults to "icon".
   */
  variant?: "icon" | "image"
  children: React.ReactNode
}

export interface MapSwitcherTriggerProps {
  /** Accessible label for the icon-variant trigger (e.g. "Basemap"). */
  label?: string
  className?: string
}

export interface MapSwitcherPanelProps {
  className?: string
  children: React.ReactNode
}

export interface MapSwitcherContextValue {
  selectedId: string | null
  onSelect: (id: string) => void
  variant: "icon" | "image"
  registerItem: (data: MapSwitcherItemData) => void
  unregisterItem: (id: string) => void
  getItem: (id: string) => MapSwitcherItemData | undefined
}

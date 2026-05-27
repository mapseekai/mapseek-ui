import type * as React from "react"

export type LayerGeometry =
  | "point"
  | "polyline"
  | "polygon"
  | "mixed"
  | "raster"

export interface LayerData {
  id: string
  name: string
  visible: boolean
  geometryType: LayerGeometry
  featureCount?: number
  /** e.g. "EPSG:4326" — shown as a small mono badge on the row. */
  crsLabel?: string
  /** Caller-supplied transient flags. Read-only from the block's side. */
  flags?: {
    locked?: boolean
    busy?: boolean
    dirty?: boolean
  }
}

export interface LayerPanelProps {
  layers: LayerData[]
  selectedId?: string | null
  onSelectChange?: (id: string) => void
  onVisibleChange?: (id: string, visible: boolean) => void
  onReorder?: (newOrder: string[]) => void
  onRemove?: (id: string) => void
  onLocate?: (id: string) => void
  onOpenTable?: (id: string) => void
  /** Controlled collapsed state. Omit for uncontrolled (defaults to `defaultCollapsed`). */
  collapsed?: boolean
  /** Initial collapsed state for uncontrolled mode. */
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
  children: React.ReactNode
}

/**
 * Internal context value — exposed via `useLayerPanelContext()` / `useLayerItemContext()`
 * to the compound sub-components. NOT part of the public API.
 */
export interface LayerPanelContextValue {
  layers: LayerData[]
  selectedId: string | null
  onSelectChange: (id: string) => void
  onVisibleChange?: (id: string, visible: boolean) => void
  onReorder?: (order: string[]) => void
  onRemove?: (id: string) => void
  onLocate?: (id: string) => void
  onOpenTable?: (id: string) => void
  isSectionOpen: (layerId: string, sectionId: string) => boolean
  toggleSection: (layerId: string, sectionId: string) => void
  registerSectionDefault: (
    layerId: string,
    sectionId: string,
    open: boolean,
  ) => void
  collapsed: boolean
  toggleCollapsed: () => void
}

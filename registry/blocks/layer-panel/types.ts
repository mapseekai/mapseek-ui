import type * as React from "react"
import type { Button } from "@/components/ui/button"
import type { LayerPanelLabels } from "./labels"

export type LayerGeometry = "point" | "polyline" | "polygon" | "mixed" | "raster"

export interface LayerData {
  id: string
  name: string
  visible: boolean
  geometryType: LayerGeometry
  featureCount?: number
  crsLabel?: string
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
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  labels?: Partial<LayerPanelLabels>
  className?: string
  children: React.ReactNode
}

export interface LayerPanelGroupProps extends React.ComponentProps<"section"> {
  collapsed?: boolean
}

export interface LayerPanelGroupTriggerProps extends React.ComponentProps<typeof Button> {
  expandedLabel?: string
  collapsedLabel?: string
}

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
  registerSectionDefault: (layerId: string, sectionId: string, open: boolean) => void
  collapsed: boolean
  toggleCollapsed: () => void
  labels: LayerPanelLabels
}

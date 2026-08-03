import type * as React from "react"
import type { LayerGeometry } from "../layer-panel/types"
import type { StylePanelLabels } from "./labels"

export interface StyleValue {
  fill?: string
  /** 0-100 */
  opacity?: number
  stroke?: {
    color?: string
    /** px */
    width?: number
  }
  marker?: {
    shape?: "circle" | "square" | "triangle"
    /** px */
    size?: number
  }
}

export interface StylePanelProps {
  geometryType: LayerGeometry
  value: StyleValue
  onChange: (next: StyleValue) => void
  labels?: Partial<StylePanelLabels>
  className?: string
  children: React.ReactNode
}

export interface StylePanelContextValue {
  geometryType: LayerGeometry
  value: StyleValue
  onChange: (next: StyleValue) => void
  labels: StylePanelLabels
}

import type { CoordinateSystemComboboxLabels } from "./labels"

export type CoordinateSystemKind = "geographic" | "projected"

export interface CoordinateSystemItem {
  epsg: string
  name: string
  kind: CoordinateSystemKind
}

export interface CoordinateSystemComboboxProps {
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (epsg: string | null) => void
  extraItems?: CoordinateSystemItem[]
  disabled?: boolean
  className?: string
  labels?: Partial<CoordinateSystemComboboxLabels>
}

import type { CrsPickerLabels } from "./labels"

export type CrsKind = "geographic" | "projected"

export interface CrsItem {
  epsg: string // e.g. "EPSG:4326"
  name: string // e.g. "WGS 84"
  description: string // e.g. "Global standard · longitude/latitude"
  kind: CrsKind
}

export interface CrsPickerProps {
  /** Controlled selected value (EPSG string, e.g. "EPSG:4326"). */
  value?: string
  /** Initial value for uncontrolled mode. */
  defaultValue?: string
  onChange?: (epsg: string) => void
  /**
   * Whitelist of EPSG codes to show from the built-in list.
   * Omit to show all built-in entries. Does NOT restrict extraItems.
   */
  allowedEpsgs?: string[]
  /**
   * Items to append to (or override entries in) the built-in list.
   * If an item shares an epsg with a built-in entry, extraItems wins.
   * Always shown regardless of allowedEpsgs.
   */
  extraItems?: CrsItem[]
  className?: string
  labels?: Partial<CrsPickerLabels>
}

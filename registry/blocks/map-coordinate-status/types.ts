import type { CrsItem } from "../crs-picker"

import type { MapCoordinateStatusLabels } from "./labels"

export interface MapCoordinateStatusReadout {
  key: string
  label: string
  value: string | number
}

export interface MapCoordinateStatusProps {
  /** Controlled CRS label, e.g. "EPSG:4326". */
  crs: string
  /** Current map center in the active CRS. */
  center?: [number, number] | null
  /** Current map zoom level. Preferred for the level readout. */
  zoom?: number | null
  /** Optional scale fallback when zoom is not available. */
  scale?: number | null
  /** Fully custom readouts. When provided, these replace center/zoom rendering. */
  readouts?: MapCoordinateStatusReadout[]
  onCrsChange?: (epsg: string) => void | Promise<void>
  allowedEpsgs?: string[]
  extraItems?: CrsItem[]
  labels?: Partial<MapCoordinateStatusLabels>
  className?: string
  pickerClassName?: string
}

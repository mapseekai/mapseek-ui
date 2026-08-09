import type * as React from "react"

export type PixelFieldType = "INT" | "FLOAT" | "TEXT" | "INDEX" | "COORD" | "ENUM" | "DATE"

export interface PixelField {
  key: string
  type: PixelFieldType
  value: React.ReactNode
  /** Unit suffix shown right-aligned inside the value box (e.g. "m"). */
  unit?: string
  /** Show a lock icon (read-only marker, e.g. band index). */
  locked?: boolean
}

export interface PixelProbeLabels {
  title: string
  copy: string
  copied?: string
  close: string
  prev: string
  next: string
  /** Prefix before the point index in the footer, e.g. "PT". */
  pointPrefix: string
  /** Empty-state copy rendered when no fields are available. */
  empty: string
  /** Assistive label announced for lock-marked fields. */
  locked: string
}

export interface PixelProbeProps {
  fields: PixelField[]
  /** Count chip in the header (e.g. number of probed points). */
  count?: number
  /** 1-based point index shown in the footer ("PT n"). */
  index?: number
  labels: PixelProbeLabels
  onCopy?: () => void
  onClose?: () => void
  onPrev?: () => void
  onNext?: () => void
  className?: string
}

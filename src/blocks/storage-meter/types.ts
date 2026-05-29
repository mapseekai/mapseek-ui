import type { ReactNode } from "react"

/**
 * Storage usage snapshot. Structurally compatible with the app's
 * `StorageEstimateView` (navigator.storage.estimate), kept independent so the
 * block carries no app dependency.
 */
export interface StorageMeterData {
  /** Bytes used by this origin. */
  usage: number
  /** Hard cap granted to this origin. */
  quota: number
  /** quota - usage (bytes); never negative. */
  available: number
  /** Fraction used in [0, 1]. */
  ratio: number
  /** Per-bucket breakdown (browser-dependent). */
  details: {
    fileSystem?: number
    indexedDB?: number
    caches?: number
  }
  /** True when navigator.storage.estimate is unavailable. */
  unsupported: boolean
}

export interface StorageMeterLabels {
  /** Chip text when storage estimation is unsupported. */
  unsupported: string
  /** Tooltip on the unsupported chip. */
  unsupportedHint: string
  /** Popover header. */
  title: string
  /** Refresh button tooltip + aria-label. */
  refresh: string
  /** Popover aria-label. */
  details: string
  /** Stat labels. */
  used: string
  available: string
  quota: string
  usageRate: string
}

export interface StorageMeterProps {
  data: StorageMeterData
  loading?: boolean
  error?: string | null
  /** Maps a raw error message to display text, e.g. (m) => `读取失败：${m}`. */
  errorLabel?: (message: string) => string
  onRefresh?: () => void
  labels: StorageMeterLabels
  /** App-specific footer content (e.g. OPFS isolation notes). */
  footer?: ReactNode
  className?: string
}

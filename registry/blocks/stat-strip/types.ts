import type { ReactNode } from "react"

export type StatItem = {
  label: string
  value: string
  mono?: boolean
  unit?: string // small muted mono unit suffix after the value
  icon?: ReactNode // small icon before the value
  badge?: ReactNode // slot next to the label (caller passes a "pending" badge for no-API fields)
}

export type StatStripProps = { items: StatItem[] }

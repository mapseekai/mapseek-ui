import type { ReactNode } from "react"

export type StatItem = {
  label: string
  value: string
  mono?: boolean
  icon?: ReactNode // small icon before the value
  badge?: ReactNode // slot next to the label (caller passes a "pending" badge for no-API fields)
}

export type StatStripProps = { items: StatItem[] }

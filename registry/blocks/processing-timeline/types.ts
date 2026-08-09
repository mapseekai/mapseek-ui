import type { ReactNode } from "react"

export type TimelineEvent = {
  time?: string
  icon?: ReactNode
  title?: ReactNode // first line (may contain mono chips as JSX)
  text?: ReactNode // detail line (muted)
  tone?: "default" | "error"
  errorText?: ReactNode // red mono line (error cards)
  hint?: ReactNode // muted line under error
  log?: string // when present on an error, enables the caller-owned 日志 action
}

export type TimelineStep = {
  key: string
  label: string
  state?: "done" | "active" | "pending" | "failed"
  status?: string // pill text e.g. "已完成"
  retry?: string // amber pill text e.g. "重试 1 次"
  time?: string // right-aligned timestamp
  duration?: string // right-aligned duration
  progressKind?: "percent" | "indeterminate" | "none"
  percent?: number | null
  message?: ReactNode
  events: TimelineEvent[]
}

export type ProcessingTimelineLabels = {
  emptyTitle: string
  emptyDescription: string
  log: string
}

export type ProcessingTimelineProps = {
  steps: TimelineStep[]
  labels: ProcessingTimelineLabels
  /** Lets the caller open a log dialog or panel for the selected error log. */
  onLogClick?: (text: string) => void
}

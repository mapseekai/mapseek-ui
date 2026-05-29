export type TimelineEvent = {
  time?: string
  text: string
  mono?: boolean
  variant?: "error" // renders a destructive box
  log?: string // when present, show inline log/copy buttons
}

export type TimelineStep = {
  key: string
  label: string
  status?: string
  duration?: string
  retry?: string
  state?: "done" | "active" | "pending" | "failed"
  events: TimelineEvent[]
}

export type ProcessingTimelineLabels = { copy: string; log: string }

export type ProcessingTimelineProps = {
  steps: TimelineStep[]
  labels: ProcessingTimelineLabels
  onCopyLog?: (text: string) => void
}

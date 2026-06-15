export type NotificationCenterSourceType = "DATASET" | "TILESET" | string

export type NotificationCenterStatusTone = "processing" | "success" | "failed" | "idle"

export type NotificationCenterItem = {
  key: string
  title: string
  description: string
  sourceUid: string
  sourceType: NotificationCenterSourceType
  sourceLabel: string
  statusLabel: string
  statusTone: NotificationCenterStatusTone
}

export type NotificationCenterLabels = {
  trigger: string
  title: string
  clearAll: string
  clearOne: string
  emptyTitle: string
  emptyDescription: string
  loadingTitle: string
  errorTitle: string
  errorDescription: string
  retry: string
  streamActive: string
  streamIdle: string
  total: string
  processing: string
  completed: string
  failed: string
}

export type NotificationCenterProps = {
  items: NotificationCenterItem[]
  labels: NotificationCenterLabels
  isLoading?: boolean
  isError?: boolean
  streamActive?: boolean
  onRetry?: () => void
  onClearAll?: () => void
  onClearItem?: (item: NotificationCenterItem) => void
}

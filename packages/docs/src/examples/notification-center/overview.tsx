import {
  NotificationCenter,
  type NotificationCenterItem,
  type NotificationCenterLabels,
} from "@registry/blocks/notification-center"
import { Button } from "@registry/ui/button"
import { useState } from "react"

const initialItems: NotificationCenterItem[] = [
  {
    key: "DATASET:dataset.8f12-a91c",
    title: "Raster · Yangtze NDVI 2026Q2",
    description: "landsat_ndvi_2026q2.tif · processing",
    sourceUid: "dataset.8f12-a91c",
    sourceType: "DATASET",
    sourceLabel: "Dataset",
    statusLabel: "Processing",
    statusTone: "processing",
  },
  {
    key: "DATASET:dataset.44cb-910e",
    title: "Vector · road centerlines",
    description: "roads_osm_3857.geojson · completed",
    sourceUid: "dataset.44cb-910e",
    sourceType: "DATASET",
    sourceLabel: "Dataset",
    statusLabel: "Completed",
    statusTone: "success",
  },
  {
    key: "TILESET:tileset.77e2-5db0",
    title: "PMTiles · boundary tiles",
    description: "admin_boundary.pmtiles · failed",
    sourceUid: "tileset.77e2-5db0",
    sourceType: "TILESET",
    sourceLabel: "Tileset",
    statusLabel: "Failed",
    statusTone: "failed",
  },
]

export type NotificationCenterDemoLabels = NotificationCenterLabels & {
  readonly reset: string
  readonly loadingMode: string
  readonly errorMode: string
  readonly emptyMode: string
  readonly statusCleared: string
  readonly statusRetry: string
}

export const zhNotificationCenterLabels = {
  trigger: "通知中心",
  title: "通知中心",
  clearAll: "全部清除",
  clearOne: "清除",
  emptyTitle: "暂无新通知",
  emptyDescription: "处理任务完成后会显示在这里。",
  loadingTitle: "正在加载通知",
  errorTitle: "NOTIFICATION_LOAD_FAILED",
  errorDescription: "通知列表加载失败，请重试。",
  retry: "重试",
  streamActive: "LIVE",
  streamIdle: "IDLE",
  total: "TOTAL",
  processing: "处理中",
  completed: "已完成",
  failed: "失败",
  reset: "恢复通知",
  loadingMode: "加载态",
  errorMode: "错误态",
  emptyMode: "空态",
  statusCleared: "已清除",
  statusRetry: "已重试",
} satisfies NotificationCenterDemoLabels

export const enNotificationCenterLabels = {
  trigger: "Notification center",
  title: "Notification center",
  clearAll: "Clear all",
  clearOne: "Clear",
  emptyTitle: "No new notifications",
  emptyDescription: "Completed processing jobs appear here.",
  loadingTitle: "Loading notifications",
  errorTitle: "NOTIFICATION_LOAD_FAILED",
  errorDescription: "Notification list failed to load. Retry.",
  retry: "Retry",
  streamActive: "LIVE",
  streamIdle: "IDLE",
  total: "TOTAL",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  reset: "Restore notifications",
  loadingMode: "Loading state",
  errorMode: "Error state",
  emptyMode: "Empty state",
  statusCleared: "Cleared",
  statusRetry: "Retried",
} satisfies NotificationCenterDemoLabels

type Mode = "items" | "loading" | "error" | "empty"

export function NotificationCenterDemo({
  labels,
}: {
  readonly labels: NotificationCenterDemoLabels
}) {
  const [mode, setMode] = useState<Mode>("items")
  const [items, setItems] = useState(initialItems)
  const [status, setStatus] = useState("items")

  function restoreItems() {
    setMode("items")
    setItems(initialItems)
    setStatus("items")
  }

  return (
    <div data-demo="notification-center" className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="notification-center-reset"
          onClick={restoreItems}
        >
          {labels.reset}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="notification-center-loading"
          onClick={() => {
            setMode("loading")
            setStatus("loading")
          }}
        >
          {labels.loadingMode}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="notification-center-error"
          onClick={() => {
            setMode("error")
            setStatus("error")
          }}
        >
          {labels.errorMode}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="notification-center-empty"
          onClick={() => {
            setMode("empty")
            setItems([])
            setStatus("empty")
          }}
        >
          {labels.emptyMode}
        </Button>
        <span
          data-demo-status="notification-center"
          className="self-center font-mono text-xs text-muted-foreground"
        >
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between gap-6 border border-border bg-background p-4">
        <span className="text-xs text-muted-foreground">{labels.title}</span>
        <NotificationCenter
          items={mode === "empty" ? [] : items}
          labels={labels}
          streamActive={mode === "items"}
          isLoading={mode === "loading"}
          isError={mode === "error"}
          onRetry={() => setStatus(labels.statusRetry)}
          onClearAll={() => {
            setItems([])
            setStatus(labels.statusCleared)
          }}
          onClearItem={(item) => {
            setItems((current) => current.filter((candidate) => candidate.key !== item.key))
            setStatus(`${labels.statusCleared}: ${item.sourceUid}`)
          }}
        />
      </div>
    </div>
  )
}

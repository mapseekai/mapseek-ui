import {
  NotificationCenter,
  type NotificationCenterItem,
} from "@registry/blocks/notification-center"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
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
    itemsMode: "通知列表",
    loadingMode: "加载态",
    errorMode: "错误态",
    emptyMode: "空态",
    statusCleared: "已清除",
    statusRetry: "已重试",
    items: [
      {
        key: "DATASET:dataset.8f12-a91c",
        title: "栅格 · 长江 NDVI 2026Q2",
        description: "landsat_ndvi_2026q2.tif · 处理中",
        sourceUid: "dataset.8f12-a91c",
        sourceType: "DATASET",
        sourceLabel: "数据集",
        statusLabel: "处理中",
        statusTone: "processing",
      },
      {
        key: "DATASET:dataset.44cb-910e",
        title: "矢量 · 道路中心线",
        description: "roads_osm_3857.geojson · 已完成",
        sourceUid: "dataset.44cb-910e",
        sourceType: "DATASET",
        sourceLabel: "数据集",
        statusLabel: "已完成",
        statusTone: "success",
      },
      {
        key: "TILESET:tileset.77e2-5db0",
        title: "PMTiles · 边界瓦片",
        description: "admin_boundary.pmtiles · 失败",
        sourceUid: "tileset.77e2-5db0",
        sourceType: "TILESET",
        sourceLabel: "瓦片集",
        statusLabel: "失败",
        statusTone: "failed",
      },
    ] satisfies NotificationCenterItem[],
  },
  en: {
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
    itemsMode: "Notification list",
    loadingMode: "Loading state",
    errorMode: "Error state",
    emptyMode: "Empty state",
    statusCleared: "Cleared",
    statusRetry: "Retried",
    items: [
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
    ] satisfies NotificationCenterItem[],
  },
}

type Mode = "items" | "loading" | "error" | "empty"

export function NotificationCenterDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [mode, setMode] = useState<Mode>("items")
  const [items, setItems] = useState<NotificationCenterItem[]>([...demoLabels.items])
  const [status, setStatus] = useState<string>(demoLabels.itemsMode)

  function restoreItems() {
    setMode("items")
    setItems([...demoLabels.items])
    setStatus(demoLabels.itemsMode)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="notification-center-reset"
          onClick={restoreItems}
        >
          {demoLabels.reset}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="notification-center-loading"
          onClick={() => {
            setMode("loading")
            setStatus(demoLabels.loadingMode)
          }}
        >
          {demoLabels.loadingMode}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="notification-center-error"
          onClick={() => {
            setMode("error")
            setStatus(demoLabels.errorMode)
          }}
        >
          {demoLabels.errorMode}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="notification-center-empty"
          onClick={() => {
            setMode("empty")
            setItems([])
            setStatus(demoLabels.emptyMode)
          }}
        >
          {demoLabels.emptyMode}
        </Button>
        <span
          data-demo-status="notification-center"
          className="self-center font-mono text-xs text-muted-foreground"
        >
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between gap-6 border border-border bg-background p-4">
        <span className="text-xs text-muted-foreground">{demoLabels.title}</span>
        <NotificationCenter
          items={mode === "empty" ? [] : items}
          labels={demoLabels}
          streamActive={mode === "items"}
          isLoading={mode === "loading"}
          isError={mode === "error"}
          onRetry={() => setStatus(demoLabels.statusRetry)}
          onClearAll={() => {
            setItems([])
            setStatus(demoLabels.statusCleared)
          }}
          onClearItem={(item) => {
            setItems((current) => current.filter((candidate) => candidate.key !== item.key))
            setStatus(`${demoLabels.statusCleared}: ${item.sourceUid}`)
          }}
        />
      </div>
    </div>
  )
}

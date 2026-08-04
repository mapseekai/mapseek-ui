import { LoadingScreen } from "@registry/blocks/loading-screen"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    loading: "加载中...",
    map: "正在加载地图",
    tiles: "正在初始化图层与样式",
    refresh: "正在刷新资源",
    refreshDescription: "正在同步最新图层数据",
    waiting: "正在等待服务",
    waitingDescription: "服务准备完成后将自动继续",
    toggle: "切换说明",
    status: "当前说明",
  },
  en: {
    loading: "Loading...",
    map: "Loading map",
    tiles: "Initializing layers and styles",
    refresh: "Refreshing resources",
    refreshDescription: "Synchronizing the latest layer data",
    waiting: "Waiting for service",
    waitingDescription: "Loading will continue when the service is ready",
    toggle: "Toggle detail",
    status: "Current detail",
  },
}

export function LoadingScreenDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [detail, setDetail] = useState(true)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="loading-screen-toggle"
          onClick={() => setDetail((current) => !current)}
        >
          {demoLabels.toggle}
        </Button>
        <span data-demo-status="loading-screen" className="font-mono text-xs text-muted-foreground">
          {demoLabels.status}: {detail ? demoLabels.tiles : demoLabels.loading}
        </span>
      </div>
      <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        <div className="h-56 border border-border">
          <LoadingScreen
            text={demoLabels.map}
            description={detail ? demoLabels.tiles : undefined}
            labels={{ loading: demoLabels.loading }}
            variant="spinner"
          />
        </div>
        <div className="h-56 border border-border">
          <LoadingScreen
            text={demoLabels.refresh}
            description={detail ? demoLabels.refreshDescription : undefined}
            labels={{ loading: demoLabels.loading }}
            variant="refresh"
          />
        </div>
        <div className="h-56 border border-border">
          <LoadingScreen
            text={demoLabels.waiting}
            description={detail ? demoLabels.waitingDescription : undefined}
            labels={{ loading: demoLabels.loading }}
            variant="pulse"
          />
        </div>
      </div>
    </div>
  )
}

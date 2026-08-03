import { LoadingScreen, type LoadingScreenLabels } from "@registry/blocks/loading-screen"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    loading: "加载中...",
    map: "正在加载地图",
    tiles: "正在初始化图层与样式",
    toggle: "切换说明",
    status: "当前说明",
  },
  en: {
    loading: "Loading...",
    map: "Loading map",
    tiles: "Initializing layers and styles",
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
      <div className="h-64 max-w-2xl border border-border">
        <LoadingScreen
          text={demoLabels.map}
          description={detail ? demoLabels.tiles : undefined}
          labels={{ loading: demoLabels.loading }}
        />
      </div>
    </div>
  )
}

import { LoadingScreen, type LoadingScreenLabels } from "@registry/blocks/loading-screen"
import { Button } from "@registry/ui/button"
import { useState } from "react"

export type LoadingScreenDemoLabels = LoadingScreenLabels & {
  readonly map: string
  readonly tiles: string
  readonly toggle: string
  readonly status: string
}

export const zhLoadingScreenLabels = {
  loading: "加载中...",
  map: "正在加载地图",
  tiles: "正在初始化图层与样式",
  toggle: "切换说明",
  status: "当前说明",
} satisfies LoadingScreenDemoLabels

export const enLoadingScreenLabels = {
  loading: "Loading...",
  map: "Loading map",
  tiles: "Initializing layers and styles",
  toggle: "Toggle detail",
  status: "Current detail",
} satisfies LoadingScreenDemoLabels

export function LoadingScreenDemo({ labels }: { readonly labels: LoadingScreenDemoLabels }) {
  const [detail, setDetail] = useState(true)

  return (
    <div data-demo="loading-screen" className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="loading-screen-toggle"
          onClick={() => setDetail((current) => !current)}
        >
          {labels.toggle}
        </Button>
        <span data-demo-status="loading-screen" className="font-mono text-xs text-muted-foreground">
          {labels.status}: {detail ? labels.tiles : labels.loading}
        </span>
      </div>
      <div className="h-64 max-w-2xl border border-border">
        <LoadingScreen
          text={labels.map}
          description={detail ? labels.tiles : undefined}
          labels={{ loading: labels.loading }}
        />
      </div>
    </div>
  )
}

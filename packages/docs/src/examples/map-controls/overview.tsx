import { MapControls, type MapControlsLabels } from "@registry/blocks/map-controls"
import { useState } from "react"

export type MapControlsDemoLabels = {
  readonly mapPlaceholder: string
  readonly idle: string
  readonly actions: {
    readonly zoomIn: string
    readonly zoomOut: string
    readonly locate: string
    readonly home: string
  }
  readonly controls: MapControlsLabels
}

export const zhMapControlsLabels = {
  mapPlaceholder: "地图背景占位",
  idle: "尚未触发",
  actions: {
    zoomIn: "已放大",
    zoomOut: "已缩小",
    locate: "已定位",
    home: "已归位",
  },
  controls: { zoomIn: "放大", zoomOut: "缩小", locate: "定位", home: "归位" },
} satisfies MapControlsDemoLabels

export const enMapControlsLabels = {
  mapPlaceholder: "Map background placeholder",
  idle: "No action yet",
  actions: {
    zoomIn: "Zoomed in",
    zoomOut: "Zoomed out",
    locate: "Located",
    home: "Returned home",
  },
  controls: { zoomIn: "Zoom in", zoomOut: "Zoom out", locate: "Locate", home: "Home" },
} satisfies MapControlsDemoLabels

export function MapControlsDemo({ labels }: { readonly labels: MapControlsDemoLabels }) {
  const [status, setStatus] = useState(labels.idle)

  return (
    <div data-demo="map-controls" className="flex w-full flex-col gap-2">
      <div className="relative h-[320px] overflow-hidden border border-border bg-muted/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />
        <span className="absolute top-3 left-3 font-mono text-[10px] text-muted-foreground">
          {labels.mapPlaceholder}
        </span>
        <MapControls
          className="absolute right-4 bottom-4"
          labels={labels.controls}
          onZoomIn={() => setStatus(labels.actions.zoomIn)}
          onZoomOut={() => setStatus(labels.actions.zoomOut)}
          onLocate={() => setStatus(labels.actions.locate)}
          onHome={() => setStatus(labels.actions.home)}
        />
      </div>
      <span data-demo-status="map-controls" className="font-mono text-xs text-muted-foreground">
        {status}
      </span>
    </div>
  )
}

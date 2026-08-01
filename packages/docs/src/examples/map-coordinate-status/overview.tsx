import {
  MapCoordinateStatus,
  type MapCoordinateStatusLabels,
} from "@registry/blocks/map-coordinate-status"
import { Button } from "@registry/ui/button"
import { useState } from "react"

type DemoView = {
  readonly center: [number, number]
  readonly zoom: number
}

const geoView: DemoView = { center: [121.4737, 31.2304], zoom: 14 }
const projectedView: DemoView = { center: [13522425.02, 3662700.31], zoom: 11 }
const maplibreCrsOptions = ["EPSG:3857", "EPSG:4326"]

export type MapCoordinateStatusDemoLabels = {
  readonly mapPlaceholder: string
  readonly updateView: string
  readonly toggleCrs: string
  readonly statusPrefix: string
  readonly statusChanged: string
  readonly statusViewUpdated: string
  readonly copyReadout: string
  readonly copiedReadout: string
  readonly coordinateStatus: Partial<MapCoordinateStatusLabels>
}

export const zhMapCoordinateStatusLabels = {
  mapPlaceholder: "地图背景占位",
  updateView: "外部更新 view",
  toggleCrs: "外部切换 CRS",
  statusPrefix: "当前",
  statusChanged: "已切换 CRS",
  statusViewUpdated: "已更新 view",
  copyReadout: "复制读数",
  copiedReadout: "已复制读数",
  coordinateStatus: {
    switchCrs: "切换坐标参考系",
    longitude: "经度",
    latitude: "纬度",
    x: "X",
    y: "Y",
    zoom: "层级",
    scale: "比例尺",
  },
} satisfies MapCoordinateStatusDemoLabels

export const enMapCoordinateStatusLabels = {
  mapPlaceholder: "Map background placeholder",
  updateView: "Update view externally",
  toggleCrs: "Toggle CRS externally",
  statusPrefix: "Current",
  statusChanged: "CRS changed",
  statusViewUpdated: "View updated",
  copyReadout: "Copy readout",
  copiedReadout: "Readout copied",
  coordinateStatus: {
    switchCrs: "Switch coordinate reference system",
    longitude: "Lon",
    latitude: "Lat",
    x: "X",
    y: "Y",
    zoom: "Zoom",
    scale: "Scale",
  },
} satisfies MapCoordinateStatusDemoLabels

export function MapCoordinateStatusDemo({
  labels,
}: {
  readonly labels: MapCoordinateStatusDemoLabels
}) {
  const [crs, setCrs] = useState("EPSG:3857")
  const [view, setView] = useState<DemoView>(projectedView)
  const [status, setStatus] = useState(`${labels.statusPrefix}: EPSG:3857`)

  function applyCrs(nextCrs: string) {
    setCrs(nextCrs)
    setView(nextCrs === "EPSG:3857" ? projectedView : geoView)
    setStatus(`${labels.statusChanged}: ${nextCrs}`)
  }

  return (
    <div data-demo="map-coordinate-status" className="flex flex-col gap-4">
      <div className="relative h-[160px] overflow-hidden border border-border bg-muted">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />
        <span className="absolute top-3 left-3 font-mono text-[10px] text-muted-foreground">
          {labels.mapPlaceholder}
        </span>
        <MapCoordinateStatus
          className="absolute right-4 bottom-4 z-10"
          crs={crs}
          center={view.center}
          zoom={view.zoom}
          allowedEpsgs={maplibreCrsOptions}
          labels={labels.coordinateStatus}
          onCrsChange={applyCrs}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          data-demo-action="map-coordinate-status-update-view"
          variant="outline"
          className="h-7 rounded-none px-2 text-xs"
          onClick={() => {
            setView((current) => ({
              center: [current.center[0] + 0.0123, current.center[1] + 0.0061],
              zoom: Math.min(current.zoom + 0.5, 18),
            }))
            setStatus(labels.statusViewUpdated)
          }}
        >
          {labels.updateView}
        </Button>
        <Button
          type="button"
          data-demo-action="map-coordinate-status-toggle-crs"
          variant="outline"
          className="h-7 rounded-none px-2 text-xs"
          onClick={() => applyCrs(crs === "EPSG:3857" ? "EPSG:4326" : "EPSG:3857")}
        >
          {labels.toggleCrs}
        </Button>
        <Button
          type="button"
          data-demo-action="map-coordinate-status-copy"
          variant="outline"
          className="h-7 rounded-none px-2 text-xs"
          onClick={() => setStatus(`${labels.copiedReadout}: ${crs}`)}
        >
          {labels.copyReadout}
        </Button>
        <span
          data-demo-status="map-coordinate-status"
          className="font-mono text-xs text-muted-foreground"
        >
          {status}
        </span>
      </div>
    </div>
  )
}

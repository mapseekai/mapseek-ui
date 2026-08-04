import { JsonViewer } from "@registry/ui/json-viewer"
import type { LocalizedDemoProps } from "./types"

const feature = {
  type: "Feature",
  properties: {
    name: "Mapseek",
    category: "GIS",
    active: true,
    versions: [1, 2, 3],
  },
  geometry: { type: "Point", coordinates: [116.397, 39.908] },
}

export function JsonViewerOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <div className="max-w-3xl">
      <JsonViewer data={feature} title="GeoJSON Feature" defaultExpanded showColorIndent />
    </div>
  )
}

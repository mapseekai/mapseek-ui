import { JsonViewer } from "@registry/ui/json-viewer"

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

export function JsonViewerOverviewDemo() {
  return (
    <div className="max-w-3xl" data-demo="json-viewer-overview">
      <JsonViewer data={feature} title="GeoJSON Feature" defaultExpanded showColorIndent />
    </div>
  )
}

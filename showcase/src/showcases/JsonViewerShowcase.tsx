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

const labels = {
  "zh-CN": {
    expandAll: "全部展开",
    collapseAll: "全部收起",
    copy: "复制 GeoJSON",
    copied: "已复制 GeoJSON",
    item: "项",
    items: "项",
  },
  en: {
    expandAll: "Expand all",
    collapseAll: "Collapse all",
    copy: "Copy GeoJSON",
    copied: "Copied GeoJSON",
    item: "item",
    items: "items",
  },
}

export function JsonViewerOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="max-w-3xl">
      <JsonViewer
        data={feature}
        title="GeoJSON Feature"
        defaultExpanded
        showColorIndent
        collapseOn="doubleClick"
        expandAllLabel={demoLabels.expandAll}
        collapseAllLabel={demoLabels.collapseAll}
        copyLabel={demoLabels.copy}
        copiedLabel={demoLabels.copied}
        itemLabel={demoLabels.item}
        itemsLabel={demoLabels.items}
      />
    </div>
  )
}

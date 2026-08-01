import { type LayerData, LayerPanel } from "@registry/blocks/layer-panel"
import type { LayerPanelLabels } from "@registry/blocks/layer-panel/labels"
import { IconFilter, IconPaint } from "@tabler/icons-react"
import { useState } from "react"

type LayerPanelBasicLayer = LayerData & {
  readonly styleSummary: string
  readonly filterSummary: string
}

export type LayerPanelBasicDemoLabels = {
  readonly title: string
  readonly addLayer: string
  readonly style: string
  readonly filter: string
  readonly emptyTitle: string
  readonly emptyDescription: string
  readonly visibilityOnStatus: string
  readonly visibilityOffStatus: string
  readonly selectedStatus: string
  readonly locatedStatus: string
  readonly tableStatus: string
  readonly removedStatus: string
  readonly styleOpacity: string
  readonly filterMode: string
  readonly layerPanel: Partial<LayerPanelLabels>
}

export type LayerPanelBasicDemoProps = {
  readonly labels: LayerPanelBasicDemoLabels
}

export const zhLayerPanelBasicLabels = {
  title: "工程图层",
  addLayer: "添加图层",
  style: "样式",
  filter: "过滤器",
  emptyTitle: "暂无图层",
  emptyDescription: "添加图层后会在这里显示。",
  visibilityOnStatus: "已显示",
  visibilityOffStatus: "已隐藏",
  selectedStatus: "已选中",
  locatedStatus: "定位图层",
  tableStatus: "打开属性表",
  removedStatus: "已删除",
  styleOpacity: "不透明度",
  filterMode: "当前过滤条件",
  layerPanel: {
    addLayer: "添加图层",
    point: "点",
    polyline: "线",
    polygon: "面",
    mixed: "混合",
    raster: "栅格",
    features: "要素",
    locate: "定位",
    zoomToLayer: "缩放到图层",
    attributeTable: "属性表",
    delete: "删除",
  },
} satisfies LayerPanelBasicDemoLabels

export const enLayerPanelBasicLabels = {
  title: "Project layers",
  addLayer: "Add layer",
  style: "Style",
  filter: "Filter",
  emptyTitle: "No layers",
  emptyDescription: "Added layers will appear here.",
  visibilityOnStatus: "Shown",
  visibilityOffStatus: "Hidden",
  selectedStatus: "Selected",
  locatedStatus: "Locate layer",
  tableStatus: "Open attribute table",
  removedStatus: "Removed",
  styleOpacity: "Opacity",
  filterMode: "Current filter",
  layerPanel: {
    addLayer: "Add layer",
    point: "Point",
    polyline: "Line",
    polygon: "Polygon",
    mixed: "Mixed",
    raster: "Raster",
    features: "features",
    locate: "Locate",
    zoomToLayer: "Zoom to layer",
    attributeTable: "Attribute table",
    delete: "Delete",
  },
} satisfies LayerPanelBasicDemoLabels

const initialLayers: LayerPanelBasicLayer[] = [
  {
    id: "zoning",
    name: "Zoning parcels",
    visible: true,
    geometryType: "polygon",
    featureCount: 1284,
    crsLabel: "EPSG:4326",
    styleSummary: "Fill #4f8f6a, stroke 1px",
    filterSummary: "land_use IN residential, civic",
  },
  {
    id: "transit",
    name: "Transit corridors",
    visible: true,
    geometryType: "polyline",
    featureCount: 532,
    crsLabel: "EPSG:3857",
    styleSummary: "Stroke #e36f48, width 2px",
    filterSummary: "status = active",
  },
  {
    id: "assets",
    name: "Field assets",
    visible: false,
    geometryType: "point",
    featureCount: 86,
    crsLabel: "EPSG:4326",
    styleSummary: "Circle marker, size 6",
    filterSummary: "inspection_due = true",
  },
  {
    id: "terrain",
    name: "Terrain DEM",
    visible: true,
    geometryType: "raster",
    crsLabel: "EPSG:3857",
    styleSummary: "Opacity 82%",
    filterSummary: "Raster layers do not expose feature filters",
  },
]

export function LayerPanelBasicDemo({ labels }: LayerPanelBasicDemoProps) {
  const [layers, setLayers] = useState<LayerPanelBasicLayer[]>(initialLayers)
  const [selectedId, setSelectedId] = useState(initialLayers[0]?.id ?? "")
  const [status, setStatus] = useState(labels.selectedStatus)

  const handleSelectChange = (id: string) => {
    setSelectedId(id)
    setStatus(`${labels.selectedStatus}: ${layers.find((layer) => layer.id === id)?.name ?? id}`)
  }

  const handleVisibleChange = (id: string, visible: boolean) => {
    setLayers((current) =>
      current.map((layer) => (layer.id === id ? { ...layer, visible } : layer)),
    )
    const layerName = layers.find((layer) => layer.id === id)?.name ?? id
    setStatus(`${visible ? labels.visibilityOnStatus : labels.visibilityOffStatus}: ${layerName}`)
  }

  const handleRemove = (id: string) => {
    setLayers((current) => current.filter((layer) => layer.id !== id))
    setStatus(`${labels.removedStatus}: ${layers.find((layer) => layer.id === id)?.name ?? id}`)
    if (selectedId === id) setSelectedId(layers.find((layer) => layer.id !== id)?.id ?? "")
  }

  const handleReorder = (order: string[]) => {
    setLayers((current) => {
      const byId = new Map(current.map((layer) => [layer.id, layer] as const))
      return order.flatMap((id) => {
        const layer = byId.get(id)
        return layer ? [layer] : []
      })
    })
  }

  return (
    <div data-demo="layer-panel-basic" className="flex w-full flex-col items-center gap-3">
      <LayerPanel
        layers={layers}
        selectedId={selectedId}
        onSelectChange={handleSelectChange}
        onVisibleChange={handleVisibleChange}
        onReorder={handleReorder}
        onRemove={handleRemove}
        onLocate={(id) => setStatus(`${labels.locatedStatus}: ${id}`)}
        onOpenTable={(id) => setStatus(`${labels.tableStatus}: ${id}`)}
        labels={labels.layerPanel}
        className="h-[430px] w-full max-w-[360px]"
      >
        <LayerPanel.Header>
          <LayerPanel.Title>{labels.title}</LayerPanel.Title>
          <LayerPanel.Count />
          <LayerPanel.Actions>
            <LayerPanel.AddButton onClick={() => setStatus(labels.addLayer)}>
              {labels.addLayer}
            </LayerPanel.AddButton>
          </LayerPanel.Actions>
        </LayerPanel.Header>

        <LayerPanel.List>
          {layers.map((layer) => (
            <LayerPanel.Item key={layer.id} layer={layer}>
              <LayerPanel.Section id="style" icon={IconPaint} label={labels.style} defaultOpen>
                <div className="space-y-1 text-[11px] leading-5 text-muted-foreground">
                  <p className="m-0 font-medium text-foreground">{layer.styleSummary}</p>
                  <label className="flex items-center justify-between gap-3">
                    <span>{labels.styleOpacity}</span>
                    <input
                      data-demo="layer-panel-opacity"
                      className="w-28 accent-primary"
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={layer.geometryType === "raster" ? 82 : 72}
                    />
                  </label>
                </div>
              </LayerPanel.Section>

              <LayerPanel.Section
                id="filter"
                icon={IconFilter}
                label={labels.filter}
                hidden={layer.geometryType === "raster"}
              >
                <div className="space-y-1 text-[11px] leading-5 text-muted-foreground">
                  <p className="m-0 font-medium text-foreground">{labels.filterMode}</p>
                  <p className="m-0 break-words font-mono">{layer.filterSummary}</p>
                </div>
              </LayerPanel.Section>
            </LayerPanel.Item>
          ))}
        </LayerPanel.List>

        <LayerPanel.Empty>
          <LayerPanel.EmptyIcon />
          <div className="text-[15px] font-semibold leading-tight text-foreground">
            {labels.emptyTitle}
          </div>
          <div className="text-[12px] leading-tight text-muted-foreground">
            {labels.emptyDescription}
          </div>
        </LayerPanel.Empty>
      </LayerPanel>
      <p data-demo="layer-panel-basic-status" className="m-0 text-xs text-muted-foreground">
        {status}
      </p>
    </div>
  )
}

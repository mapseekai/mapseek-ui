import { type LayerData, LayerPanel } from "@registry/blocks/layer-panel"
import { Slider } from "@registry/ui/slider"
import { IconFilter, IconPaint } from "@tabler/icons-react"
import { useMemo, useState } from "react"
import type { LocalizedDemoProps } from "./types"

const basicLabels = {
  "zh-CN": {
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
  },
  en: {
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
  },
}

type LayerPanelBasicLayer = LayerData & {
  readonly styleSummary: string
  readonly filterSummary: string
}

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

export function LayerPanelBasicDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = basicLabels[locale]
  const [layers, setLayers] = useState<LayerPanelBasicLayer[]>(initialLayers)
  const [selectedId, setSelectedId] = useState(initialLayers[0]?.id ?? "")
  const [status, setStatus] = useState(demoLabels.selectedStatus)

  const handleSelectChange = (id: string) => {
    setSelectedId(id)
    setStatus(
      `${demoLabels.selectedStatus}: ${layers.find((layer) => layer.id === id)?.name ?? id}`,
    )
  }

  const handleVisibleChange = (id: string, visible: boolean) => {
    setLayers((current) =>
      current.map((layer) => (layer.id === id ? { ...layer, visible } : layer)),
    )
    const layerName = layers.find((layer) => layer.id === id)?.name ?? id
    setStatus(
      `${visible ? demoLabels.visibilityOnStatus : demoLabels.visibilityOffStatus}: ${layerName}`,
    )
  }

  const handleRemove = (id: string) => {
    setLayers((current) => current.filter((layer) => layer.id !== id))
    setStatus(`${demoLabels.removedStatus}: ${layers.find((layer) => layer.id === id)?.name ?? id}`)
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
    <div className="flex w-full flex-col items-center gap-3">
      <LayerPanel
        layers={layers}
        selectedId={selectedId}
        onSelectChange={handleSelectChange}
        onVisibleChange={handleVisibleChange}
        onReorder={handleReorder}
        onRemove={handleRemove}
        onLocate={(id) => setStatus(`${demoLabels.locatedStatus}: ${id}`)}
        onOpenTable={(id) => setStatus(`${demoLabels.tableStatus}: ${id}`)}
        labels={demoLabels.layerPanel}
        className="h-[430px] w-full max-w-[360px]"
      >
        <LayerPanel.Header>
          <LayerPanel.Title>{demoLabels.title}</LayerPanel.Title>
          <LayerPanel.Count />
          <LayerPanel.Actions>
            <LayerPanel.AddButton onClick={() => setStatus(demoLabels.addLayer)}>
              {demoLabels.addLayer}
            </LayerPanel.AddButton>
          </LayerPanel.Actions>
        </LayerPanel.Header>

        <LayerPanel.List>
          {layers.map((layer) => (
            <LayerPanel.Item key={layer.id} layer={layer}>
              <LayerPanel.Section id="style" icon={IconPaint} label={demoLabels.style} defaultOpen>
                <div className="space-y-1 text-[11px] leading-5 text-muted-foreground">
                  <p className="m-0 font-medium text-foreground">{layer.styleSummary}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span>{demoLabels.styleOpacity}</span>
                    <div className="w-28">
                      <Slider
                        data-demo="layer-panel-opacity"
                        aria-label={`${layer.name} ${demoLabels.styleOpacity}`}
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[layer.geometryType === "raster" ? 82 : 72]}
                      />
                    </div>
                  </div>
                </div>
              </LayerPanel.Section>

              <LayerPanel.Section
                id="filter"
                icon={IconFilter}
                label={demoLabels.filter}
                hidden={layer.geometryType === "raster"}
              >
                <div className="space-y-1 text-[11px] leading-5 text-muted-foreground">
                  <p className="m-0 font-medium text-foreground">{demoLabels.filterMode}</p>
                  <p className="m-0 break-words font-mono">{layer.filterSummary}</p>
                </div>
              </LayerPanel.Section>
            </LayerPanel.Item>
          ))}
        </LayerPanel.List>

        <LayerPanel.Empty>
          <LayerPanel.EmptyIcon />
          <div className="text-[15px] font-semibold leading-tight text-foreground">
            {demoLabels.emptyTitle}
          </div>
          <div className="text-[12px] leading-tight text-muted-foreground">
            {demoLabels.emptyDescription}
          </div>
        </LayerPanel.Empty>
      </LayerPanel>
      <p data-demo="layer-panel-basic-status" className="m-0 text-xs text-muted-foreground">
        {status}
      </p>
    </div>
  )
}

const groupsLabels = {
  "zh-CN": {
    title: "分组图层",
    style: "样式",
    filter: "过滤器",
    collapseGroup: "折叠分组",
    expandGroup: "展开分组",
    renameGroup: "重命名",
    saveRename: "保存",
    groupMenu: "菜单",
    zoomGroup: "缩放至分组",
    duplicateGroup: "复制分组",
    selectedStatus: "已选中",
    visibilityOnStatus: "已显示",
    visibilityOffStatus: "已隐藏",
    collapsedStatus: "已折叠分组",
    expandedStatus: "已展开分组",
    renamedStatus: "已重命名分组",
    menuStatus: "已执行菜单",
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
  },
  en: {
    title: "Grouped layers",
    style: "Style",
    filter: "Filter",
    collapseGroup: "Collapse group",
    expandGroup: "Expand group",
    renameGroup: "Rename",
    saveRename: "Save",
    groupMenu: "Menu",
    zoomGroup: "Zoom to group",
    duplicateGroup: "Duplicate group",
    selectedStatus: "Selected",
    visibilityOnStatus: "Shown",
    visibilityOffStatus: "Hidden",
    collapsedStatus: "Collapsed group",
    expandedStatus: "Expanded group",
    renamedStatus: "Renamed group",
    menuStatus: "Menu action",
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
  },
}

type LayerGroup = {
  readonly id: string
  readonly name: string
  readonly layerIds: readonly string[]
  readonly collapsed: boolean
}

const initialGroupLayers: LayerData[] = [
  {
    id: "admin-boundary",
    name: "Admin boundary",
    visible: true,
    geometryType: "polygon",
    featureCount: 42,
    crsLabel: "EPSG:4326",
  },
  {
    id: "permit-review",
    name: "Permit review areas",
    visible: true,
    geometryType: "polygon",
    featureCount: 18,
    crsLabel: "EPSG:4326",
  },
  {
    id: "water-main",
    name: "Water mains",
    visible: true,
    geometryType: "polyline",
    featureCount: 612,
    crsLabel: "EPSG:3857",
  },
  {
    id: "inspection-points",
    name: "Inspection points",
    visible: false,
    geometryType: "point",
    featureCount: 156,
    crsLabel: "EPSG:4326",
  },
]

const initialGroups: LayerGroup[] = [
  {
    id: "planning",
    name: "Planning",
    layerIds: ["admin-boundary", "permit-review"],
    collapsed: false,
  },
  {
    id: "operations",
    name: "Operations",
    layerIds: ["water-main", "inspection-points"],
    collapsed: false,
  },
]

export function LayerPanelGroupsDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = groupsLabels[locale]
  const [layers, setLayers] = useState(initialGroupLayers)
  const [groups, setGroups] = useState(initialGroups)
  const [selectedId, setSelectedId] = useState(initialGroupLayers[0]?.id ?? "")
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState("")
  const [status, setStatus] = useState(demoLabels.selectedStatus)
  const layersById = useMemo(() => new Map(layers.map((layer) => [layer.id, layer])), [layers])

  const toggleGroup = (groupId: string) => {
    setGroups((current) =>
      current.map((group) => {
        if (group.id !== groupId) return group
        const collapsed = !group.collapsed
        setStatus(
          `${collapsed ? demoLabels.collapsedStatus : demoLabels.expandedStatus}: ${group.name}`,
        )
        return { ...group, collapsed }
      }),
    )
  }

  const beginRename = (group: LayerGroup) => {
    setEditingGroupId(group.id)
    setDraftName(group.name)
    setOpenMenuId(null)
  }

  const saveRename = (groupId: string) => {
    const nextName = draftName.trim()
    if (!nextName) return
    setGroups((current) =>
      current.map((group) => (group.id === groupId ? { ...group, name: nextName } : group)),
    )
    setEditingGroupId(null)
    setStatus(`${demoLabels.renamedStatus}: ${nextName}`)
  }

  const handleVisibleChange = (id: string, visible: boolean) => {
    setLayers((current) =>
      current.map((layer) => (layer.id === id ? { ...layer, visible } : layer)),
    )
    const layerName = layersById.get(id)?.name ?? id
    setStatus(
      `${visible ? demoLabels.visibilityOnStatus : demoLabels.visibilityOffStatus}: ${layerName}`,
    )
  }

  const handleSelectChange = (id: string) => {
    setSelectedId(id)
    setStatus(`${demoLabels.selectedStatus}: ${layersById.get(id)?.name ?? id}`)
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <LayerPanel
        layers={layers}
        selectedId={selectedId}
        onSelectChange={handleSelectChange}
        onVisibleChange={handleVisibleChange}
        labels={demoLabels.layerPanel}
        className="h-[470px] w-full max-w-[380px]"
      >
        <LayerPanel.Header>
          <LayerPanel.Title>{demoLabels.title}</LayerPanel.Title>
          <LayerPanel.Count />
        </LayerPanel.Header>

        <LayerPanel.List>
          {groups.map((group) => (
            <div key={group.id} data-demo={`layer-panel-group-${group.id}`} className="min-w-0">
              <div className="flex min-h-9 items-center gap-1 border-b border-border bg-muted/35 px-2">
                <button
                  type="button"
                  data-demo={`layer-panel-group-collapse-${group.id}`}
                  aria-expanded={!group.collapsed}
                  aria-label={group.collapsed ? demoLabels.expandGroup : demoLabels.collapseGroup}
                  className="inline-flex size-7 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
                  onClick={() => toggleGroup(group.id)}
                >
                  {group.collapsed ? "+" : "-"}
                </button>

                {editingGroupId === group.id ? (
                  <input
                    data-demo={`layer-panel-group-rename-input-${group.id}`}
                    aria-label={demoLabels.renameGroup}
                    className="min-w-0 flex-1 border border-border bg-background px-2 py-1 text-[12px]"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") saveRename(group.id)
                    }}
                  />
                ) : (
                  <div className="min-w-0 flex-1 truncate text-[12px] font-semibold uppercase tracking-[0.05em] text-foreground">
                    {group.name}
                  </div>
                )}

                {editingGroupId === group.id ? (
                  <button
                    type="button"
                    data-demo={`layer-panel-group-rename-save-${group.id}`}
                    className="shrink-0 px-2 py-1 text-[11px] text-primary hover:bg-card"
                    onClick={() => saveRename(group.id)}
                  >
                    {demoLabels.saveRename}
                  </button>
                ) : (
                  <button
                    type="button"
                    data-demo={`layer-panel-group-rename-${group.id}`}
                    className="shrink-0 px-2 py-1 text-[11px] text-muted-foreground hover:bg-card hover:text-foreground"
                    onClick={() => beginRename(group)}
                  >
                    {demoLabels.renameGroup}
                  </button>
                )}

                <button
                  type="button"
                  data-demo={`layer-panel-group-menu-trigger-${group.id}`}
                  aria-expanded={openMenuId === group.id}
                  className="shrink-0 px-2 py-1 text-[11px] text-muted-foreground hover:bg-card hover:text-foreground"
                  onClick={() =>
                    setOpenMenuId((current) => (current === group.id ? null : group.id))
                  }
                >
                  {demoLabels.groupMenu}
                </button>
              </div>

              {openMenuId === group.id ? (
                <div
                  data-demo={`layer-panel-group-menu-${group.id}`}
                  className="grid gap-1 border-b border-border bg-card px-8 py-2"
                >
                  <button
                    type="button"
                    data-demo={`layer-panel-group-menu-zoom-${group.id}`}
                    className="text-left text-[12px] text-foreground hover:text-primary"
                    onClick={() => {
                      setOpenMenuId(null)
                      setStatus(`${demoLabels.menuStatus}: ${demoLabels.zoomGroup} ${group.name}`)
                    }}
                  >
                    {demoLabels.zoomGroup}
                  </button>
                  <button
                    type="button"
                    data-demo={`layer-panel-group-menu-duplicate-${group.id}`}
                    className="text-left text-[12px] text-foreground hover:text-primary"
                    onClick={() => {
                      setOpenMenuId(null)
                      setStatus(
                        `${demoLabels.menuStatus}: ${demoLabels.duplicateGroup} ${group.name}`,
                      )
                    }}
                  >
                    {demoLabels.duplicateGroup}
                  </button>
                </div>
              ) : null}

              {group.collapsed
                ? null
                : group.layerIds.flatMap((layerId) => {
                    const layer = layersById.get(layerId)
                    if (!layer) return []
                    return (
                      <LayerPanel.Item key={layer.id} layer={layer}>
                        <LayerPanel.Section id="style" icon={IconPaint} label={demoLabels.style}>
                          <p className="m-0 text-[11px] leading-5 text-muted-foreground">
                            {layer.geometryType === "point" ? "Marker size 6" : "Opacity 78%"}
                          </p>
                        </LayerPanel.Section>
                        <LayerPanel.Section
                          id="filter"
                          icon={IconFilter}
                          label={demoLabels.filter}
                          defaultOpen={false}
                        >
                          <p className="m-0 text-[11px] leading-5 text-muted-foreground">
                            group_id = {group.id}
                          </p>
                        </LayerPanel.Section>
                      </LayerPanel.Item>
                    )
                  })}
            </div>
          ))}
        </LayerPanel.List>
      </LayerPanel>
      <p data-demo="layer-panel-groups-status" className="m-0 text-xs text-muted-foreground">
        {status}
      </p>
    </div>
  )
}

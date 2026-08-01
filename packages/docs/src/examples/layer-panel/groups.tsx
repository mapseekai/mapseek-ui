import { type LayerData, LayerPanel } from "@registry/blocks/layer-panel"
import type { LayerPanelLabels } from "@registry/blocks/layer-panel/labels"
import { IconFilter, IconPaint } from "@tabler/icons-react"
import { useMemo, useState } from "react"

type LayerGroup = {
  readonly id: string
  readonly name: string
  readonly layerIds: readonly string[]
  readonly collapsed: boolean
}

export type LayerPanelGroupsDemoLabels = {
  readonly title: string
  readonly style: string
  readonly filter: string
  readonly collapseGroup: string
  readonly expandGroup: string
  readonly renameGroup: string
  readonly saveRename: string
  readonly groupMenu: string
  readonly zoomGroup: string
  readonly duplicateGroup: string
  readonly selectedStatus: string
  readonly visibilityOnStatus: string
  readonly visibilityOffStatus: string
  readonly collapsedStatus: string
  readonly expandedStatus: string
  readonly renamedStatus: string
  readonly menuStatus: string
  readonly layerPanel: Partial<LayerPanelLabels>
}

export type LayerPanelGroupsDemoProps = {
  readonly labels: LayerPanelGroupsDemoLabels
}

export const zhLayerPanelGroupsLabels = {
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
} satisfies LayerPanelGroupsDemoLabels

export const enLayerPanelGroupsLabels = {
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
} satisfies LayerPanelGroupsDemoLabels

const initialLayers: LayerData[] = [
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

export function LayerPanelGroupsDemo({ labels }: LayerPanelGroupsDemoProps) {
  const [layers, setLayers] = useState(initialLayers)
  const [groups, setGroups] = useState(initialGroups)
  const [selectedId, setSelectedId] = useState(initialLayers[0]?.id ?? "")
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState("")
  const [status, setStatus] = useState(labels.selectedStatus)
  const layersById = useMemo(() => new Map(layers.map((layer) => [layer.id, layer])), [layers])

  const toggleGroup = (groupId: string) => {
    setGroups((current) =>
      current.map((group) => {
        if (group.id !== groupId) return group
        const collapsed = !group.collapsed
        setStatus(`${collapsed ? labels.collapsedStatus : labels.expandedStatus}: ${group.name}`)
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
    setStatus(`${labels.renamedStatus}: ${nextName}`)
  }

  const handleVisibleChange = (id: string, visible: boolean) => {
    setLayers((current) =>
      current.map((layer) => (layer.id === id ? { ...layer, visible } : layer)),
    )
    const layerName = layersById.get(id)?.name ?? id
    setStatus(`${visible ? labels.visibilityOnStatus : labels.visibilityOffStatus}: ${layerName}`)
  }

  const handleSelectChange = (id: string) => {
    setSelectedId(id)
    setStatus(`${labels.selectedStatus}: ${layersById.get(id)?.name ?? id}`)
  }

  return (
    <div data-demo="layer-panel-groups" className="flex w-full flex-col items-center gap-3">
      <LayerPanel
        layers={layers}
        selectedId={selectedId}
        onSelectChange={handleSelectChange}
        onVisibleChange={handleVisibleChange}
        labels={labels.layerPanel}
        className="h-[470px] w-full max-w-[380px]"
      >
        <LayerPanel.Header>
          <LayerPanel.Title>{labels.title}</LayerPanel.Title>
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
                  aria-label={group.collapsed ? labels.expandGroup : labels.collapseGroup}
                  className="inline-flex size-7 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
                  onClick={() => toggleGroup(group.id)}
                >
                  {group.collapsed ? "+" : "-"}
                </button>

                {editingGroupId === group.id ? (
                  <input
                    data-demo={`layer-panel-group-rename-input-${group.id}`}
                    aria-label={labels.renameGroup}
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
                    {labels.saveRename}
                  </button>
                ) : (
                  <button
                    type="button"
                    data-demo={`layer-panel-group-rename-${group.id}`}
                    className="shrink-0 px-2 py-1 text-[11px] text-muted-foreground hover:bg-card hover:text-foreground"
                    onClick={() => beginRename(group)}
                  >
                    {labels.renameGroup}
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
                  {labels.groupMenu}
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
                      setStatus(`${labels.menuStatus}: ${labels.zoomGroup} ${group.name}`)
                    }}
                  >
                    {labels.zoomGroup}
                  </button>
                  <button
                    type="button"
                    data-demo={`layer-panel-group-menu-duplicate-${group.id}`}
                    className="text-left text-[12px] text-foreground hover:text-primary"
                    onClick={() => {
                      setOpenMenuId(null)
                      setStatus(`${labels.menuStatus}: ${labels.duplicateGroup} ${group.name}`)
                    }}
                  >
                    {labels.duplicateGroup}
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
                        <LayerPanel.Section id="style" icon={IconPaint} label={labels.style}>
                          <p className="m-0 text-[11px] leading-5 text-muted-foreground">
                            {layer.geometryType === "point" ? "Marker size 6" : "Opacity 78%"}
                          </p>
                        </LayerPanel.Section>
                        <LayerPanel.Section
                          id="filter"
                          icon={IconFilter}
                          label={labels.filter}
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

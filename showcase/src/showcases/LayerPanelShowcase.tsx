import {
  LAYER_PANEL_LABELS_EN,
  LAYER_PANEL_LABELS_ZH_CN,
  type LayerData,
  LayerPanel,
} from "@registry/blocks/layer-panel"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

function projectLayers(locale: "zh-CN" | "en"): readonly LayerData[] {
  return locale === "en"
    ? [
        {
          id: "land",
          name: "Land use",
          group: "Base data",
          geometry: "polygon",
          featureCount: 1284,
          visible: true,
        },
        {
          id: "road",
          name: "Road centerlines",
          group: "Base data",
          geometry: "polyline",
          featureCount: 532,
          visible: true,
        },
        {
          id: "poi",
          name: "Public services",
          group: "Analysis",
          geometry: "point",
          featureCount: 86,
          visible: false,
        },
      ]
    : [
        {
          id: "land",
          name: "用地分类",
          group: "基础数据",
          geometry: "polygon",
          featureCount: 1284,
          visible: true,
        },
        {
          id: "road",
          name: "道路中心线",
          group: "基础数据",
          geometry: "polyline",
          featureCount: 532,
          visible: true,
        },
        {
          id: "poi",
          name: "公共服务设施",
          group: "专题分析",
          geometry: "point",
          featureCount: 86,
          visible: false,
        },
      ]
}

export function LayerPanelDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [layers, setLayers] = useState(() => projectLayers(locale))
  const [selectedId, setSelectedId] = useState("land")
  const [query, setQuery] = useState("")
  const [visibleOnly, setVisibleOnly] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<ReadonlySet<string>>(() => new Set())
  const labels = locale === "en" ? LAYER_PANEL_LABELS_EN : LAYER_PANEL_LABELS_ZH_CN

  return (
    <LayerPanel
      className="w-72"
      layers={layers}
      selectedId={selectedId}
      query={query}
      visibleOnly={visibleOnly}
      collapsed={collapsed}
      collapsedGroups={collapsedGroups}
      labels={labels}
      onQueryChange={setQuery}
      onVisibleOnlyChange={setVisibleOnly}
      onSelectLayer={setSelectedId}
      onVisibilityChange={(id, visible) =>
        setLayers((current) =>
          current.map((layer) => (layer.id === id ? { ...layer, visible } : layer)),
        )
      }
      onGroupCollapsedChange={(group, nextCollapsed) =>
        setCollapsedGroups((current) => {
          const next = new Set(current)
          if (nextCollapsed) next.add(group)
          else next.delete(group)
          return next
        })
      }
      onCollapsedChange={setCollapsed}
      onCreateGroup={() => undefined}
      onAddLayer={() => undefined}
      onRenameGroup={() => undefined}
      onLocateLayer={setSelectedId}
      onOpenAttributeTable={() => undefined}
      onMoreLayerActions={() => undefined}
    />
  )
}

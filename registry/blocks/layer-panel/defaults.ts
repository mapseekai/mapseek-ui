import type { LayerPanelLabels } from "./labels"

export const DEFAULT_LAYER_PANEL_LABELS = {
  point: "点",
  polyline: "线",
  polygon: "面",
  mixed: "混合",
  raster: "栅格",
  addLayer: "添加图层",
  features: "要素",
  locate: "定位",
  zoomToLayer: "缩放到图层",
  attributeTable: "属性表",
  delete: "删除",
} satisfies LayerPanelLabels

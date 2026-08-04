import type { RasterStylePanelLabels } from "./labels"
import type { ColormapPreset } from "./types"

export const DEFAULT_RASTER_STYLE_PANEL_LABELS = {
  colormapNone: "无配色",
  colormapNamed: "预设配色",
  colormapCustom: "自定义配色",
} satisfies RasterStylePanelLabels

export const DEFAULT_COLORMAP_PRESETS: ColormapPreset[] = [
  { id: "bgr", name: "蓝-米-橙", stops: ["#2a6fdb", "#f6f4ef", "#d97757"] },
  {
    id: "terrain",
    name: "地形",
    stops: ["#2a6fdb", "#34b75f", "#d4c456", "#d97757", "#f5f5f5"],
  },
  { id: "diverging", name: "发散", stops: ["#d12c2c", "#f5f5f5", "#2a7add"] },
  {
    id: "ndvi",
    name: "NDVI",
    stops: ["#8c5b27", "#d4c456", "#5fb55f", "#1a6b2b"],
  },
]

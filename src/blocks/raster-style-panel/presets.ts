import type { ColormapPreset } from "./types"

/**
 * Built-in starting points for the custom colormap editor. `name` is a
 * display string the caller may localize by supplying its own presets.
 */
export const DEFAULT_COLORMAP_PRESETS: ColormapPreset[] = [
  { id: "bgr", name: "蓝-米-橙", stops: ["#2a6fdb", "#f6f4ef", "#d97757"] },
  {
    id: "terrain",
    name: "地形",
    stops: ["#2a6fdb", "#34b75f", "#d4c456", "#d97757", "#f5f5f5"],
  },
  { id: "diverging", name: "发散", stops: ["#d12c2c", "#f5f5f5", "#2a7add"] },
  { id: "ndvi", name: "NDVI", stops: ["#8c5b27", "#d4c456", "#5fb55f", "#1a6b2b"] },
]

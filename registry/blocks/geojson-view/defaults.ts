import type { GeoJSONViewLabels } from "./labels"

export const DEFAULT_GEOJSON_VIEW_LABELS = {
  expandAll: "全部展开",
  collapseAll: "全部收起",
  copy: "复制 GeoJSON",
  copied: "已复制 GeoJSON",
  item: "项",
  items: "项",
  parseError: "GeoJSON 解析失败",
  unsupportedValue: "GeoJSON 必须是对象或数组",
} satisfies GeoJSONViewLabels

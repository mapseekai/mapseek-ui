import type { CrsPickerLabels } from "./labels"

export const DEFAULT_CRS_PICKER_LABELS = {
  title: "坐标参考系",
  searchPlaceholder: "搜索 EPSG 或名称…",
  listLabel: "坐标参考系",
  noResults: "未找到匹配的坐标系",
  geographic: "球面坐标系",
  projected: "平面坐标系",
  wgs84Description: "全球通用 · 经纬度",
  cgcs2000Description: "国测 · 经纬度",
  beijing1954Description: "北京54 · 历史",
  xian1980Description: "西安80 · 历史",
  webMercatorDescription: "切片底图 · 米",
} satisfies CrsPickerLabels

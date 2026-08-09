import type { CrsPickerLabels } from "./labels"

export const DEFAULT_CRS_PICKER_LABELS = {
  title: "坐标参考系",
  searchLabel: "搜索坐标系",
  searchPlaceholder: "搜索 EPSG 或名称…",
  listLabel: "坐标参考系",
  noResults: "未找到匹配的坐标系",
  geographic: "球面坐标系",
  projected: "平面坐标系",
} satisfies CrsPickerLabels

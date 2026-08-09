import type { CoordinateSystemComboboxLabels } from "./labels"

export const DEFAULT_COORDINATE_SYSTEM_COMBOBOX_LABELS = {
  inputLabel: "选择坐标系",
  searchPlaceholder: "搜索 EPSG 或名称",
  geographic: "球面坐标系",
  projected: "平面坐标系",
  noResults: "未找到匹配的坐标系",
} satisfies CoordinateSystemComboboxLabels

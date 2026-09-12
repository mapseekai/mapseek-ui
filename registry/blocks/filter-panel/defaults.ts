import type { FilterPanelLabels } from "./labels"

export const DEFAULT_FILTER_PANEL_LABELS = {
  builder: "构建器",
  noConditions: "暂无条件",
  field: "字段",
  operator: "运算符",
  connection: "连接方式",
  value: "值",
  valuePlaceholder: "输入值",
  removeCondition: "删除条件",
  addCondition: "添加条件",
  estimate: "预计",
  rows: "行",
  clear: "清空",
  apply: "应用",
} satisfies FilterPanelLabels

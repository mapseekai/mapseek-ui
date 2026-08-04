import type { LoomToolbarLabels } from "./types"

export const LOOM_TOOLBAR_LABELS_ZH_CN: LoomToolbarLabels = {
  startEditing: "开始编辑",
  stopEditing: "退出编辑",
  save: "保存",
  currentLayer: (name) => `当前：${name}`,
  enableSnapping: "开启吸附",
  disableSnapping: "关闭吸附",
  snappingStatus: (enabled) => `顶点/边吸附 · 8 px · ${enabled ? "已开启" : "已关闭"}`,
  undo: "撤销",
  redo: "重做",
  currentMode: "当前模式",
  unsaved: "有未保存编辑",
  editRequired: (tool) => `${tool} · 请先开启编辑`,
}

export const LOOM_TOOLBAR_LABELS_EN: LoomToolbarLabels = {
  startEditing: "Start editing",
  stopEditing: "Stop editing",
  save: "Save",
  currentLayer: (name) => `Current: ${name}`,
  enableSnapping: "Enable snapping",
  disableSnapping: "Disable snapping",
  snappingStatus: (enabled) => `Vertex/edge snapping · 8 px · ${enabled ? "on" : "off"}`,
  undo: "Undo",
  redo: "Redo",
  currentMode: "Current mode",
  unsaved: "Unsaved edits",
  editRequired: (tool) => `${tool} · Start editing first`,
}

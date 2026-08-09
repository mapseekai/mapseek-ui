import {
  TOOLBAR_LABELS_EN,
  TOOLBAR_LABELS_ZH_CN,
  Toolbar,
  type ToolbarGroup,
} from "@registry/blocks/toolbar"
import {
  IconArrowsMove,
  IconHandStop,
  IconInfoCircle,
  IconPointer,
  IconResize,
  IconRotate,
  IconVectorBezier2,
  IconVectorTriangle,
} from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

function toolbarGroups(locale: "zh-CN" | "en"): readonly ToolbarGroup[] {
  const english = locale === "en"
  return [
    {
      label: english ? "Navigation" : "导航",
      tools: [
        {
          id: "pan",
          label: english ? "Pan and zoom" : "平移缩放",
          shortcut: "H",
          icon: IconHandStop,
        },
      ],
    },
    {
      label: english ? "Selection" : "选择",
      tools: [
        { id: "select", label: english ? "Select" : "点选", shortcut: "V", icon: IconPointer },
        {
          id: "pickAttr",
          label: english ? "Inspect attributes" : "属性拾取",
          shortcut: "I",
          icon: IconInfoCircle,
        },
      ],
    },
    {
      label: english ? "Editing" : "编辑",
      tools: [
        {
          id: "draw",
          label: english ? "Add feature" : "添加要素",
          shortcut: "P",
          icon: IconVectorTriangle,
          editOnly: true,
        },
        {
          id: "vertex",
          label: english ? "Edit vertices" : "节点编辑",
          shortcut: "E",
          icon: IconVectorBezier2,
          editOnly: true,
        },
      ],
    },
    {
      label: english ? "Transform" : "变换",
      tools: [
        {
          id: "translate",
          label: english ? "Move feature" : "平移要素",
          shortcut: "M",
          icon: IconArrowsMove,
          editOnly: true,
        },
        {
          id: "rotate",
          label: english ? "Rotate feature" : "旋转要素",
          shortcut: "R",
          icon: IconRotate,
          editOnly: true,
        },
        {
          id: "scale",
          label: english ? "Scale feature" : "缩放要素",
          shortcut: "T",
          icon: IconResize,
          editOnly: true,
        },
      ],
    },
  ]
}

export function ToolbarDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [editing, setEditing] = useState(true)
  const [dirty, setDirty] = useState(true)
  const [mode, setMode] = useState("select")
  const [snapping, setSnapping] = useState(true)
  const [historyIndex, setHistoryIndex] = useState(1)
  const labels = locale === "en" ? TOOLBAR_LABELS_EN : TOOLBAR_LABELS_ZH_CN

  return (
    <Toolbar
      groups={toolbarGroups(locale)}
      activeMode={mode}
      activeLayerName={locale === "en" ? "Urban land use" : "城市用地现状"}
      editing={editing}
      dirty={dirty}
      snapping={snapping}
      canUndo={historyIndex > 0}
      canRedo={historyIndex < 2}
      labels={labels}
      onEditingChange={(nextEditing) => {
        setEditing(nextEditing)
        if (!nextEditing) setMode("pan")
      }}
      onModeChange={(nextMode) => {
        setMode(nextMode)
        if (!["pan", "select", "pickAttr"].includes(nextMode)) {
          setDirty(true)
          setHistoryIndex(2)
        }
      }}
      onSnappingChange={setSnapping}
      onSave={() => setDirty(false)}
      onUndo={() => setHistoryIndex((current) => Math.max(0, current - 1))}
      onRedo={() => setHistoryIndex((current) => Math.min(2, current + 1))}
    />
  )
}

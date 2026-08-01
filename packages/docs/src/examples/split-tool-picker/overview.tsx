import {
  type SplitToolActionSource,
  type SplitToolItem,
  SplitToolPicker,
} from "@registry/blocks/split-tool-picker"
import {
  IconLasso,
  IconMarquee2,
  IconPointer,
  IconPolygon,
  IconVectorBezier2,
  IconVectorTriangle,
} from "@tabler/icons-react"
import { useState } from "react"

const selectTools: SplitToolItem[] = [
  {
    id: "point",
    icon: IconPointer,
    label: "Point select",
    hint: "V",
    description: "Click a feature",
  },
  {
    id: "rect",
    icon: IconMarquee2,
    label: "Box select",
    hint: "R",
    description: "Drag a rectangle",
  },
  {
    id: "lasso",
    icon: IconLasso,
    label: "Lasso select",
    hint: "L",
    description: "Draw a freehand area",
  },
]

const editTools: SplitToolItem[] = [
  {
    id: "polygon",
    icon: IconPolygon,
    label: "Polygon",
    hint: "P",
    description: "Draw a closed polygon",
  },
  { id: "line", icon: IconVectorBezier2, label: "Line", hint: "L", description: "Draw a polyline" },
  {
    id: "triangle",
    icon: IconVectorTriangle,
    label: "Triangle",
    hint: "T",
    description: "Create a triangle quickly",
  },
]

export type SplitToolPickerDemoLabels = {
  readonly title: string
  readonly disabled: string
  readonly selectTool: string
  readonly editTool: string
  readonly current: string
  readonly idle: string
  readonly selectGroup: string
  readonly editGroup: string
  readonly primarySource: string
  readonly menuSource: string
}

export const zhSplitToolPickerLabels = {
  title: "通用拆分工具",
  disabled: "禁用",
  selectTool: "选择工具",
  editTool: "绘制工具",
  current: "当前",
  idle: "尚未触发",
  selectGroup: "选择",
  editGroup: "绘制",
  primarySource: "主按钮",
  menuSource: "下拉菜单",
} satisfies SplitToolPickerDemoLabels

export const enSplitToolPickerLabels = {
  title: "General split tools",
  disabled: "Disabled",
  selectTool: "Selection tool",
  editTool: "Drawing tool",
  current: "Current",
  idle: "No action yet",
  selectGroup: "Select",
  editGroup: "Draw",
  primarySource: "Primary button",
  menuSource: "Menu",
} satisfies SplitToolPickerDemoLabels

function sourceLabel(source: SplitToolActionSource, labels: SplitToolPickerDemoLabels) {
  return source === "primary" ? labels.primarySource : labels.menuSource
}

export function SplitToolPickerDemo({ labels }: { readonly labels: SplitToolPickerDemoLabels }) {
  const [selectTool, setSelectTool] = useState("point")
  const [editTool, setEditTool] = useState("polygon")
  const [lastAction, setLastAction] = useState(labels.idle)
  const currentSelect = selectTools.find((item) => item.id === selectTool) ?? selectTools[0]
  const currentEdit = editTools.find((item) => item.id === editTool) ?? editTools[0]

  const handleAction =
    (group: string, items: readonly SplitToolItem[]) =>
    (value: string, source: SplitToolActionSource) => {
      const item = items.find((entry) => entry.id === value)
      setLastAction(`${group} · ${item?.label ?? value} · ${sourceLabel(source, labels)}`)
    }

  return (
    <div data-demo="split-tool-picker" className="space-y-8">
      <section className="space-y-3">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">{labels.title}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex h-10 items-center gap-2 border border-border bg-card px-1 shadow-[var(--shadow-map-float)]">
            <span data-demo-action="split-tool-picker-select">
              <SplitToolPicker
                label={labels.selectTool}
                items={selectTools}
                value={selectTool}
                onValueChange={setSelectTool}
                onAction={handleAction(labels.selectGroup, selectTools)}
              />
            </span>
            <span className="h-[22px] w-px bg-border" />
            <span data-demo-action="split-tool-picker-edit">
              <SplitToolPicker
                label={labels.editTool}
                items={editTools}
                value={editTool}
                onValueChange={setEditTool}
                onAction={handleAction(labels.editGroup, editTools)}
              />
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {labels.current}:{" "}
            <span className="font-medium text-foreground">{currentSelect.label}</span>
            <span className="px-1">/</span>
            <span className="font-medium text-foreground">{currentEdit.label}</span>
          </div>
        </div>
        <div
          data-demo-status="split-tool-picker"
          className="font-mono text-[11px] text-muted-foreground"
        >
          {lastAction}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">{labels.disabled}</h3>
        <div className="inline-flex h-10 items-center border border-border bg-card px-1">
          <span data-demo-action="split-tool-picker-disabled">
            <SplitToolPicker
              label={labels.selectTool}
              items={selectTools}
              defaultValue="rect"
              disabled
            />
          </span>
        </div>
      </section>
    </div>
  )
}

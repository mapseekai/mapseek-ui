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
import type { LocalizedDemoProps } from "./types"

type SplitToolText = {
  readonly label: string
  readonly description: string
}

type SplitToolPickerDemoLabels = {
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
  readonly tools: {
    readonly point: SplitToolText
    readonly rect: SplitToolText
    readonly lasso: SplitToolText
    readonly polygon: SplitToolText
    readonly line: SplitToolText
    readonly triangle: SplitToolText
  }
}

const labels = {
  "zh-CN": {
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
    tools: {
      point: { label: "点选", description: "点击一个要素" },
      rect: { label: "框选", description: "拖拽一个矩形" },
      lasso: { label: "套索选择", description: "绘制自由区域" },
      polygon: { label: "面", description: "绘制闭合多边形" },
      line: { label: "线", description: "绘制折线" },
      triangle: { label: "三角形", description: "快速创建三角形" },
    },
  } satisfies SplitToolPickerDemoLabels,
  en: {
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
    tools: {
      point: { label: "Point select", description: "Click a feature" },
      rect: { label: "Box select", description: "Drag a rectangle" },
      lasso: { label: "Lasso select", description: "Draw a freehand area" },
      polygon: { label: "Polygon", description: "Draw a closed polygon" },
      line: { label: "Line", description: "Draw a polyline" },
      triangle: { label: "Triangle", description: "Create a triangle quickly" },
    },
  } satisfies SplitToolPickerDemoLabels,
}

function sourceLabel(source: SplitToolActionSource, labels: SplitToolPickerDemoLabels) {
  return source === "primary" ? labels.primarySource : labels.menuSource
}

function buildSelectTools(labels: SplitToolPickerDemoLabels): SplitToolItem[] {
  return [
    {
      id: "point",
      icon: IconPointer,
      label: labels.tools.point.label,
      hint: "V",
      description: labels.tools.point.description,
    },
    {
      id: "rect",
      icon: IconMarquee2,
      label: labels.tools.rect.label,
      hint: "R",
      description: labels.tools.rect.description,
    },
    {
      id: "lasso",
      icon: IconLasso,
      label: labels.tools.lasso.label,
      hint: "L",
      description: labels.tools.lasso.description,
    },
  ]
}

function buildEditTools(labels: SplitToolPickerDemoLabels): SplitToolItem[] {
  return [
    {
      id: "polygon",
      icon: IconPolygon,
      label: labels.tools.polygon.label,
      hint: "P",
      description: labels.tools.polygon.description,
    },
    {
      id: "line",
      icon: IconVectorBezier2,
      label: labels.tools.line.label,
      hint: "L",
      description: labels.tools.line.description,
    },
    {
      id: "triangle",
      icon: IconVectorTriangle,
      label: labels.tools.triangle.label,
      hint: "T",
      description: labels.tools.triangle.description,
    },
  ]
}

export function SplitToolPickerDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const selectTools = buildSelectTools(demoLabels)
  const editTools = buildEditTools(demoLabels)
  const [selectTool, setSelectTool] = useState("point")
  const [editTool, setEditTool] = useState("polygon")
  const [lastAction, setLastAction] = useState(demoLabels.idle)
  const currentSelect = selectTools.find((item) => item.id === selectTool) ?? selectTools[0]
  const currentEdit = editTools.find((item) => item.id === editTool) ?? editTools[0]

  const handleAction =
    (group: string, items: readonly SplitToolItem[]) =>
    (value: string, source: SplitToolActionSource) => {
      const item = items.find((entry) => entry.id === value)
      setLastAction(`${group} · ${item?.label ?? value} · ${sourceLabel(source, demoLabels)}`)
    }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex h-10 items-center gap-2 border border-border bg-card px-1 shadow-[var(--shadow-map-float)]">
            <span data-demo-action="split-tool-picker-select">
              <SplitToolPicker
                label={demoLabels.selectTool}
                items={selectTools}
                value={selectTool}
                onValueChange={setSelectTool}
                onAction={handleAction(demoLabels.selectGroup, selectTools)}
              />
            </span>
            <span className="h-[22px] w-px bg-border" />
            <span data-demo-action="split-tool-picker-edit">
              <SplitToolPicker
                label={demoLabels.editTool}
                items={editTools}
                value={editTool}
                onValueChange={setEditTool}
                onAction={handleAction(demoLabels.editGroup, editTools)}
              />
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {demoLabels.current}:{" "}
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
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.disabled}
        </h3>
        <div className="inline-flex h-10 items-center border border-border bg-card px-1">
          <span data-demo-action="split-tool-picker-disabled">
            <SplitToolPicker
              label={demoLabels.selectTool}
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

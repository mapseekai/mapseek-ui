import { Block, Collapser, Fieldset, ScrollContainer } from "@registry/blocks/layout"
import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    blockGroup: "Block 三种布局",
    fillColor: "fill-color",
    visible: "visible",
    textField: "text-field",
    expand: "展开",
    collapse: "折叠",
    action: "函数按钮已触发",
    rowPrefix: "第",
    rowSuffix: "ScrollContainer 内容溢出滚动",
  },
  en: {
    blockGroup: "Three Block layouts",
    fillColor: "fill-color",
    visible: "visible",
    textField: "text-field",
    expand: "Expand",
    collapse: "Collapse",
    action: "Function action triggered",
    rowPrefix: "row",
    rowSuffix: "ScrollContainer overflow row",
  },
}

export function LayoutDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [collapsed, setCollapsed] = useState(false)
  const [status, setStatus] = useState(demoLabels.collapse)
  const rows = Array.from(
    { length: 20 },
    (_, index) => `${demoLabels.rowPrefix} ${String(index + 1).padStart(2, "0")}`,
  )

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-4">
      <Fieldset label={demoLabels.blockGroup}>
        <Block label={demoLabels.fillColor}>
          <Input className="h-7 text-xs" defaultValue="#22c55e" />
        </Block>
        <Block inline label={demoLabels.visible}>
          <Input className="h-7 text-xs" defaultValue="true" />
        </Block>
        <Block
          wideMode
          label={demoLabels.textField}
          action={
            <Button
              type="button"
              data-demo-action="layout-field-action"
              variant="ghost"
              size="icon-xs"
              aria-label={demoLabels.action}
              onClick={() => setStatus(demoLabels.action)}
            >
              f
            </Button>
          }
        >
          <Input className="h-7 text-xs" defaultValue="{name}" />
        </Block>
      </Fieldset>

      <Button
        type="button"
        data-demo-action="layout-collapse"
        onClick={() => setCollapsed((current) => !current)}
        variant="outline"
        size="sm"
        className="justify-start"
      >
        <Collapser isCollapsed={collapsed} />
        {collapsed ? demoLabels.expand : demoLabels.collapse}
      </Button>

      <div data-demo-panel="layout-scroll">
        <ScrollContainer className="h-[160px] border border-border p-3">
          <div className="flex flex-col gap-2">
            {rows.map((row) => (
              <div key={row} className="font-mono text-xs text-muted-foreground">
                {row} - {demoLabels.rowSuffix}
              </div>
            ))}
          </div>
        </ScrollContainer>
      </div>
      <span data-demo-status="layout" className="font-mono text-xs text-muted-foreground">
        {collapsed ? demoLabels.expand : status}
      </span>
    </div>
  )
}

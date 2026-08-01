import { Block, Collapser, Fieldset, ScrollContainer } from "@registry/blocks/layout"
import { Input } from "@registry/ui/input"
import { useState } from "react"

export type LayoutDemoLabels = {
  readonly blockGroup: string
  readonly fillColor: string
  readonly visible: string
  readonly textField: string
  readonly expand: string
  readonly collapse: string
  readonly action: string
  readonly rowPrefix: string
  readonly rowSuffix: string
}

export const zhLayoutLabels = {
  blockGroup: "Block 三种布局",
  fillColor: "fill-color",
  visible: "visible",
  textField: "text-field",
  expand: "展开",
  collapse: "折叠",
  action: "函数按钮已触发",
  rowPrefix: "第",
  rowSuffix: "ScrollContainer 内容溢出滚动",
} satisfies LayoutDemoLabels

export const enLayoutLabels = {
  blockGroup: "Three Block layouts",
  fillColor: "fill-color",
  visible: "visible",
  textField: "text-field",
  expand: "Expand",
  collapse: "Collapse",
  action: "Function action triggered",
  rowPrefix: "row",
  rowSuffix: "ScrollContainer overflow row",
} satisfies LayoutDemoLabels

export function LayoutDemo({ labels }: { readonly labels: LayoutDemoLabels }) {
  const [collapsed, setCollapsed] = useState(false)
  const [status, setStatus] = useState(labels.collapse)
  const rows = Array.from(
    { length: 20 },
    (_, index) => `${labels.rowPrefix} ${String(index + 1).padStart(2, "0")}`,
  )

  return (
    <div data-demo="layout" className="flex w-full max-w-[420px] flex-col gap-4">
      <Fieldset label={labels.blockGroup}>
        <Block label={labels.fillColor}>
          <Input className="h-7 text-xs" defaultValue="#22c55e" />
        </Block>
        <Block inline label={labels.visible}>
          <Input className="h-7 text-xs" defaultValue="true" />
        </Block>
        <Block
          wideMode
          label={labels.textField}
          action={
            <button
              type="button"
              data-demo-action="layout-field-action"
              className="px-1 text-xs"
              onClick={() => setStatus(labels.action)}
            >
              f
            </button>
          }
        >
          <Input className="h-7 text-xs" defaultValue="{name}" />
        </Block>
      </Fieldset>

      <button
        type="button"
        data-demo-action="layout-collapse"
        onClick={() => setCollapsed((current) => !current)}
        className="flex items-center gap-2 border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
      >
        <Collapser isCollapsed={collapsed} />
        {collapsed ? labels.expand : labels.collapse}
      </button>

      <div data-demo-panel="layout-scroll">
        <ScrollContainer className="h-[160px] border border-border p-3">
          <div className="flex flex-col gap-2">
            {rows.map((row) => (
              <div key={row} className="font-mono text-xs text-muted-foreground">
                {row} - {labels.rowSuffix}
              </div>
            ))}
          </div>
        </ScrollContainer>
      </div>
      <span data-demo-status="layout" className="font-mono text-xs text-muted-foreground">
        {collapsed ? labels.expand : status}
      </span>
    </div>
  )
}

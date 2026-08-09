import { JsonEditor } from "@registry/blocks/json-editor"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const sample = {
  version: 8,
  source: "workspace:roads",
  paint: {
    "line-color": "#188a42",
    "line-width": 2,
  },
}

const labels = {
  "zh-CN": {
    intro: "使用 Mapseek 语义 token 的可编辑 JSON 组件，展示无标题和标题栏两种形式。",
    untitled: "app 主题 · 焦点状态",
    titled: "app 主题 · 标题栏",
    editorAriaLabel: "样式 JSON 编辑器",
    focused: "已聚焦",
    blurred: "已离开",
  },
  en: {
    intro: "Editable JSON using Mapseek semantic tokens, shown with and without a title bar.",
    untitled: "App theme · focus state",
    titled: "App theme · title bar",
    editorAriaLabel: "Style JSON editor",
    focused: "Focused",
    blurred: "Blurred",
  },
}

export function JsonEditorDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [value, setValue] = useState<unknown>(sample)
  const [status, setStatus] = useState(demoLabels.blurred)

  return (
    <div className="flex w-full max-w-[960px] flex-col gap-4">
      <p className="m-0 text-body-sm text-muted-foreground">{demoLabels.intro}</p>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-body-sm text-muted-foreground">
              {demoLabels.untitled}
            </span>
            <span
              data-demo-status="json-editor"
              className="font-mono text-body-sm text-muted-foreground"
            >
              {status}
            </span>
          </div>
          <div className="h-[360px]">
            <JsonEditor
              value={value}
              onChange={setValue}
              ariaLabel={demoLabels.editorAriaLabel}
              onFocus={() => setStatus(demoLabels.focused)}
              onBlur={() => setStatus(demoLabels.blurred)}
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-body-sm text-muted-foreground">{demoLabels.titled}</span>
          <div className="h-[360px]">
            <JsonEditor value={value} onChange={setValue} title="JSON" />
          </div>
        </div>
      </div>
      <pre className="m-0 max-h-[180px] min-w-0 max-w-full !overflow-auto border border-border bg-muted/30 p-2 font-mono text-body-md">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

import { JsonEditor } from "@registry/blocks/json-editor"
import { ToggleGroup, ToggleGroupItem } from "@registry/ui/toggle-group"
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

const themeOptions = ["app", "light", "dark", "none"] as const
type DemoTheme = (typeof themeOptions)[number]

const labels = {
  "zh-CN": {
    intro: "可独立嵌入的 JSON 编辑器；切换 app、light、dark 和 none 主题进行对比。",
    themeSelector: "JSON 编辑器主题",
    untitled: "无标题 · 焦点状态",
    titled: "标题栏",
    ariaLabel: "样式 JSON 编辑器",
    focused: "已聚焦",
    blurred: "已离开",
  },
  en: {
    intro: "A standalone JSON editor with app, light, dark, and none themes for comparison.",
    themeSelector: "JSON editor theme",
    untitled: "Untitled · focus state",
    titled: "Title bar",
    ariaLabel: "Styled JSON editor",
    focused: "Focused",
    blurred: "Blurred",
  },
} as const

export function JsonEditorDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [value, setValue] = useState<unknown>(sample)
  const [theme, setTheme] = useState<DemoTheme>("app")
  const [status, setStatus] = useState<string>(demoLabels.blurred)

  return (
    <div className="flex w-full max-w-[960px] flex-col gap-4">
      <p className="m-0 text-body-md text-muted-foreground">{demoLabels.intro}</p>
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          value={[theme]}
          onValueChange={(nextThemes) => {
            const nextTheme = nextThemes[0] as DemoTheme | undefined
            if (nextTheme) setTheme(nextTheme)
          }}
          aria-label={demoLabels.themeSelector}
          variant="outline"
          size="sm"
          spacing={0}
        >
          {themeOptions.map((option) => (
            <ToggleGroupItem
              key={option}
              value={option}
              data-demo-action={`theme-${option}`}
              className="font-mono uppercase"
            >
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <span
          data-demo-status="json-editor"
          className="font-mono text-body-sm text-muted-foreground"
        >
          {status}
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-body-sm text-muted-foreground">
            {demoLabels.untitled} · {theme}
          </span>
          <div className="h-[360px]">
            <JsonEditor
              value={value}
              onChange={setValue}
              ariaLabel={demoLabels.ariaLabel}
              theme={theme}
              onFocus={() => setStatus(demoLabels.focused)}
              onBlur={() => setStatus(demoLabels.blurred)}
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-body-sm text-muted-foreground">{demoLabels.titled}</span>
          <div className="h-[360px]">
            <JsonEditor value={value} onChange={setValue} title="JSON" theme={theme} />
          </div>
        </div>
      </div>
      <pre className="m-0 max-h-[180px] min-w-0 max-w-full !overflow-auto border border-border bg-muted/30 p-2 font-mono text-body-sm !leading-4">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

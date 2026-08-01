import { JsonEditor, type JsonEditorTheme } from "@registry/blocks/json-editor"
import { Button } from "@registry/ui/button"
import { useState } from "react"

const sample = {
  version: 8,
  source: "workspace:roads",
  paint: {
    "line-color": "#188a42",
    "line-width": 2,
  },
}

const themes = ["app", "light", "dark", "none"] as const
type ThemeId = Extract<JsonEditorTheme, (typeof themes)[number]>

export type JsonEditorDemoLabels = {
  readonly intro: string
  readonly theme: string
  readonly current: string
  readonly titled: string
  readonly focused: string
  readonly blurred: string
}

export const zhJsonEditorLabels = {
  intro: "可编辑 JSON 组件，默认 app 主题使用 Mapseek token，也可切换 UIW light / dark / none。",
  theme: "主题",
  current: "当前主题",
  titled: "app 主题 · 标题栏",
  focused: "已聚焦",
  blurred: "已离开",
} satisfies JsonEditorDemoLabels

export const enJsonEditorLabels = {
  intro:
    "Editable JSON component. The app theme uses Mapseek tokens; UIW light / dark / none are available.",
  theme: "theme",
  current: "Current theme",
  titled: "App theme · title bar",
  focused: "Focused",
  blurred: "Blurred",
} satisfies JsonEditorDemoLabels

export function JsonEditorDemo({ labels }: { readonly labels: JsonEditorDemoLabels }) {
  const [value, setValue] = useState<unknown>(sample)
  const [theme, setTheme] = useState<ThemeId>("app")
  const [status, setStatus] = useState(labels.blurred)

  return (
    <div data-demo="json-editor" className="flex w-full max-w-[960px] flex-col gap-4">
      <p className="m-0 text-xs text-muted-foreground">{labels.intro}</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">{labels.theme}</span>
        <div className="flex">
          {themes.map((item, index) => (
            <Button
              key={item}
              type="button"
              variant="ghost"
              data-demo-action={`theme-${item}`}
              onClick={() => setTheme(item)}
              className={[
                "h-7 rounded-none border border-border px-3 font-mono text-[11px] leading-none",
                index > 0 ? "-ml-px" : "",
                theme === item
                  ? "bg-selection-bg text-primary hover:text-primary"
                  : "bg-background text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {item}
            </Button>
          ))}
        </div>
        <span data-demo-status="json-editor" className="font-mono text-xs text-muted-foreground">
          {status}
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            {labels.current} · {theme}
          </span>
          <div className="h-[360px]">
            <JsonEditor
              value={value}
              onChange={setValue}
              theme={theme}
              onFocus={() => setStatus(labels.focused)}
              onBlur={() => setStatus(labels.blurred)}
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">{labels.titled}</span>
          <div className="h-[360px]">
            <JsonEditor value={value} onChange={setValue} title="JSON" theme="app" />
          </div>
        </div>
      </div>
      <pre className="max-h-[180px] overflow-auto border border-border bg-muted/30 p-2 font-mono text-[11px]">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

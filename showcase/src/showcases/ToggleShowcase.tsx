import { Toggle } from "@registry/ui/toggle"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    textToggles: "文本切换",
    bold: "加粗",
    active: "激活",
    disabled: "禁用",
    invalid: "错误",
    controlled: "受控",
    snap: "吸附",
    pressedValue: (pressed: boolean) => `pressed = ${String(pressed)}`,
  },
  en: {
    textToggles: "Text toggles",
    bold: "Bold",
    active: "Active",
    disabled: "Disabled",
    invalid: "Invalid",
    controlled: "Controlled",
    snap: "Snap",
    pressedValue: (pressed: boolean) => `pressed = ${String(pressed)}`,
  },
}

export function ToggleOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [pressed, setPressed] = useState(false)
  const demoLabels = labels[locale]

  return (
    <div className="space-y-8">
      <section className="space-y-3" data-demo="toggle-text">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.textToggles}
        </h4>
        <div className="flex flex-wrap gap-2">
          <Toggle>{demoLabels.bold}</Toggle>
          <Toggle defaultPressed>{demoLabels.active}</Toggle>
          <Toggle disabled>{demoLabels.disabled}</Toggle>
          <Toggle aria-invalid>{demoLabels.invalid}</Toggle>
        </div>
      </section>

      <section className="space-y-3" data-demo="toggle-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.controlled}
        </h4>
        <div className="flex items-center gap-3">
          <Toggle pressed={pressed} onPressedChange={setPressed}>
            {demoLabels.snap}
          </Toggle>
          <span className="font-mono text-xs text-muted-foreground" data-demo="toggle-value">
            {demoLabels.pressedValue(pressed)}
          </span>
        </div>
      </section>
    </div>
  )
}

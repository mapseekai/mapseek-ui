import { ColorInput } from "@registry/ui/color-input"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    controlled: "受控颜色",
    colorLabel: "图层颜色",
    current: "当前颜色",
    openColor: "打开颜色选择器",
    disabled: "禁用状态",
    disabledLabel: "禁用颜色输入",
  },
  en: {
    controlled: "Controlled color",
    colorLabel: "Layer color",
    current: "Current color",
    openColor: "Open color picker",
    disabled: "Disabled state",
    disabledLabel: "Disabled color input",
  },
}

export function ColorInputOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [value, setValue] = useState("#2563eb")
  const demoLabels = labels[locale]

  return (
    <div className="grid w-full max-w-sm gap-8">
      <section className="space-y-3" data-demo="color-input-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.controlled}
        </h4>
        <div className="flex items-center gap-3">
          <ColorInput
            aria-label={demoLabels.colorLabel}
            swatchLabel={demoLabels.openColor}
            value={value}
            onTextChange={setValue}
          />
          <output className="font-mono text-sm" data-demo="color-input-value">
            {demoLabels.current}: {value}
          </output>
        </div>
      </section>

      <section className="space-y-3" data-demo="color-input-disabled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.disabled}
        </h4>
        <ColorInput
          aria-label={demoLabels.disabledLabel}
          swatchLabel={demoLabels.disabledLabel}
          defaultValue="#94a3b8"
          disabled
        />
      </section>
    </div>
  )
}

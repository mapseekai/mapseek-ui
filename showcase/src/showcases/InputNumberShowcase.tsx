import { InputNumber } from "@registry/ui/input-number"
import { useState } from "react"

import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    distance: "距离",
    opacity: "透明度",
    disabled: "禁用",
    hint: "聚焦输入框后，右侧单位会切换为减号和加号按钮。",
    value: (distance: number | null, opacity: number | null) =>
      `距离：${distance ?? "空"} km · 透明度：${opacity ?? "空"}%`,
  },
  en: {
    distance: "Distance",
    opacity: "Opacity",
    disabled: "Disabled",
    hint: "Focus an input to replace its unit with decrement and increment controls.",
    value: (distance: number | null, opacity: number | null) =>
      `Distance: ${distance ?? "empty"} km · Opacity: ${opacity ?? "empty"}%`,
  },
}

export function InputNumberOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [distance, setDistance] = useState<number | null>(12)
  const [opacity, setOpacity] = useState<number | null>(40)

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <p className="m-0 text-xs text-muted-foreground">{demoLabels.hint}</p>
      <div className="flex flex-col gap-2">
        <span id="distance-label" className="font-mono text-xs text-muted-foreground">
          {demoLabels.distance}
        </span>
        <InputNumber
          id="distance-input"
          aria-labelledby="distance-label"
          value={distance}
          min={0}
          max={100}
          step={0.5}
          unit="km"
          onValueChange={setDistance}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span id="opacity-label" className="font-mono text-xs text-muted-foreground">
          {demoLabels.opacity}
        </span>
        <InputNumber
          id="opacity-input"
          aria-labelledby="opacity-label"
          value={opacity}
          min={0}
          max={100}
          unit="%"
          onValueChange={setOpacity}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">{demoLabels.disabled}</span>
        <InputNumber aria-label={demoLabels.disabled} defaultValue={8} unit="m" disabled />
      </div>
      <output className="border border-border bg-muted/30 p-2 font-mono text-xs">
        {demoLabels.value(distance, opacity)}
      </output>
    </div>
  )
}

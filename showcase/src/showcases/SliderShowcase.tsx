import { Slider } from "@registry/ui/slider"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    controlled: "受控",
    layerOpacity: "图层不透明度",
    opacity: (value: number) => `不透明度：${value}%`,
    lowValue: "低值",
    lowOpacity: "低不透明度",
    disabled: "禁用",
    disabledOpacity: "禁用的不透明度",
  },
  en: {
    controlled: "Controlled",
    layerOpacity: "Layer opacity",
    opacity: (value: number) => `Opacity: ${value}%`,
    lowValue: "Low value",
    lowOpacity: "Low opacity",
    disabled: "Disabled",
    disabledOpacity: "Disabled opacity",
  },
}

export function SliderOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [opacity, setOpacity] = useState<readonly number[]>([50])
  const demoLabels = labels[locale]
  const opacityValue = opacity.at(0) ?? 0
  const handleOpacityChange = (nextValue: number | readonly number[]) => {
    setOpacity(typeof nextValue === "number" ? [nextValue] : nextValue)
  }

  return (
    <div className="max-w-sm space-y-8">
      <section className="space-y-3" data-demo="slider-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.controlled}
        </h4>
        <Slider
          aria-label={demoLabels.layerOpacity}
          value={opacity}
          onValueChange={handleOpacityChange}
          max={100}
          step={1}
        />
        <p className="text-xs text-muted-foreground" data-demo="slider-value">
          {demoLabels.opacity(opacityValue)}
        </p>
      </section>

      <section className="space-y-3" data-demo="slider-low">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.lowValue}
        </h4>
        <Slider aria-label={demoLabels.lowOpacity} defaultValue={[10]} max={100} step={1} />
      </section>

      <section className="space-y-3" data-demo="slider-disabled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.disabled}
        </h4>
        <Slider
          aria-label={demoLabels.disabledOpacity}
          defaultValue={[70]}
          max={100}
          step={1}
          disabled
        />
      </section>
    </div>
  )
}

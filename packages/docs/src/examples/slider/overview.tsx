import { Slider } from "@registry/ui/slider"
import { useState } from "react"
import { useLocaleLabels } from "../use-locale-labels"

export type SliderOverviewDemoLabels = {
  readonly controlled: string
  readonly layerOpacity: string
  readonly opacity: (value: number) => string
  readonly lowValue: string
  readonly lowOpacity: string
  readonly disabled: string
  readonly disabledOpacity: string
}

export const zhSliderOverviewLabels = {
  controlled: "受控",
  layerOpacity: "图层不透明度",
  opacity: (value: number) => `不透明度：${value}%`,
  lowValue: "低值",
  lowOpacity: "低不透明度",
  disabled: "禁用",
  disabledOpacity: "禁用的不透明度",
} satisfies SliderOverviewDemoLabels

export const enSliderOverviewLabels = {
  controlled: "Controlled",
  layerOpacity: "Layer opacity",
  opacity: (value: number) => `Opacity: ${value}%`,
  lowValue: "Low value",
  lowOpacity: "Low opacity",
  disabled: "Disabled",
  disabledOpacity: "Disabled opacity",
} satisfies SliderOverviewDemoLabels

export function SliderOverviewDemo({ labels }: { readonly labels?: SliderOverviewDemoLabels }) {
  const [opacity, setOpacity] = useState<readonly number[]>([50])
  const localizedLabels = useLocaleLabels({
    zh: zhSliderOverviewLabels,
    en: enSliderOverviewLabels,
  })
  const demoLabels = labels ?? localizedLabels
  const opacityValue = opacity.at(0) ?? 0
  const handleOpacityChange = (nextValue: number | readonly number[]) => {
    setOpacity(typeof nextValue === "number" ? [nextValue] : nextValue)
  }

  return (
    <div className="max-w-sm space-y-8" data-demo="slider-overview">
      <section className="space-y-3" data-demo="slider-controlled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
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
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.lowValue}
        </h4>
        <Slider aria-label={demoLabels.lowOpacity} defaultValue={[10]} max={100} step={1} />
      </section>

      <section className="space-y-3" data-demo="slider-disabled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
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

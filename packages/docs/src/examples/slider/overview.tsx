import { Slider } from "@registry/ui/slider"
import { useState } from "react"

export function SliderOverviewDemo() {
  const [opacity, setOpacity] = useState<readonly number[]>([50])
  const opacityValue = opacity.at(0) ?? 0
  const handleOpacityChange = (nextValue: number | readonly number[]) => {
    setOpacity(typeof nextValue === "number" ? [nextValue] : nextValue)
  }

  return (
    <div className="max-w-sm space-y-8" data-demo="slider-overview">
      <section className="space-y-3" data-demo="slider-controlled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Controlled
        </h4>
        <Slider
          aria-label="Layer opacity"
          value={opacity}
          onValueChange={handleOpacityChange}
          max={100}
          step={1}
        />
        <p className="text-xs text-muted-foreground" data-demo="slider-value">
          Opacity: {opacityValue}%
        </p>
      </section>

      <section className="space-y-3" data-demo="slider-low">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Low value
        </h4>
        <Slider aria-label="Low opacity" defaultValue={[10]} max={100} step={1} />
      </section>

      <section className="space-y-3" data-demo="slider-disabled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Disabled
        </h4>
        <Slider aria-label="Disabled opacity" defaultValue={[70]} max={100} step={1} disabled />
      </section>
    </div>
  )
}

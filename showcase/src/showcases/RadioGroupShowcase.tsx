import { Radio, RadioGroup } from "@registry/ui/radio-group"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    title: "底图样式",
    groupLabel: "选择底图样式",
    selected: "当前选择",
    streets: "街道",
    satellite: "卫星",
    terrain: "地形",
  },
  en: {
    title: "Basemap style",
    groupLabel: "Choose a basemap style",
    selected: "Selected",
    streets: "Streets",
    satellite: "Satellite",
    terrain: "Terrain",
  },
}

export function RadioGroupOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [value, setValue] = useState("streets")
  const demoLabels = labels[locale]
  const options = [
    ["streets", demoLabels.streets],
    ["satellite", demoLabels.satellite],
    ["terrain", demoLabels.terrain],
  ] as const

  return (
    <section className="w-full max-w-sm space-y-3" data-demo="radio-group-controlled">
      <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
        {demoLabels.title}
      </h4>
      <RadioGroup
        aria-label={demoLabels.groupLabel}
        className="grid gap-3"
        value={value}
        onValueChange={setValue}
      >
        {options.map(([optionValue, label]) => (
          <label
            key={optionValue}
            htmlFor={`docs-radio-${optionValue}`}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <Radio id={`docs-radio-${optionValue}`} value={optionValue} />
            {label}
          </label>
        ))}
      </RadioGroup>
      <p className="text-xs text-muted-foreground" data-demo="radio-group-value">
        {demoLabels.selected}: {options.find(([optionValue]) => optionValue === value)?.[1]}
      </p>
    </section>
  )
}

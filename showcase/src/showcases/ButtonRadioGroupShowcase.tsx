import { Button } from "@registry/ui/button"
import { ButtonRadioGroup, ButtonRadioGroupItem } from "@registry/ui/button-radio-group"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

type Option = {
  readonly label: string
  readonly value: string
}

const labels = {
  "zh-CN": {
    add: "添加图层",
    groupLabel: "选择活动图层",
    layer: (index: number) => `图层 ${index}`,
    selected: "当前选择",
    title: "按钮式单选",
  },
  en: {
    add: "Add layer",
    groupLabel: "Choose an active layer",
    layer: (index: number) => `Layer ${index}`,
    selected: "Selected",
    title: "Button radio group",
  },
}

function initialOptions(demoLabels: (typeof labels)["zh-CN"]): Option[] {
  return [1, 2, 3].map((index) => ({ label: demoLabels.layer(index), value: `layer-${index}` }))
}

export function ButtonRadioGroupOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [options, setOptions] = useState(() => initialOptions(demoLabels))
  const [value, setValue] = useState("layer-1")
  const selected = options.find((option) => option.value === value)

  function addOption() {
    setOptions((current) => {
      const index = current.length + 1
      return [...current, { label: demoLabels.layer(index), value: `layer-${index}` }]
    })
  }

  return (
    <section
      className="flex w-full max-w-xs flex-col gap-3"
      data-demo="button-radio-group-controlled"
    >
      <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
        {demoLabels.title}
      </h4>
      <ButtonRadioGroup aria-label={demoLabels.groupLabel} value={value} onValueChange={setValue}>
        {options.map((option) => (
          <ButtonRadioGroupItem
            key={option.value}
            data-demo-action={`button-radio-group-${option.value}`}
            value={option.value}
          >
            {option.label}
          </ButtonRadioGroupItem>
        ))}
      </ButtonRadioGroup>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="button-radio-group-add"
          onClick={addOption}
        >
          {demoLabels.add}
        </Button>
        <p className="text-xs text-muted-foreground" data-demo="button-radio-group-value">
          {demoLabels.selected}: {selected?.label}
        </p>
      </div>
    </section>
  )
}

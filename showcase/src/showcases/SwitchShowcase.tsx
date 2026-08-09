import { Switch } from "@registry/ui/switch"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    sizes: "尺寸",
    smallEnabledSwitch: "小尺寸启用开关",
    defaultEnabledSwitch: "默认启用开关",
    states: "状态",
    uncheckedSwitch: "未选中开关",
    checkedSwitch: "已选中开关",
    disabledSwitch: "禁用开关",
    disabledCheckedSwitch: "禁用已选中开关",
    invalidSwitch: "错误开关",
    variants: "变体",
    roundedUnchecked: "默认圆角开关（未选中）",
    roundedChecked: "默认圆角开关（已选中）",
    squareUnchecked: "紧凑直角开关（未选中）",
    squareChecked: "紧凑直角开关（已选中）",
    controlled: "受控",
    enableTileCache: "启用瓦片缓存",
    checkedValue: (checked: boolean) => `checked = ${String(checked)}`,
  },
  en: {
    sizes: "Sizes",
    smallEnabledSwitch: "Small enabled switch",
    defaultEnabledSwitch: "Default enabled switch",
    states: "States",
    uncheckedSwitch: "Unchecked switch",
    checkedSwitch: "Checked switch",
    disabledSwitch: "Disabled switch",
    disabledCheckedSwitch: "Disabled checked switch",
    invalidSwitch: "Invalid switch",
    variants: "Variants",
    roundedUnchecked: "Default rounded switch, unchecked",
    roundedChecked: "Default rounded switch, checked",
    squareUnchecked: "Compact square switch, unchecked",
    squareChecked: "Compact square switch, checked",
    controlled: "Controlled",
    enableTileCache: "Enable tile cache",
    checkedValue: (checked: boolean) => `checked = ${String(checked)}`,
  },
}

export function SwitchOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [checked, setChecked] = useState(false)
  const demoLabels = labels[locale]

  return (
    <div className="space-y-8 px-3">
      <section className="space-y-3" data-demo="switch-sizes">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.sizes}
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <Switch size="sm" defaultChecked aria-label={demoLabels.smallEnabledSwitch} />
          <Switch size="default" defaultChecked aria-label={demoLabels.defaultEnabledSwitch} />
        </div>
      </section>

      <section className="space-y-3" data-demo="switch-states">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.states}
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <Switch aria-label={demoLabels.uncheckedSwitch} />
          <Switch defaultChecked aria-label={demoLabels.checkedSwitch} />
          <Switch disabled aria-label={demoLabels.disabledSwitch} />
          <Switch disabled defaultChecked aria-label={demoLabels.disabledCheckedSwitch} />
          <Switch aria-invalid aria-label={demoLabels.invalidSwitch} />
        </div>
      </section>

      <section className="space-y-3" data-demo="switch-variants">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.variants}
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <Switch aria-label={demoLabels.roundedUnchecked} />
          <Switch defaultChecked aria-label={demoLabels.roundedChecked} />
          <Switch variant="square" aria-label={demoLabels.squareUnchecked} />
          <Switch variant="square" defaultChecked aria-label={demoLabels.squareChecked} />
        </div>
      </section>

      <section className="space-y-3" data-demo="switch-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.controlled}
        </h4>
        <div className="flex items-center gap-3">
          <Switch
            aria-label={demoLabels.enableTileCache}
            checked={checked}
            onCheckedChange={setChecked}
          />
          <span className="font-mono text-xs text-muted-foreground" data-demo="switch-value">
            {demoLabels.checkedValue(checked)}
          </span>
        </div>
      </section>
    </div>
  )
}

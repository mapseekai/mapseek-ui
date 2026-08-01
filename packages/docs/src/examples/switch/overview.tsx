import { Switch } from "@registry/ui/switch"
import { useState } from "react"
import { useLocaleLabels } from "../use-locale-labels"

export type SwitchOverviewDemoLabels = {
  readonly sizes: string
  readonly smallEnabledSwitch: string
  readonly defaultEnabledSwitch: string
  readonly states: string
  readonly uncheckedSwitch: string
  readonly checkedSwitch: string
  readonly disabledSwitch: string
  readonly disabledCheckedSwitch: string
  readonly invalidSwitch: string
  readonly controlled: string
  readonly enableTileCache: string
  readonly checkedValue: (checked: boolean) => string
}

export const zhSwitchOverviewLabels = {
  sizes: "尺寸",
  smallEnabledSwitch: "小尺寸启用开关",
  defaultEnabledSwitch: "默认启用开关",
  states: "状态",
  uncheckedSwitch: "未选中开关",
  checkedSwitch: "已选中开关",
  disabledSwitch: "禁用开关",
  disabledCheckedSwitch: "禁用已选中开关",
  invalidSwitch: "错误开关",
  controlled: "受控",
  enableTileCache: "启用瓦片缓存",
  checkedValue: (checked: boolean) => `checked = ${String(checked)}`,
} satisfies SwitchOverviewDemoLabels

export const enSwitchOverviewLabels = {
  sizes: "Sizes",
  smallEnabledSwitch: "Small enabled switch",
  defaultEnabledSwitch: "Default enabled switch",
  states: "States",
  uncheckedSwitch: "Unchecked switch",
  checkedSwitch: "Checked switch",
  disabledSwitch: "Disabled switch",
  disabledCheckedSwitch: "Disabled checked switch",
  invalidSwitch: "Invalid switch",
  controlled: "Controlled",
  enableTileCache: "Enable tile cache",
  checkedValue: (checked: boolean) => `checked = ${String(checked)}`,
} satisfies SwitchOverviewDemoLabels

export function SwitchOverviewDemo({ labels }: { readonly labels?: SwitchOverviewDemoLabels }) {
  const [checked, setChecked] = useState(false)
  const localizedLabels = useLocaleLabels({
    zh: zhSwitchOverviewLabels,
    en: enSwitchOverviewLabels,
  })
  const demoLabels = labels ?? localizedLabels

  return (
    <div className="space-y-8 px-3" data-demo="switch-overview">
      <section className="space-y-3" data-demo="switch-sizes">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.sizes}
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <Switch size="sm" defaultChecked aria-label={demoLabels.smallEnabledSwitch} />
          <Switch size="default" defaultChecked aria-label={demoLabels.defaultEnabledSwitch} />
        </div>
      </section>

      <section className="space-y-3" data-demo="switch-states">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
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

      <section className="space-y-3" data-demo="switch-controlled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
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

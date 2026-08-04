import { Checkbox } from "@registry/ui/checkbox"
import { Label } from "@registry/ui/label"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    states: "状态",
    unchecked: "未选中",
    checked: "已选中",
    invalidSelected: "错误选中",
    disabled: "禁用",
    controlled: "受控",
    includedInExport: "已包含在导出中",
    includeInExport: "包含在导出中",
  },
  en: {
    states: "States",
    unchecked: "Unchecked",
    checked: "Checked",
    invalidSelected: "Invalid selected",
    disabled: "Disabled",
    controlled: "Controlled",
    includedInExport: "Included in export",
    includeInExport: "Include in export",
  },
}

export function CheckboxOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [checked, setChecked] = useState(false)
  const demoLabels = labels[locale]
  return (
    <div className="space-y-8">
      <section className="space-y-3" data-demo="checkbox-states">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.states}
        </h4>
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="docs-checkbox-unchecked" checked={false} />
            <Label htmlFor="docs-checkbox-unchecked">{demoLabels.unchecked}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="docs-checkbox-checked" checked />
            <Label htmlFor="docs-checkbox-checked">{demoLabels.checked}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="docs-checkbox-invalid" aria-invalid checked />
            <Label htmlFor="docs-checkbox-invalid">{demoLabels.invalidSelected}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="docs-checkbox-disabled" disabled />
            <Label htmlFor="docs-checkbox-disabled">{demoLabels.disabled}</Label>
          </div>
        </div>
      </section>
      <section className="space-y-3" data-demo="checkbox-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.controlled}
        </h4>
        <div className="flex items-center gap-2">
          <Checkbox id="docs-checkbox-interactive" checked={checked} onCheckedChange={setChecked} />
          <Label htmlFor="docs-checkbox-interactive">
            {checked ? demoLabels.includedInExport : demoLabels.includeInExport}
          </Label>
        </div>
      </section>
    </div>
  )
}

import { Checkbox } from "@registry/ui/checkbox"
import { Label } from "@registry/ui/label"
import { useState } from "react"
import { useLocaleLabels } from "../use-locale-labels"

export type CheckboxOverviewDemoLabels = {
  readonly states: string
  readonly unchecked: string
  readonly checked: string
  readonly invalidSelected: string
  readonly disabled: string
  readonly controlled: string
  readonly includedInExport: string
  readonly includeInExport: string
}

export const zhCheckboxOverviewLabels = {
  states: "状态",
  unchecked: "未选中",
  checked: "已选中",
  invalidSelected: "错误选中",
  disabled: "禁用",
  controlled: "受控",
  includedInExport: "已包含在导出中",
  includeInExport: "包含在导出中",
} satisfies CheckboxOverviewDemoLabels

export const enCheckboxOverviewLabels = {
  states: "States",
  unchecked: "Unchecked",
  checked: "Checked",
  invalidSelected: "Invalid selected",
  disabled: "Disabled",
  controlled: "Controlled",
  includedInExport: "Included in export",
  includeInExport: "Include in export",
} satisfies CheckboxOverviewDemoLabels

export function CheckboxOverviewDemo({ labels }: { readonly labels?: CheckboxOverviewDemoLabels }) {
  const [checked, setChecked] = useState(false)
  const localizedLabels = useLocaleLabels({
    zh: zhCheckboxOverviewLabels,
    en: enCheckboxOverviewLabels,
  })
  const demoLabels = labels ?? localizedLabels

  return (
    <div className="space-y-8" data-demo="checkbox-overview">
      <section className="space-y-3" data-demo="checkbox-states">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
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
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
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

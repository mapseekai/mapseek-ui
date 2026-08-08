import { Checkbox } from "@registry/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@registry/ui/field"
import { Input } from "@registry/ui/input"

import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    basicField: "必填字段",
    datasetName: "数据集名称",
    enterName: "输入名称...",
    displayNameDescription: "用作图层列表中的显示名称。",
    invalidField: "错误字段",
    crs: "CRS",
    epsgError: "必须是有效 EPSG 编码，例如 EPSG:4326",
    horizontalControl: "水平控件",
    preserveTopology: "保留拓扑",
    disabledField: "禁用字段",
    lockedLayerId: "锁定图层 ID",
  },
  en: {
    basicField: "Required field",
    datasetName: "Dataset Name",
    enterName: "Enter name...",
    displayNameDescription: "Used as the display name in the layer list.",
    invalidField: "Invalid field",
    crs: "CRS",
    epsgError: "Must be a valid EPSG code, e.g. EPSG:4326",
    horizontalControl: "Horizontal control",
    preserveTopology: "Preserve topology",
    disabledField: "Disabled field",
    lockedLayerId: "Locked layer id",
  },
}

export function FieldOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="grid w-full max-w-sm gap-8">
      <section className="space-y-3" data-demo="field-basic">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.basicField}
        </h4>
        <Field>
          <FieldLabel required htmlFor="docs-field-name">
            {demoLabels.datasetName}
          </FieldLabel>
          <Input id="docs-field-name" required placeholder={demoLabels.enterName} />
          <FieldDescription>{demoLabels.displayNameDescription}</FieldDescription>
        </Field>
      </section>

      <section className="space-y-3" data-demo="field-invalid">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.invalidField}
        </h4>
        <Field data-invalid="true">
          <FieldLabel htmlFor="docs-field-crs">{demoLabels.crs}</FieldLabel>
          <Input id="docs-field-crs" aria-invalid defaultValue="not-a-crs" />
          <FieldError>{demoLabels.epsgError}</FieldError>
        </Field>
      </section>

      <section className="space-y-3" data-demo="field-horizontal">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.horizontalControl}
        </h4>
        <Field orientation="horizontal">
          <Checkbox id="docs-field-topology" defaultChecked />
          <FieldLabel htmlFor="docs-field-topology">{demoLabels.preserveTopology}</FieldLabel>
        </Field>
      </section>

      <section className="space-y-3" data-demo="field-disabled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.disabledField}
        </h4>
        <Field data-disabled>
          <FieldLabel htmlFor="docs-field-locked">{demoLabels.lockedLayerId}</FieldLabel>
          <Input id="docs-field-locked" value="layer-roads-01" readOnly disabled />
        </Field>
      </section>
    </div>
  )
}

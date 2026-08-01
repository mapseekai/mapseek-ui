import { Checkbox } from "@registry/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@registry/ui/field"
import { Input } from "@registry/ui/input"
import { useLocaleLabels } from "../use-locale-labels"

export type FieldOverviewDemoLabels = {
  readonly basicField: string
  readonly datasetName: string
  readonly enterName: string
  readonly displayNameDescription: string
  readonly invalidField: string
  readonly crs: string
  readonly epsgError: string
  readonly horizontalControl: string
  readonly preserveTopology: string
  readonly disabledField: string
  readonly lockedLayerId: string
}

export const zhFieldOverviewLabels = {
  basicField: "基础字段",
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
} satisfies FieldOverviewDemoLabels

export const enFieldOverviewLabels = {
  basicField: "Basic field",
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
} satisfies FieldOverviewDemoLabels

export function FieldOverviewDemo({ labels }: { readonly labels?: FieldOverviewDemoLabels }) {
  const localizedLabels = useLocaleLabels({ zh: zhFieldOverviewLabels, en: enFieldOverviewLabels })
  const demoLabels = labels ?? localizedLabels

  return (
    <div className="grid max-w-3xl gap-8" data-demo="field-overview">
      <section className="space-y-3" data-demo="field-basic">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.basicField}
        </h4>
        <Field>
          <FieldLabel htmlFor="docs-field-name">{demoLabels.datasetName}</FieldLabel>
          <Input id="docs-field-name" placeholder={demoLabels.enterName} />
          <FieldDescription>{demoLabels.displayNameDescription}</FieldDescription>
        </Field>
      </section>

      <section className="space-y-3" data-demo="field-invalid">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.invalidField}
        </h4>
        <Field data-invalid="true">
          <FieldLabel htmlFor="docs-field-crs">{demoLabels.crs}</FieldLabel>
          <Input id="docs-field-crs" aria-invalid defaultValue="not-a-crs" />
          <FieldError>{demoLabels.epsgError}</FieldError>
        </Field>
      </section>

      <section className="space-y-3" data-demo="field-horizontal">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.horizontalControl}
        </h4>
        <Field orientation="horizontal">
          <Checkbox id="docs-field-topology" defaultChecked />
          <FieldLabel htmlFor="docs-field-topology">{demoLabels.preserveTopology}</FieldLabel>
        </Field>
      </section>

      <section className="space-y-3" data-demo="field-disabled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
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

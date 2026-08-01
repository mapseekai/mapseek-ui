import { Input } from "@registry/ui/input"
import { Label } from "@registry/ui/label"
import { useLocaleLabels } from "../use-locale-labels"

export type LabelOverviewDemoLabels = {
  readonly basic: string
  readonly datasetName: string
  readonly enterName: string
  readonly requiredMarker: string
  readonly crs: string
  readonly disabledPeer: string
  readonly lockedAttribute: string
}

export const zhLabelOverviewLabels = {
  basic: "基础",
  datasetName: "数据集名称",
  enterName: "输入名称...",
  requiredMarker: "必填标记",
  crs: "CRS",
  disabledPeer: "禁用 peer",
  lockedAttribute: "锁定属性",
} satisfies LabelOverviewDemoLabels

export const enLabelOverviewLabels = {
  basic: "Basic",
  datasetName: "Dataset Name",
  enterName: "Enter name...",
  requiredMarker: "Required marker",
  crs: "CRS",
  disabledPeer: "Disabled peer",
  lockedAttribute: "Locked attribute",
} satisfies LabelOverviewDemoLabels

export function LabelOverviewDemo({ labels }: { readonly labels?: LabelOverviewDemoLabels }) {
  const localizedLabels = useLocaleLabels({ zh: zhLabelOverviewLabels, en: enLabelOverviewLabels })
  const demoLabels = labels ?? localizedLabels

  return (
    <div className="grid max-w-3xl gap-8" data-demo="label-overview">
      <section className="space-y-3" data-demo="label-basic">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.basic}
        </h4>
        <div className="space-y-2">
          <Label htmlFor="docs-label-name">{demoLabels.datasetName}</Label>
          <Input id="docs-label-name" placeholder={demoLabels.enterName} />
        </div>
      </section>

      <section className="space-y-3" data-demo="label-required">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.requiredMarker}
        </h4>
        <div className="space-y-2">
          <Label htmlFor="docs-label-crs">
            {demoLabels.crs} <span className="text-destructive">*</span>
          </Label>
          <Input id="docs-label-crs" placeholder="EPSG:4326" />
        </div>
      </section>

      <section className="space-y-3" data-demo="label-disabled-peer">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.disabledPeer}
        </h4>
        <div className="space-y-2">
          <Label htmlFor="docs-label-disabled">{demoLabels.lockedAttribute}</Label>
          <Input id="docs-label-disabled" className="peer" disabled value="system:id" />
        </div>
      </section>
    </div>
  )
}

import { Input } from "@registry/ui/input"
import { Label } from "@registry/ui/label"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    basic: "基础",
    datasetName: "数据集名称",
    enterName: "输入名称...",
    requiredMarker: "必填标记",
    crs: "CRS",
    disabledPeer: "禁用 peer",
    lockedAttribute: "锁定属性",
  },
  en: {
    basic: "Basic",
    datasetName: "Dataset Name",
    enterName: "Enter name...",
    requiredMarker: "Required marker",
    crs: "CRS",
    disabledPeer: "Disabled peer",
    lockedAttribute: "Locked attribute",
  },
}

export function LabelOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="grid w-full max-w-sm gap-8">
      <section className="space-y-3" data-demo="label-basic">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.basic}
        </h4>
        <div className="space-y-2">
          <Label htmlFor="docs-label-name">{demoLabels.datasetName}</Label>
          <Input id="docs-label-name" placeholder={demoLabels.enterName} />
        </div>
      </section>

      <section className="space-y-3" data-demo="label-required">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
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
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
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

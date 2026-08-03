import { Input } from "@registry/ui/input"
import { type ChangeEvent, useState } from "react"

import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    default: "默认",
    typeSomething: "输入内容...",
    controlled: "受控",
    datasetFile: "数据集文件",
    value: (value: string) => `当前值：${value}`,
    readOnly: "只读",
    readOnlyCrs: "只读 CRS",
    disabledAndInvalid: "禁用与错误",
    disabled: "禁用",
    invalidField: "错误字段",
  },
  en: {
    default: "Default",
    typeSomething: "Type something...",
    controlled: "Controlled",
    datasetFile: "Dataset file",
    value: (value: string) => `Value: ${value}`,
    readOnly: "Read only",
    readOnlyCrs: "Read only CRS",
    disabledAndInvalid: "Disabled and invalid",
    disabled: "Disabled",
    invalidField: "Invalid field",
  },
}

export function InputOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [value, setValue] = useState("roads-2026.geojson")
  const demoLabels = labels[locale]

  return (
    <div className="max-w-sm space-y-8">
      <section className="space-y-3" data-demo="input-default">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.default}
        </h4>
        <Input placeholder={demoLabels.typeSomething} />
      </section>

      <section className="space-y-3" data-demo="input-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.controlled}
        </h4>
        <Input
          aria-label={demoLabels.datasetFile}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.currentTarget.value)}
        />
        <p className="text-xs text-muted-foreground" data-demo="input-value">
          {demoLabels.value(value)}
        </p>
      </section>

      <section className="space-y-3" data-demo="input-readonly">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.readOnly}
        </h4>
        <Input readOnly value="EPSG:4326" aria-label={demoLabels.readOnlyCrs} />
      </section>

      <section className="space-y-3" data-demo="input-disabled-invalid">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.disabledAndInvalid}
        </h4>
        <Input placeholder={demoLabels.disabled} disabled />
        <Input aria-invalid placeholder={demoLabels.invalidField} />
      </section>
    </div>
  )
}

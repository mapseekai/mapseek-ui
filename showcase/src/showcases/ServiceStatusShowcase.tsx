import { ServiceStatus, type ServiceStatusLabels } from "@registry/blocks/service-status"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    running: "服务运行中",
    stopped: "服务已停止",
    status: "running",
  } satisfies ServiceStatusLabels & { readonly status: string },
  en: {
    running: "Service running",
    stopped: "Service stopped",
    status: "running",
  } satisfies ServiceStatusLabels & { readonly status: string },
}

export function ServiceStatusDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [running, setRunning] = useState(true)

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-wrap gap-3">
        <ServiceStatus running labels={demoLabels} />
        <ServiceStatus running={false} labels={demoLabels} />
      </section>
      <section className="flex flex-wrap items-center gap-3">
        <ServiceStatus running={running} labels={demoLabels} onChange={setRunning} />
        <span data-demo-status="service-status" className="font-mono text-xs text-muted-foreground">
          {demoLabels.status} = {String(running)}
        </span>
      </section>
      <section className="flex flex-wrap gap-3">
        <ServiceStatus running labels={demoLabels} disabled />
        <ServiceStatus running={false} labels={demoLabels} disabled variant="inline" />
      </section>
    </div>
  )
}

import { ServiceStatus, type ServiceStatusLabels } from "@registry/blocks/service-status"
import { useState } from "react"

export const zhServiceStatusLabels = {
  running: "服务运行中",
  stopped: "服务已停止",
  status: "running",
} satisfies ServiceStatusLabels & { readonly status: string }

export const enServiceStatusLabels = {
  running: "Service running",
  stopped: "Service stopped",
  status: "running",
} satisfies ServiceStatusLabels & { readonly status: string }

export function ServiceStatusDemo({ labels }: { readonly labels: typeof zhServiceStatusLabels }) {
  const [running, setRunning] = useState(true)

  return (
    <div data-demo="service-status" className="flex flex-col gap-5">
      <section className="flex flex-wrap gap-3">
        <ServiceStatus running labels={labels} />
        <ServiceStatus running={false} labels={labels} />
      </section>
      <section className="flex flex-wrap items-center gap-3">
        <ServiceStatus running={running} labels={labels} onChange={setRunning} />
        <span data-demo-status="service-status" className="font-mono text-xs text-muted-foreground">
          {labels.status} = {String(running)}
        </span>
      </section>
      <section className="flex flex-wrap gap-3">
        <ServiceStatus running labels={labels} disabled />
        <ServiceStatus running={false} labels={labels} disabled variant="inline" />
      </section>
    </div>
  )
}

import { ResourceStatusBadge, type ResourceStatusTone } from "@registry/blocks/resource-status"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const tones: { readonly tone: ResourceStatusTone; readonly zh: string; readonly en: string }[] = [
  { tone: "ready", zh: "已就绪", en: "Ready" },
  { tone: "processing", zh: "处理中", en: "Processing" },
  { tone: "failed", zh: "失败", en: "Failed" },
  { tone: "neutral", zh: "未发布", en: "Unpublished" },
]

const labels = {
  "zh-CN": {
    next: "下一个状态",
    status: "当前状态",
    locale: "zh",
  },
  en: {
    next: "Next status",
    status: "Current status",
    locale: "en",
  },
}

export function ResourceStatusDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [index, setIndex] = useState(0)
  const active = tones[index]
  const labelKey = demoLabels.locale === "zh" ? "zh" : "en"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="resource-status-next"
          onClick={() => setIndex((current) => (current + 1) % tones.length)}
        >
          {demoLabels.next}
        </Button>
        <span
          data-demo-status="resource-status"
          className="font-mono text-xs text-muted-foreground"
        >
          {demoLabels.status}: {active.tone}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {tones.map((item) => (
          <ResourceStatusBadge key={item.tone} tone={item.tone} label={item[labelKey]} />
        ))}
      </div>
    </div>
  )
}

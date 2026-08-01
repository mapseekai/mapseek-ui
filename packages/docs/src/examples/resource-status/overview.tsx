import { ResourceStatusBadge, type ResourceStatusTone } from "@registry/blocks/resource-status"
import { Button } from "@registry/ui/button"
import { useState } from "react"

const tones: { readonly tone: ResourceStatusTone; readonly zh: string; readonly en: string }[] = [
  { tone: "ready", zh: "已就绪", en: "Ready" },
  { tone: "processing", zh: "处理中", en: "Processing" },
  { tone: "failed", zh: "失败", en: "Failed" },
  { tone: "neutral", zh: "未发布", en: "Unpublished" },
]

export const zhResourceStatusLabels = {
  next: "下一个状态",
  status: "当前状态",
  locale: "zh",
}

export const enResourceStatusLabels = {
  next: "Next status",
  status: "Current status",
  locale: "en",
}

export function ResourceStatusDemo({ labels }: { readonly labels: typeof zhResourceStatusLabels }) {
  const [index, setIndex] = useState(0)
  const active = tones[index]
  const labelKey = labels.locale === "zh" ? "zh" : "en"

  return (
    <div data-demo="resource-status" className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="resource-status-next"
          onClick={() => setIndex((current) => (current + 1) % tones.length)}
        >
          {labels.next}
        </Button>
        <span
          data-demo-status="resource-status"
          className="font-mono text-xs text-muted-foreground"
        >
          {labels.status}: {active.tone}
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

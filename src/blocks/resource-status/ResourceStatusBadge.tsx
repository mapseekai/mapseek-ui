import { IconCircleCheck, IconCircleDashed, IconCircleX, IconLoader2 } from "@tabler/icons-react"

import { cn } from "../../lib/utils"

export type ResourceStatusTone = "ready" | "processing" | "failed" | "neutral"

export interface ResourceStatusBadgeProps {
  tone: ResourceStatusTone
  label: string
  className?: string
}

const TONE_CLASS: Record<ResourceStatusTone, string> = {
  ready: "border-primary/30 bg-primary/10 text-primary",
  processing: "border-warning/35 bg-warning/10 text-warning",
  failed: "border-destructive/30 bg-destructive/10 text-destructive",
  neutral: "border-border bg-muted/45 text-muted-foreground",
}

export function ResourceStatusBadge({ tone, label, className }: ResourceStatusBadgeProps) {
  const Icon =
    tone === "ready"
      ? IconCircleCheck
      : tone === "processing"
        ? IconLoader2
        : tone === "failed"
          ? IconCircleX
          : IconCircleDashed

  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center gap-1 border px-1.5 font-mono text-[11px] leading-none font-medium whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      <Icon
        size={12}
        stroke={1.8}
        className={cn("shrink-0", tone === "processing" && "animate-spin")}
      />
      {label}
    </span>
  )
}

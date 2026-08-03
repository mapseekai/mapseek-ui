import {
  IconAlertTriangle,
  IconBell,
  IconCheck,
  IconDatabase,
  IconLoader2,
  IconMap2,
  IconRefresh,
  IconTrash,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { IconButton } from "@/components/ui/icon-button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import type {
  NotificationCenterItem,
  NotificationCenterProps,
  NotificationCenterStatusTone,
} from "./types"

const TONE_STYLE: Record<NotificationCenterStatusTone, { icon: string; pill: string }> = {
  processing: {
    icon: "text-warning",
    pill: "border-warning/30 bg-warning/10 text-warning",
  },
  success: {
    icon: "text-primary",
    pill: "border-primary/25 bg-primary/10 text-primary",
  },
  failed: {
    icon: "text-destructive",
    pill: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  idle: {
    icon: "text-muted-foreground",
    pill: "border-border bg-background text-muted-foreground",
  },
}

export function NotificationCenter({
  items,
  labels,
  isLoading,
  isError,
  streamActive,
  onRetry,
  onClearAll,
  onClearItem,
}: NotificationCenterProps) {
  const total = items.length
  const counts = getCounts(items)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<IconButton className="relative" aria-label={labels.trigger} />}>
        <IconBell size={15} stroke={1.75} />
        {total > 0 ? (
          <span className="mono pointer-events-none absolute top-0.5 right-0.5 h-3 min-w-3 border border-primary bg-background px-px text-center text-[8px] leading-[11px] font-bold text-primary">
            {total > 9 ? "9+" : total}
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-start justify-between gap-3 border-b border-border px-3 py-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">{labels.title}</span>
              <span
                className={cn(
                  "mono border px-1.5 py-0.5 text-[10px] leading-none",
                  streamActive
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                {streamActive ? labels.streamActive : labels.streamIdle}
              </span>
            </div>
            <div className="mono mt-1 text-[11px] text-muted-foreground">
              {labels.total}: {total}
            </div>
          </div>
          {total > 0 ? (
            <Button variant="ghost" size="xs" onClick={onClearAll} disabled={!onClearAll}>
              <IconTrash size={12} stroke={1.75} />
              {labels.clearAll}
            </Button>
          ) : null}
        </div>

        {total > 0 ? (
          <div className="grid grid-cols-3 border-b border-border">
            <SummaryCell label={labels.processing} value={counts.processing} />
            <SummaryCell label={labels.completed} value={counts.success} />
            <SummaryCell label={labels.failed} value={counts.failed} />
          </div>
        ) : null}

        {isLoading ? (
          <LoadingState label={labels.loadingTitle} />
        ) : isError ? (
          <ErrorState labels={labels} onRetry={onRetry} />
        ) : total === 0 ? (
          <EmptyState labels={labels} />
        ) : (
          <ul className="max-h-[420px] overflow-y-auto">
            {items.map((item) => (
              <NotificationRow
                key={item.key}
                item={item}
                labels={labels}
                onClearItem={onClearItem}
              />
            ))}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SummaryCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r border-border px-3 py-1.5 last:border-r-0">
      <div className="mono tnum text-xs font-semibold text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  )
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="space-y-3 p-3" role="status" aria-label={label}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="grid grid-cols-[3px_24px_minmax(0,1fr)] gap-2">
          <Skeleton className="h-12 w-[3px]" />
          <Skeleton className="size-6" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ labels }: Pick<NotificationCenterProps, "labels">) {
  return (
    <Empty className="border-0 p-5">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBell size={14} stroke={1.75} />
        </EmptyMedia>
        <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
        <EmptyDescription>{labels.emptyDescription}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function ErrorState({ labels, onRetry }: Pick<NotificationCenterProps, "labels" | "onRetry">) {
  return (
    <Empty className="border-0 p-5">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconAlertTriangle size={14} stroke={1.75} />
        </EmptyMedia>
        <EmptyTitle>
          <span className="mono">{labels.errorTitle}</span>
        </EmptyTitle>
        <EmptyDescription>{labels.errorDescription}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onRetry} disabled={!onRetry}>
          <IconRefresh size={13} stroke={1.75} />
          {labels.retry}
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function NotificationRow({
  item,
  labels,
  onClearItem,
}: {
  item: NotificationCenterItem
  labels: NotificationCenterProps["labels"]
  onClearItem?: NotificationCenterProps["onClearItem"]
}) {
  return (
    <li className="group grid grid-cols-[24px_minmax(0,1fr)_auto] gap-2 px-3 py-2 hover:bg-muted/40">
      <span className="mt-0.5 grid size-6 place-items-center border border-border bg-background text-muted-foreground">
        {item.sourceType === "TILESET" ? (
          <IconMap2 size={14} stroke={1.75} />
        ) : (
          <IconDatabase size={14} stroke={1.75} />
        )}
      </span>
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-xs font-medium text-foreground">{item.title}</span>
          <StatusPill item={item} />
        </div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">{item.description}</div>
        <div className="mono mt-0.5 flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
          <span className="shrink-0">{item.sourceLabel}</span>
          <span className="min-w-0 truncate">{item.sourceUid}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="xs"
        className="self-start opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
        onClick={() => onClearItem?.(item)}
        disabled={!onClearItem}
      >
        {labels.clearOne}
      </Button>
    </li>
  )
}

function StatusPill({ item }: { item: NotificationCenterItem }) {
  const tone = TONE_STYLE[item.statusTone]
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 border px-1.5 py-0.5 text-[11px] leading-none",
        tone.pill,
      )}
    >
      <StatusIcon tone={item.statusTone} className={tone.icon} />
      {item.statusLabel}
    </span>
  )
}

function StatusIcon({
  tone,
  className,
}: {
  tone: NotificationCenterStatusTone
  className: string
}) {
  if (tone === "failed") {
    return <IconX size={11} stroke={1.75} className={className} />
  }
  if (tone === "success") {
    return <IconCheck size={11} stroke={1.75} className={className} />
  }
  if (tone === "processing") {
    return <IconLoader2 size={11} stroke={1.75} className={cn("animate-spin", className)} />
  }
  return <IconBell size={11} stroke={1.75} className={className} />
}

function getCounts(items: NotificationCenterItem[]) {
  return items.reduce(
    (acc, item) => {
      if (item.statusTone === "processing") acc.processing += 1
      if (item.statusTone === "success") acc.success += 1
      if (item.statusTone === "failed") acc.failed += 1
      return acc
    },
    { processing: 0, success: 0, failed: 0 },
  )
}

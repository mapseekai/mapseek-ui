import { IconCheck, IconRefresh, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { cn } from "@/lib/utils"
import type { ProcessingTimelineProps, TimelineEvent, TimelineStep } from "./types"

const MARKER_STATE: Record<NonNullable<TimelineStep["state"]>, string> = {
  done: "bg-primary text-primary-foreground",
  active: "animate-pulse bg-warning text-warning-foreground",
  failed: "bg-destructive text-destructive-foreground",
  pending: "bg-border text-muted-foreground",
}

/**
 * Ordered processing timeline (filled circular marker + connector per step).
 * Pure view: text/icons via props, copy side-effect via onCopyLog. Renders
 * only the <ol> — caller wraps.
 */
export function ProcessingTimeline({ steps, labels, onCopyLog }: ProcessingTimelineProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => {
        const state = step.state ?? "done"
        const eventRows = getEventRows(step.events)
        return (
          <li key={step.key} className="flex gap-3">
            <div className="relative flex w-5 flex-col items-center">
              <span
                className={cn(
                  "z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  MARKER_STATE[state],
                )}
              >
                {state === "failed" ? (
                  <IconX size={12} stroke={2} />
                ) : state === "done" ? (
                  <IconCheck size={12} stroke={2} />
                ) : null}
              </span>
              {i < steps.length - 1 && (
                <span className="absolute top-5 bottom-[-18px] w-px bg-border" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{step.label}</span>
                {step.status && (
                  <span className="inline-flex items-center gap-1 whitespace-nowrap border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary">
                    <IconCheck size={11} stroke={2} />
                    {step.status}
                  </span>
                )}
                {step.retry && (
                  <span className="inline-flex items-center gap-1 whitespace-nowrap border border-warning/25 bg-warning/10 px-1.5 py-0.5 text-[11px] text-warning">
                    <IconRefresh size={11} stroke={2} />
                    {step.retry}
                  </span>
                )}
                {(step.time || step.duration) && (
                  <span className="mono flex w-full items-center gap-3 text-xs text-muted-foreground sm:ml-auto sm:w-auto">
                    {step.time && <span>{step.time}</span>}
                    {step.duration && <span>{step.duration}</span>}
                  </span>
                )}
              </div>
              {step.events.length > 0 && (
                <div className="mt-2 space-y-2">
                  {eventRows.map((row) => (
                    <EventCard
                      key={row.key}
                      event={row.event}
                      labels={labels}
                      onCopyLog={onCopyLog}
                    />
                  ))}
                </div>
              )}
              {(step.message ||
                (step.progressKind === "percent" && typeof step.percent === "number")) && (
                <ProgressDetail step={step} />
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function getEventRows(events: TimelineEvent[]) {
  const counts = new Map<string, number>()
  return events.map((event) => {
    const signature = [event.time, event.tone, event.log, event.title, event.text]
      .filter((part): part is string => typeof part === "string")
      .join("|")
    const occurrence = counts.get(signature) ?? 0
    counts.set(signature, occurrence + 1)
    return { event, key: `${signature}:${occurrence}` }
  })
}

function ProgressDetail({ step }: { step: TimelineStep }) {
  const percent = typeof step.percent === "number" ? Math.max(0, Math.min(100, step.percent)) : null

  return (
    <div className="mt-2 space-y-1.5">
      {step.message && <div className="text-xs text-muted-foreground">{step.message}</div>}
      {step.progressKind === "percent" && percent != null && (
        <div className="flex items-center gap-2">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-1.5 min-w-0 flex-1 overflow-hidden bg-muted"
          >
            <div
              className="h-full bg-primary transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="mono w-16 shrink-0 text-right text-xs text-muted-foreground">
            {percent.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  )
}

function EventCard({
  event,
  labels,
  onCopyLog,
}: {
  event: TimelineEvent
  labels: ProcessingTimelineProps["labels"]
  onCopyLog: ProcessingTimelineProps["onCopyLog"]
}) {
  const log = event.log

  if (event.tone === "error") {
    return (
      <div className="flex flex-col gap-3 border border-destructive/30 bg-destructive/5 p-3 sm:flex-row">
        {event.icon && <span className="mt-0.5 shrink-0 text-destructive">{event.icon}</span>}
        <div className="min-w-0 flex-1">
          {event.title && <div className="text-xs font-medium text-destructive">{event.title}</div>}
          {event.errorText && (
            <div className="mono mt-1 text-[11px] text-destructive">{event.errorText}</div>
          )}
          {event.hint && <div className="mt-1 text-[11px] text-muted-foreground">{event.hint}</div>}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-1 sm:flex-col sm:items-end">
          {event.time && (
            <span className="mono text-[11px] text-muted-foreground">{event.time}</span>
          )}
          {log != null && (
            <div className="flex gap-1">
              <Button variant="ghost" size="xs">
                {labels.log}
              </Button>
              <CopyButton
                content={log}
                variant="ghost"
                label={labels.copy}
                onCopy={() => onCopyLog?.(log)}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 border border-border p-3">
      {event.icon && <span className="mt-0.5 shrink-0 text-muted-foreground">{event.icon}</span>}
      <div className="min-w-0 flex-1">
        {event.title && <div className="text-xs">{event.title}</div>}
        {event.text && <div className="mt-0.5 text-xs text-muted-foreground">{event.text}</div>}
      </div>
      {event.time && (
        <span className="mono shrink-0 text-[11px] text-muted-foreground">{event.time}</span>
      )}
    </div>
  )
}

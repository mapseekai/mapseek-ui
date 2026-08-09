import {
  IconCheck,
  IconClock,
  IconListDetails,
  IconLoader2,
  IconRefresh,
  IconX,
} from "@tabler/icons-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/utils"
import type { ProcessingTimelineProps, TimelineEvent, TimelineStep } from "./types"

const MARKER_STATE: Record<NonNullable<TimelineStep["state"]>, string> = {
  done: "bg-primary text-primary-foreground",
  active:
    "animate-pulse border border-primary/30 bg-primary/10 text-primary motion-reduce:animate-none",
  failed: "bg-destructive text-destructive-foreground",
  pending: "bg-border text-muted-foreground",
}

const MARKER_ICON: Record<NonNullable<TimelineStep["state"]>, typeof IconCheck> = {
  done: IconCheck,
  active: IconLoader2,
  failed: IconX,
  pending: IconClock,
}

/**
 * Ordered processing timeline (filled circular marker + connector per step).
 * Pure view: text/icons via props, and a parent-owned log action. Renders only
 * the timeline or its empty state — caller owns the surrounding surface.
 */
export function ProcessingTimeline({ steps, labels, onLogClick }: ProcessingTimelineProps) {
  if (steps.length === 0) {
    return (
      <Empty className="border border-border p-4">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconListDetails aria-hidden="true" size={16} stroke={1.5} />
          </EmptyMedia>
          <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
          <EmptyDescription>{labels.emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ol className="flex w-full min-w-0 flex-col gap-4">
      {steps.map((step, i) => {
        const state = step.state ?? "done"
        const MarkerIcon = MARKER_ICON[state]
        const eventRows = getEventRows(step.events)
        return (
          <li key={step.key} className="flex min-w-0 gap-3">
            <div className="relative flex w-5 flex-col items-center">
              <span
                role="img"
                aria-label={`${step.label}: ${state}`}
                className={cn(
                  "z-10 flex size-5 shrink-0 items-center justify-center rounded-full",
                  MARKER_STATE[state],
                )}
              >
                <MarkerIcon
                  aria-hidden="true"
                  className={
                    state === "active" ? "animate-spin motion-reduce:animate-none" : undefined
                  }
                  size={12}
                  stroke={2}
                />
              </span>
              {i < steps.length - 1 && (
                <span className="absolute top-5 bottom-[-18px] w-px bg-border" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="min-w-0 truncate text-headline-sm" title={step.label}>
                  {step.label}
                </span>
                {step.status && (
                  <Tag
                    className="min-w-0 max-w-full shrink truncate"
                    color="green"
                    size="sm"
                    title={step.status}
                  >
                    <IconCheck aria-hidden="true" data-icon="inline-start" stroke={2} />
                    {step.status}
                  </Tag>
                )}
                {step.retry && (
                  <Tag
                    className="min-w-0 max-w-full shrink truncate"
                    color="yellow"
                    size="sm"
                    title={step.retry}
                  >
                    <IconRefresh aria-hidden="true" data-icon="inline-start" stroke={2} />
                    {step.retry}
                  </Tag>
                )}
                {(step.time || step.duration) && (
                  <span className="mono flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5 text-body-md text-muted-foreground sm:ml-auto sm:w-auto sm:justify-end">
                    {step.time && (
                      <span className="truncate" title={step.time}>
                        {step.time}
                      </span>
                    )}
                    {step.duration && (
                      <span className="truncate" title={step.duration}>
                        {step.duration}
                      </span>
                    )}
                  </span>
                )}
              </div>
              {step.events.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  {eventRows.map((row) => (
                    <EventCard
                      key={row.key}
                      event={row.event}
                      labels={labels}
                      onLogClick={onLogClick}
                    />
                  ))}
                </div>
              )}
              {(step.message ||
                (step.progressKind === "percent" && typeof step.percent === "number") ||
                step.progressKind === "indeterminate") && <ProgressDetail step={step} />}
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
  const progressMessage = typeof step.message === "string" ? step.message : undefined

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {step.message && (
        <div className="min-w-0 break-words text-body-md text-muted-foreground [overflow-wrap:anywhere]">
          {step.message}
        </div>
      )}
      {step.progressKind === "percent" && percent != null && (
        <div className="flex items-center gap-2">
          <div
            role="progressbar"
            aria-label={step.label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-1.5 min-w-0 flex-1 overflow-hidden bg-muted"
          >
            <div
              className="h-full bg-primary transition-[width] motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="mono w-16 shrink-0 text-right text-body-md text-muted-foreground">
            {percent.toFixed(2)}%
          </span>
        </div>
      )}
      {step.progressKind === "indeterminate" && (
        <div
          role="progressbar"
          aria-label={step.label}
          aria-valuetext={progressMessage}
          className="h-1.5 min-w-0 overflow-hidden bg-muted"
        >
          <div className="h-full w-1/3 bg-primary animate-pulse motion-reduce:animate-none" />
        </div>
      )}
    </div>
  )
}

function EventCard({
  event,
  labels,
  onLogClick,
}: {
  event: TimelineEvent
  labels: ProcessingTimelineProps["labels"]
  onLogClick: ProcessingTimelineProps["onLogClick"]
}) {
  const log = event.log

  if (event.tone === "error") {
    return (
      <div className="flex min-w-0 flex-col gap-3 border border-destructive/30 bg-destructive/5 p-3 sm:flex-row">
        {event.icon && <span className="mt-0.5 shrink-0 text-destructive">{event.icon}</span>}
        <div className="min-w-0 flex-1">
          {event.title && (
            <EventText className="text-body-md-medium text-destructive">{event.title}</EventText>
          )}
          {event.errorText && (
            <EventText className="mono mt-1 text-body-sm text-destructive">
              {event.errorText}
            </EventText>
          )}
          {event.hint && (
            <EventText className="mt-1 text-body-sm text-muted-foreground">{event.hint}</EventText>
          )}
        </div>
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:shrink-0 sm:flex-col sm:items-end">
          {event.time && (
            <span
              className="mono min-w-0 break-words text-body-sm text-muted-foreground [overflow-wrap:anywhere]"
              title={event.time}
            >
              {event.time}
            </span>
          )}
          {log != null && onLogClick && (
            <Button type="button" variant="ghost" size="xs" onClick={() => onLogClick(log)}>
              {labels.log}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-2 border border-border p-3 sm:flex-row sm:gap-3">
      {event.icon && <span className="mt-0.5 shrink-0 text-muted-foreground">{event.icon}</span>}
      <div className="min-w-0 flex-1">
        {event.title && <EventText className="text-body-md">{event.title}</EventText>}
        {event.text && (
          <EventText className="mt-0.5 text-body-md text-muted-foreground">{event.text}</EventText>
        )}
      </div>
      {event.time && (
        <span
          className="mono min-w-0 break-words text-body-sm text-muted-foreground sm:shrink-0 [overflow-wrap:anywhere]"
          title={event.time}
        >
          {event.time}
        </span>
      )}
    </div>
  )
}

function EventText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("min-w-0 break-words [overflow-wrap:anywhere]", className)}
      title={typeof children === "string" ? children : undefined}
    >
      {children}
    </div>
  )
}

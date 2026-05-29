import { IconCopy } from "@tabler/icons-react"
import { Button } from "../../components/button"
import { cn } from "../../lib/utils"
import type {
  ProcessingTimelineProps,
  TimelineEvent,
  TimelineStep,
} from "./types"

const DOT_STATE: Record<NonNullable<TimelineStep["state"]>, string> = {
  done: "bg-primary",
  active: "animate-pulse bg-warning",
  failed: "bg-destructive",
  pending: "bg-border",
}

/**
 * Ordered processing timeline (dot + connector per step). Pure view: text via
 * props, copy side-effect via onCopyLog. Renders only the <ol> — caller wraps.
 */
export function ProcessingTimeline({
  steps,
  labels,
  onCopyLog,
}: ProcessingTimelineProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={step.key} className="flex gap-3">
          <div className="relative flex w-4 justify-center">
            <span
              className={cn(
                "mt-1 inline-block h-2 w-2 shrink-0 rounded-full",
                DOT_STATE[step.state ?? "done"],
              )}
            />
            {i < steps.length - 1 && (
              <span className="absolute top-3 bottom-[-18px] w-px bg-border" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-medium">
              {step.label}
              {step.status && (
                <span className="text-muted-foreground">{step.status}</span>
              )}
              {step.retry && <span className="text-warning">{step.retry}</span>}
              {step.duration && (
                <span className="mono ml-auto text-muted-foreground">
                  {step.duration}
                </span>
              )}
            </div>
            <ul className="mt-1.5 space-y-1">
              {step.events.map((ev, j) => (
                <EventRow
                  key={j}
                  event={ev}
                  labels={labels}
                  onCopyLog={onCopyLog}
                />
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}

function EventRow({
  event,
  labels,
  onCopyLog,
}: {
  event: TimelineEvent
  labels: ProcessingTimelineProps["labels"]
  onCopyLog: ProcessingTimelineProps["onCopyLog"]
}) {
  if (event.variant === "error") {
    return (
      <li className="flex gap-2 text-xs">
        {event.time && (
          <span className="mono shrink-0 text-muted-foreground">
            {event.time}
          </span>
        )}
        <div className="flex-1 border border-destructive/25 bg-destructive/8 px-3 py-2 text-xs text-destructive">
          <span className={event.mono ? "mono" : ""}>{event.text}</span>
          {event.log != null && (
            <div className="mt-2 flex gap-2">
              <Button variant="ghost" size="sm">
                {labels.log}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopyLog?.(event.log!)}
              >
                <IconCopy />
                {labels.copy}
              </Button>
            </div>
          )}
        </div>
      </li>
    )
  }

  return (
    <li className="flex gap-2 text-xs text-muted-foreground">
      {event.time && <span className="mono shrink-0">{event.time}</span>}
      <span className={event.mono ? "mono text-destructive" : ""}>
        {event.text}
      </span>
    </li>
  )
}

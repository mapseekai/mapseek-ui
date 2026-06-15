import type { ReactNode } from "react"
import { cn } from "../../lib/utils"
import { JsonViewer } from "../../components/json-viewer"

export interface GeoJSONViewProps {
  /** Pre-formatted JSON (see `stringifyGeoJSON`); null/empty shows `emptyLabel`. */
  json: string | null
  emptyLabel: string
  title?: string
  expandAllLabel?: string
  collapseAllLabel?: string
  copyFeedbackDurationMs?: number
  className?: string
}

/**
 * Read-only JSON viewer. Parses the pre-formatted `json` and renders it as an
 * interactive collapsible tree (`JsonViewer`). Falls back to a line-numbered
 * `<pre>` when `json` is empty, fails to parse, or decodes to a primitive.
 * Pure display — copy/download and size counters live in the consumer's chrome,
 * built from the same `stringifyGeoJSON` output to avoid stringifying twice.
 */
export function GeoJSONView({
  json,
  emptyLabel,
  title = "GeoJSON",
  expandAllLabel = "全部展开",
  collapseAllLabel = "全部收起",
  copyFeedbackDurationMs = 3000,
  className,
}: GeoJSONViewProps) {
  if (!json) {
    return (
      <ViewShell title={title} className={className}>
        <PreView lines={null} emptyLabel={emptyLabel} />
      </ViewShell>
    )
  }

  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    return (
      <ViewShell title={title} className={className}>
        <PreView lines={json.split("\n")} emptyLabel={emptyLabel} />
      </ViewShell>
    )
  }

  if (typeof data !== "object" || data === null) {
    return (
      <ViewShell title={title} className={className}>
        <PreView lines={json.split("\n")} emptyLabel={emptyLabel} />
      </ViewShell>
    )
  }

  return (
    <div
      className={cn(
        "flex h-[360px] max-h-full min-h-0 flex-col border border-border bg-card",
        className,
      )}
    >
      <JsonViewer
        data={data as Record<string, unknown>}
        title={title}
        expandAllLabel={expandAllLabel}
        collapseAllLabel={collapseAllLabel}
        copyFeedbackDurationMs={copyFeedbackDurationMs}
        showLineNumbers
        className="min-h-0 flex-1 overflow-hidden"
      />
    </div>
  )
}

function ViewShell({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex h-[360px] max-h-full min-h-0 flex-col border border-border bg-card",
        className,
      )}
    >
      <div className="flex h-8 shrink-0 items-center border-b border-border px-3">
        <span className="font-mono text-[11px] leading-none font-semibold tracking-[0.06em] text-muted-foreground uppercase">
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

/** Line-numbered read-only fallback (empty / invalid-JSON / primitive). */
function PreView({
  lines,
  emptyLabel,
  className,
}: {
  lines: string[] | null
  emptyLabel: string
  className?: string
}) {
  return (
    <pre
      className={cn(
        "m-0 min-h-0 flex-1 overflow-auto bg-muted/50 px-3.5 py-3 font-mono text-[11px] leading-[1.6] font-medium text-foreground [tab-size:2]",
        className,
      )}
    >
      {lines === null ? (
        <div className="grid grid-cols-[32px_1fr] gap-x-3">
          <span className="text-right text-muted-foreground tabular-nums select-none">1</span>
          <span className="text-muted-foreground">{emptyLabel}</span>
        </div>
      ) : (
        lines.map((line, i) => (
          <div key={i} className="grid grid-cols-[32px_1fr] gap-x-3">
            <span className="text-right text-muted-foreground tabular-nums select-none">
              {i + 1}
            </span>
            <span>{line}</span>
          </div>
        ))
      )}
    </pre>
  )
}

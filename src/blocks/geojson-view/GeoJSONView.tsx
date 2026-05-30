import { cn } from "../../lib/utils"
import { JsonViewer } from "../../components/json-viewer"

export interface GeoJSONViewProps {
  /** Pre-formatted JSON (see `stringifyGeoJSON`); null/empty shows `emptyLabel`. */
  json: string | null
  emptyLabel: string
  className?: string
}

/**
 * Read-only JSON viewer. Parses the pre-formatted `json` and renders it as an
 * interactive collapsible tree (`JsonViewer`). Falls back to a line-numbered
 * `<pre>` when `json` is empty, fails to parse, or decodes to a primitive.
 * Pure display — copy/download and size counters live in the consumer's chrome,
 * built from the same `stringifyGeoJSON` output to avoid stringifying twice.
 */
export function GeoJSONView({ json, emptyLabel, className }: GeoJSONViewProps) {
  if (!json) {
    return <PreView lines={null} emptyLabel={emptyLabel} className={className} />
  }

  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    return (
      <PreView
        lines={json.split("\n")}
        emptyLabel={emptyLabel}
        className={className}
      />
    )
  }

  if (typeof data !== "object" || data === null) {
    return (
      <PreView
        lines={json.split("\n")}
        emptyLabel={emptyLabel}
        className={className}
      />
    )
  }

  return (
    <JsonViewer
      data={data as Record<string, unknown>}
      showLineNumbers
      className={cn("overflow-auto", className)}
    />
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
        "m-0 flex-1 overflow-auto bg-muted px-3.5 py-3 font-mono text-[11px] font-medium leading-[1.6] text-foreground [tab-size:2]",
        className,
      )}
    >
      {lines === null ? (
        <div className="grid grid-cols-[32px_1fr] gap-x-3">
          <span className="text-right tabular-nums text-muted-foreground select-none">
            1
          </span>
          <span className="text-muted-foreground">{emptyLabel}</span>
        </div>
      ) : (
        lines.map((line, i) => (
          <div key={i} className="grid grid-cols-[32px_1fr] gap-x-3">
            <span className="text-right tabular-nums text-muted-foreground select-none">
              {i + 1}
            </span>
            <span>{line}</span>
          </div>
        ))
      )}
    </pre>
  )
}

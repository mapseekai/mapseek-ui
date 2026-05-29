import { cn } from "../../lib/utils"

export interface GeoJSONViewProps {
  /** Pre-formatted JSON (see `stringifyGeoJSON`); null/empty shows `emptyLabel`. */
  json: string | null
  emptyLabel: string
  className?: string
}

/**
 * Read-only, line-numbered JSON viewer. Pure display — copy/download and
 * size counters live in the consumer's chrome, built from the same
 * `stringifyGeoJSON` output to avoid stringifying twice.
 */
export function GeoJSONView({ json, emptyLabel, className }: GeoJSONViewProps) {
  const lines = json ? json.split("\n") : null
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

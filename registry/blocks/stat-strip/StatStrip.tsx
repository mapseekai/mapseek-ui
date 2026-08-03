import { cn } from "@/lib/utils"
import type { StatItem, StatStripProps } from "./types"

/**
 * Horizontal statistics strip (Layer 2 presentational block).
 * All text, badges, icons, and units are passed through props; no i18n or side effects.
 * Generalized from the dataset DatasetStatStrip.
 */
export function StatStrip({ items }: StatStripProps) {
  const rows = getStatRows(items)

  return (
    <div className="grid grid-cols-2 items-stretch border border-border bg-background sm:flex">
      {rows.map((row) => (
        <Stat key={row.key} {...row.item} isLast={row.isLast} />
      ))}
    </div>
  )
}

function getStatRows(items: StatItem[]) {
  const counts = new Map<string, number>()
  return items.map((item, i) => {
    const signature = [item.label, item.value, item.unit].filter(Boolean).join("|")
    const occurrence = counts.get(signature) ?? 0
    counts.set(signature, occurrence + 1)
    return { item, isLast: i === items.length - 1, key: `${signature}:${occurrence}` }
  })
}

function Stat({
  label,
  value,
  mono = false,
  unit,
  icon,
  badge,
  isLast,
}: StatItem & { isLast: boolean }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-1 bg-background px-3 py-3 sm:px-4",
        !isLast && "border-r border-border",
      )}
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {label}
        {badge}
      </span>
      <span className="flex items-center gap-1.5">
        {icon}
        <span className={cn("truncate text-lg font-medium leading-none", mono && "mono tnum")}>
          {value}
        </span>
        {unit && <span className="mono text-xs text-muted-foreground">{unit}</span>}
      </span>
    </div>
  )
}

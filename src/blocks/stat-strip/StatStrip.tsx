import { cn } from "../../lib/utils"
import type { StatItem, StatStripProps } from "./types"

/**
 * 横向统计条（Layer 2 presentational block）。
 * 所有文案 / badge / icon / unit 由 props 注入；无 i18n、无副作用。
 * 由 dataset 的 DatasetStatStrip 泛化而来。
 */
export function StatStrip({ items }: StatStripProps) {
  return (
    <div className="flex items-stretch border border-border bg-background">
      {items.map((item, i) => (
        <Stat key={i} {...item} isLast={i === items.length - 1} />
      ))}
    </div>
  )
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
        "flex flex-1 flex-col gap-1 bg-background px-4 py-3",
        !isLast && "border-r border-border",
      )}
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {label}
        {badge}
      </span>
      <span className="flex items-center gap-1.5">
        {icon}
        <span className={cn("text-lg font-medium leading-none", mono && "mono tnum")}>{value}</span>
        {unit && <span className="mono text-xs text-muted-foreground">{unit}</span>}
      </span>
    </div>
  )
}

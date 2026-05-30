import { cn } from "../../lib/utils"
import type { StatItem, StatStripProps } from "./types"

/**
 * 横向统计条（Layer 2 presentational block）。
 * 所有文案 / badge / icon / unit 由 props 注入；无 i18n、无副作用。
 * 由 dataset 的 DatasetStatStrip 泛化而来。
 */
export function StatStrip({ items }: StatStripProps) {
  return (
    <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
      {items.map((item, i) => (
        <Stat key={i} {...item} />
      ))}
    </div>
  )
}

function Stat({ label, value, mono = false, unit, icon, badge }: StatItem) {
  return (
    <div className="flex flex-col gap-1 bg-background px-4 py-3">
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

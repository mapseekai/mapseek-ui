import type { BandStatLabels, BandStatProps } from "./types"

/**
 * 单波段统计块（Layer 2 presentational block）。
 * header（波段码 chip + 名称 + 数据类型 chip）+ 4 指标（min/max/mean/stddev）
 * + 64-bin 直方图（纯 CSS 柱，无图表库）。
 * 所有文案由 props 注入；无 i18n、无副作用。
 */
export function BandStat({ data, labels }: BandStatProps) {
  const maxBin = Math.max(0, ...data.histogram)
  const ticks = [
    data.min,
    data.min + (data.max - data.min) / 4,
    data.min + ((data.max - data.min) * 2) / 4,
    data.min + ((data.max - data.min) * 3) / 4,
    data.max,
  ]

  return (
    <div className="border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-dashed border-border px-4 py-3">
        <span className="inline-flex size-7 items-center justify-center bg-primary/10 mono text-xs font-medium text-primary">
          {data.band}
        </span>
        <span className="flex-1 text-sm font-medium text-foreground">{data.name}</span>
        <span className="border border-warning/25 bg-warning/10 px-1.5 py-0.5 mono text-[11px] uppercase text-warning">
          {data.type}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 divide-x divide-border border border-border">
        <Metric label={labels.min} value={data.min} />
        <Metric label={labels.max} value={data.max} />
        <Metric label={labels.mean} value={data.mean} />
        <Metric label={labels.stddev} value={data.stddev} />
      </div>

      {/* Histogram */}
      <div className="px-4 py-3">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-muted-foreground">{labels.histogram}</span>
            <span className="mono text-[11px] text-muted-foreground">{labels.histogramMeta}</span>
          </div>
          <span className="mono tnum text-[11px] text-muted-foreground">
            {data.min.toLocaleString()} – {data.max.toLocaleString()}
          </span>
        </div>
        <div className="mt-2 flex h-48 items-end gap-px border border-border bg-card p-2">
          {data.histogram.map((bin, i) => (
            <span
              key={i}
              data-bar
              style={{ height: `${maxBin === 0 ? 0 : (bin / maxBin) * 100}%` }}
              className="flex-1 bg-gradient-to-t from-primary to-primary/70"
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between mono text-[11px] text-muted-foreground">
          {ticks.map((v, i) => (
            <span key={i}>{compactNumber(v)}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function compactNumber(v: number): string {
  return v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`
}

function Metric({ label, value }: { label: BandStatLabels[keyof BandStatLabels]; value: number }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="mono tnum text-2xl font-medium text-foreground">{value.toLocaleString()}</span>
    </div>
  )
}

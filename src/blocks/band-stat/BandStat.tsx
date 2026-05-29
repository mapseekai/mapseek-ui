import type { BandStatLabels, BandStatProps } from "./types"

/**
 * 单波段统计块（Layer 2 presentational block）。
 * header（波段码 chip + 名称 + 数据类型 chip）+ 4 指标（min/max/mean/stddev）
 * + 64-bin 直方图（纯 CSS 柱，无图表库）。
 * 所有文案由 props 注入；无 i18n、无副作用。
 */
export function BandStat({ data, labels }: BandStatProps) {
  const maxBin = Math.max(0, ...data.histogram)

  return (
    <div className="border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center bg-primary/15 mono tnum text-sm font-medium text-primary">
          {data.band}
        </span>
        <span className="flex-1 text-sm text-foreground">{data.name}</span>
        <span className="bg-warning/15 px-2 py-0.5 mono text-[11px] uppercase text-warning">
          {data.type}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-px border-b border-border bg-border">
        <Metric label={labels.min} value={data.min} />
        <Metric label={labels.max} value={data.max} />
        <Metric label={labels.mean} value={data.mean} />
        <Metric label={labels.stddev} value={data.stddev} />
      </div>

      {/* Histogram */}
      <div className="px-4 py-3">
        <div className="mb-2 flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-muted-foreground">{labels.histogram}</span>
            <span className="mono text-[11px] text-muted-foreground">{labels.histogramMeta}</span>
          </div>
          <span className="mono tnum text-[11px] text-muted-foreground">
            {data.min.toLocaleString()} – {data.max.toLocaleString()}
          </span>
        </div>
        <div className="flex h-20 items-end gap-px bg-muted/20 p-1">
          {data.histogram.map((bin, i) => (
            <span
              key={i}
              data-bar
              style={{ height: `${maxBin === 0 ? 0 : (bin / maxBin) * 100}%` }}
              className="flex-1 bg-primary"
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between mono tnum text-[11px] text-muted-foreground">
          <span>0</span>
          <span>{(data.histogram.length - 1).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: BandStatLabels[keyof BandStatLabels]; value: number }) {
  return (
    <div className="flex flex-col gap-0.5 bg-card px-3 py-2.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="mono tnum text-sm text-foreground">{value.toLocaleString()}</span>
    </div>
  )
}

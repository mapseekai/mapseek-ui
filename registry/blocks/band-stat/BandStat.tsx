import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { BandStatLabels, BandStatProps } from "./types"

/**
 * Single-band statistics block (Layer 2 presentational block).
 * Header (band chip + name + data-type chip), four metrics, and a 64-bin histogram.
 * All copy is injected through props; no i18n or side effects.
 */
export function BandStat({ data, labels }: BandStatProps) {
  const maxBin = Math.max(0, ...data.histogram)
  const chartConfig = {
    count: {
      label: labels.histogramCount,
      color: "var(--primary)",
    },
  } satisfies ChartConfig
  const histogramData = data.histogram.map((count, index) => ({
    bin: index,
    count,
    range: binRangeLabel(index, data.histogram.length, data.min, data.max),
  }))
  const xTickIndexes = [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
    Math.round((data.histogram.length - 1) * ratio),
  )
  const yTicks =
    maxBin === 0
      ? [0]
      : [maxBin, maxBin * 0.75, maxBin * 0.5, maxBin * 0.25, 0].map((value) => Math.round(value))
  const valueAtTick = (index: number) =>
    data.min + ((data.max - data.min) * index) / Math.max(data.histogram.length - 1, 1)

  const formatTooltipLabel = (_value: unknown, payload: unknown) => {
    const first = Array.isArray(payload) ? payload[0] : undefined
    if (
      first &&
      typeof first === "object" &&
      "payload" in first &&
      first.payload &&
      typeof first.payload === "object" &&
      "range" in first.payload
    ) {
      return String(first.payload.range)
    }

    return labels.histogram
  }

  const formatTooltipValue = (value: unknown) => (
    <>
      <span className="text-muted-foreground">{labels.histogramCount}</span>
      <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : String(value)}
      </span>
    </>
  )

  return (
    <div className="border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-dashed border-border px-4 py-3">
        <span className="mono inline-flex size-7 items-center justify-center bg-primary/10 text-xs font-medium text-primary">
          {data.band}
        </span>
        <span className="flex-1 text-sm font-medium text-foreground">{data.name}</span>
        <span className="mono border border-warning/25 bg-warning/10 px-1.5 py-0.5 text-[11px] text-warning uppercase">
          {data.type}
        </span>
      </div>

      {/* Metrics */}
      <div className="mx-4 mt-3 grid grid-cols-4 divide-x divide-border border border-border">
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
        <div className="mt-2 grid grid-cols-[20px_minmax(0,1fr)] gap-2">
          <div className="flex items-center justify-center">
            <span className="mono -rotate-90 text-[10px] tracking-[0.04em] whitespace-nowrap text-muted-foreground uppercase">
              {labels.histogramYAxis}
            </span>
          </div>
          <ChartContainer
            config={chartConfig}
            className="h-52 w-full border border-border bg-card p-2"
            initialDimension={{ width: 640, height: 208 }}
          >
            <BarChart
              accessibilityLayer
              data={histogramData}
              margin={{ top: 8, right: 8, bottom: 2, left: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="bin"
                ticks={xTickIndexes}
                tickFormatter={(value) => compactNumber(valueAtTick(Number(value)))}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={12}
              />
              <YAxis
                dataKey="count"
                domain={[0, maxBin || 1]}
                ticks={yTicks}
                tickFormatter={(value) => compactNumber(Number(value))}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={44}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", fillOpacity: 0.55 }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={formatTooltipLabel}
                    formatter={formatTooltipValue}
                  />
                }
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={0} />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="mono mt-1 ml-7 text-center text-[10px] tracking-[0.04em] text-muted-foreground uppercase">
          {labels.histogramXAxis}
        </div>
      </div>
    </div>
  )
}

function compactNumber(v: number): string {
  const rounded = Math.round(v)
  return rounded >= 1000 ? `${Math.round(rounded / 1000)}k` : `${rounded}`
}

function binRangeLabel(index: number, count: number, min: number, max: number): string {
  const safeCount = Math.max(count, 1)
  const start = min + ((max - min) * index) / safeCount
  const end = min + ((max - min) * (index + 1)) / safeCount

  return `${compactNumber(start)} - ${compactNumber(end)}`
}

function Metric({ label, value }: { label: BandStatLabels[keyof BandStatLabels]; value: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 px-2 py-3 sm:px-4">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="mono tnum whitespace-nowrap text-lg font-medium text-foreground sm:text-2xl">
        {value.toLocaleString()}
      </span>
    </div>
  )
}

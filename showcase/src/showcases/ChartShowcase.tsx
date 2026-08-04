import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@registry/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import type { LocalizedDemoProps } from "./types"

const data = [
  { month: "Jan", features: 186 },
  { month: "Feb", features: 305 },
  { month: "Mar", features: 237 },
  { month: "Apr", features: 273 },
]

const config = { features: { label: "Features", color: "var(--chart-1)" } } satisfies ChartConfig

export function ChartOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  return (
    <section className="max-w-2xl space-y-3">
      <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
        Monthly feature count
      </h4>
      <ChartContainer config={config} className="h-64 w-full border border-border p-3">
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="features" fill="var(--color-features)" />
        </BarChart>
      </ChartContainer>
    </section>
  )
}

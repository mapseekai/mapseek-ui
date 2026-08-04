import { Skeleton } from "@registry/ui/skeleton"
import type { LocalizedDemoProps } from "./types"

export function SkeletonOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  void locale
  return (
    <div className="grid w-full max-w-sm gap-8">
      <section className="space-y-3" data-demo="skeleton-lines">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Text rows
        </h4>
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </section>

      <section className="space-y-3" data-demo="skeleton-card">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Card skeleton
        </h4>
        <div className="space-y-2 border border-border p-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="mt-2 h-16 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </section>
    </div>
  )
}

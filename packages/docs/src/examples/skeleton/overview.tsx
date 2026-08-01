import { Skeleton } from "@registry/ui/skeleton"

export function SkeletonOverviewDemo() {
  return (
    <div className="grid max-w-3xl gap-8 md:grid-cols-2" data-demo="skeleton-overview">
      <section className="space-y-3" data-demo="skeleton-lines">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Text rows
        </h4>
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </section>

      <section className="space-y-3" data-demo="skeleton-card">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
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

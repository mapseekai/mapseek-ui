import { Separator } from "@registry/ui/separator"

export function SeparatorOverviewDemo() {
  return (
    <div className="space-y-8" data-demo="separator-overview">
      <section className="space-y-3" data-demo="separator-horizontal">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Horizontal
        </h4>
        <div className="space-y-2">
          <p className="text-sm">Above</p>
          <Separator />
          <p className="text-sm">Below</p>
        </div>
      </section>

      <section className="space-y-3" data-demo="separator-vertical">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Vertical
        </h4>
        <div className="flex h-8 items-center gap-3">
          <span className="text-sm">Left</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Right</span>
        </div>
      </section>
    </div>
  )
}

import { Separator } from "@registry/ui/separator"
import type { LocalizedDemoProps } from "./types"

export function SeparatorOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  void locale
  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <section className="space-y-3" data-demo="separator-horizontal">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Horizontal
        </h4>
        <div className="grid gap-3">
          <p className="m-0 text-sm">Above</p>
          <Separator />
          <p className="m-0 text-sm">Below</p>
        </div>
      </section>

      <section className="space-y-3" data-demo="separator-vertical">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Vertical
        </h4>
        <div className="flex h-12 items-center justify-center gap-3">
          <span className="text-sm">Left</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Right</span>
        </div>
      </section>
    </div>
  )
}

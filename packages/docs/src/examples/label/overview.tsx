import { Input } from "@registry/ui/input"
import { Label } from "@registry/ui/label"

export function LabelOverviewDemo() {
  return (
    <div className="grid max-w-3xl gap-8" data-demo="label-overview">
      <section className="space-y-3" data-demo="label-basic">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Basic</h4>
        <div className="space-y-2">
          <Label htmlFor="docs-label-name">Dataset Name</Label>
          <Input id="docs-label-name" placeholder="Enter name..." />
        </div>
      </section>

      <section className="space-y-3" data-demo="label-required">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Required marker
        </h4>
        <div className="space-y-2">
          <Label htmlFor="docs-label-crs">
            CRS <span className="text-destructive">*</span>
          </Label>
          <Input id="docs-label-crs" placeholder="EPSG:4326" />
        </div>
      </section>

      <section className="space-y-3" data-demo="label-disabled-peer">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Disabled peer
        </h4>
        <div className="space-y-2">
          <Label htmlFor="docs-label-disabled">Locked attribute</Label>
          <Input id="docs-label-disabled" className="peer" disabled value="system:id" />
        </div>
      </section>
    </div>
  )
}

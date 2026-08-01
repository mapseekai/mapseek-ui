import { Badge } from "@registry/ui/badge"

export function BadgeOverviewDemo() {
  return (
    <div className="space-y-8" data-demo="badge-overview">
      <section className="space-y-3">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Variants
        </h4>
        <div className="flex flex-wrap gap-3">
          <Badge data-demo="badge-variant-default">Default</Badge>
          <Badge data-demo="badge-variant-secondary" variant="secondary">
            Secondary
          </Badge>
          <Badge data-demo="badge-variant-destructive" variant="destructive">
            Destructive
          </Badge>
          <Badge data-demo="badge-variant-outline" variant="outline">
            Outline
          </Badge>
          <Badge data-demo="badge-variant-ghost" variant="ghost">
            Ghost
          </Badge>
          <Badge data-demo="badge-variant-link" variant="link">
            Link
          </Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          GIS states
        </h4>
        <div className="flex flex-wrap gap-3">
          <Badge>Published</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">EPSG:4326</Badge>
          <Badge variant="ghost">TopoJSON</Badge>
        </div>
      </section>
    </div>
  )
}

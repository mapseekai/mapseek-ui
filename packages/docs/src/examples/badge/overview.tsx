import { Badge } from "@registry/ui/badge"
import { useLocaleLabels } from "../use-locale-labels"

export type BadgeOverviewDemoLabels = {
  readonly variants: string
  readonly default: string
  readonly secondary: string
  readonly destructive: string
  readonly outline: string
  readonly ghost: string
  readonly link: string
  readonly gisStates: string
  readonly published: string
  readonly draft: string
  readonly error: string
}

export const zhBadgeOverviewLabels = {
  variants: "变体",
  default: "默认",
  secondary: "次级",
  destructive: "危险",
  outline: "轮廓",
  ghost: "幽灵",
  link: "链接",
  gisStates: "GIS 状态",
  published: "已发布",
  draft: "草稿",
  error: "错误",
} satisfies BadgeOverviewDemoLabels

export const enBadgeOverviewLabels = {
  variants: "Variants",
  default: "Default",
  secondary: "Secondary",
  destructive: "Destructive",
  outline: "Outline",
  ghost: "Ghost",
  link: "Link",
  gisStates: "GIS states",
  published: "Published",
  draft: "Draft",
  error: "Error",
} satisfies BadgeOverviewDemoLabels

export function BadgeOverviewDemo({ labels }: { readonly labels?: BadgeOverviewDemoLabels }) {
  const localizedLabels = useLocaleLabels({ zh: zhBadgeOverviewLabels, en: enBadgeOverviewLabels })
  const demoLabels = labels ?? localizedLabels

  return (
    <div className="space-y-8" data-demo="badge-overview">
      <section className="space-y-3">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.variants}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Badge data-demo="badge-variant-default">{demoLabels.default}</Badge>
          <Badge data-demo="badge-variant-secondary" variant="secondary">
            {demoLabels.secondary}
          </Badge>
          <Badge data-demo="badge-variant-destructive" variant="destructive">
            {demoLabels.destructive}
          </Badge>
          <Badge data-demo="badge-variant-outline" variant="outline">
            {demoLabels.outline}
          </Badge>
          <Badge data-demo="badge-variant-ghost" variant="ghost">
            {demoLabels.ghost}
          </Badge>
          <Badge data-demo="badge-variant-link" variant="link">
            {demoLabels.link}
          </Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.gisStates}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Badge>{demoLabels.published}</Badge>
          <Badge variant="secondary">{demoLabels.draft}</Badge>
          <Badge variant="destructive">{demoLabels.error}</Badge>
          <Badge variant="outline">EPSG:4326</Badge>
          <Badge variant="ghost">TopoJSON</Badge>
        </div>
      </section>
    </div>
  )
}

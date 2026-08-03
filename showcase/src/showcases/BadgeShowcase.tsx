import { Badge } from "@registry/ui/badge"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
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
  },
  en: {
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
  },
}

export function BadgeOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
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
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
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

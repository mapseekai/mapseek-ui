import { Tag } from "@registry/ui/tag"
import {
  IconAlertTriangle,
  IconArchive,
  IconChartBar,
  IconCircleCheck,
  IconClock,
  IconMap,
  IconMapPin,
} from "@tabler/icons-react"
import type { LocalizedDemoProps } from "./types"

const iconProps = {
  "aria-hidden": true,
  "data-icon": "inline-start",
  stroke: 1.75,
}

const sizeValues = {
  xs: "12px",
  sm: "16px",
  default: "20px",
  lg: "24px",
  xl: "28px",
} as const

const labels = {
  "zh-CN": {
    outlineColors: "轮廓色",
    solidColors: "实底色",
    green: "主题绿",
    blue: "蓝色",
    yellow: "黄色",
    orange: "橙色",
    purple: "紫色",
    cyan: "青色",
    gray: "灰色",
    sizes: "尺寸刻度",
    xs: "极小",
    sm: "小",
    default: "默认",
    lg: "大",
    xl: "特大",
    examples: "分类示例",
    verified: "已验证",
    vector: "矢量数据",
    review: "待审核",
    warning: "需注意",
    analysis: "分析结果",
    reference: "参考图层",
    archived: "已归档",
  },
  en: {
    outlineColors: "Outline colors",
    solidColors: "Solid colors",
    green: "Theme green",
    blue: "Blue",
    yellow: "Yellow",
    orange: "Orange",
    purple: "Purple",
    cyan: "Cyan",
    gray: "Gray",
    sizes: "Size scale",
    xs: "XS",
    sm: "SM",
    default: "Default",
    lg: "LG",
    xl: "XL",
    examples: "Category examples",
    verified: "Verified",
    vector: "Vector data",
    review: "In review",
    warning: "Needs attention",
    analysis: "Analysis result",
    reference: "Reference layer",
    archived: "Archived",
  },
}

export function TagOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.outlineColors}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Tag data-demo="tag-green">
            <IconCircleCheck {...iconProps} />
            {demoLabels.green}
          </Tag>
          <Tag color="blue" data-demo="tag-blue">
            <IconMap {...iconProps} />
            {demoLabels.blue}
          </Tag>
          <Tag color="yellow" data-demo="tag-yellow">
            <IconClock {...iconProps} />
            {demoLabels.yellow}
          </Tag>
          <Tag color="orange" data-demo="tag-orange">
            <IconAlertTriangle {...iconProps} />
            {demoLabels.orange}
          </Tag>
          <Tag color="purple" data-demo="tag-purple">
            <IconChartBar {...iconProps} />
            {demoLabels.purple}
          </Tag>
          <Tag color="cyan" data-demo="tag-cyan">
            <IconMapPin {...iconProps} />
            {demoLabels.cyan}
          </Tag>
          <Tag color="gray" data-demo="tag-gray">
            <IconArchive {...iconProps} />
            {demoLabels.gray}
          </Tag>
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.solidColors}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Tag data-demo="tag-solid-green" variant="solid">
            <IconCircleCheck {...iconProps} />
            {demoLabels.green}
          </Tag>
          <Tag color="blue" data-demo="tag-solid-blue" variant="solid">
            <IconMap {...iconProps} />
            {demoLabels.blue}
          </Tag>
          <Tag color="yellow" data-demo="tag-solid-yellow" variant="solid">
            <IconClock {...iconProps} />
            {demoLabels.yellow}
          </Tag>
          <Tag color="orange" data-demo="tag-solid-orange" variant="solid">
            <IconAlertTriangle {...iconProps} />
            {demoLabels.orange}
          </Tag>
          <Tag color="purple" data-demo="tag-solid-purple" variant="solid">
            <IconChartBar {...iconProps} />
            {demoLabels.purple}
          </Tag>
          <Tag color="cyan" data-demo="tag-solid-cyan" variant="solid">
            <IconMapPin {...iconProps} />
            {demoLabels.cyan}
          </Tag>
          <Tag color="gray" data-demo="tag-solid-gray" variant="solid">
            <IconArchive {...iconProps} />
            {demoLabels.gray}
          </Tag>
        </div>
      </section>
      <section className="flex flex-col gap-3" data-demo="tag-sizes">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.sizes}
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5" data-demo="tag-size-xs">
            <Tag size="xs">
              <IconCircleCheck {...iconProps} />
              {demoLabels.xs}
            </Tag>
            <span className="text-body-sm text-muted-foreground" data-slot="tag-size-value">
              {sizeValues.xs}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5" data-demo="tag-size-sm">
            <Tag size="sm">
              <IconCircleCheck {...iconProps} />
              {demoLabels.sm}
            </Tag>
            <span className="text-body-sm text-muted-foreground" data-slot="tag-size-value">
              {sizeValues.sm}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5" data-demo="tag-size-default">
            <Tag size="default">
              <IconCircleCheck {...iconProps} />
              {demoLabels.default}
            </Tag>
            <span className="text-body-sm text-muted-foreground" data-slot="tag-size-value">
              {sizeValues.default}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5" data-demo="tag-size-lg">
            <Tag size="lg">
              <IconCircleCheck {...iconProps} />
              {demoLabels.lg}
            </Tag>
            <span className="text-body-sm text-muted-foreground" data-slot="tag-size-value">
              {sizeValues.lg}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5" data-demo="tag-size-xl">
            <Tag size="xl">
              <IconCircleCheck {...iconProps} />
              {demoLabels.xl}
            </Tag>
            <span className="text-body-sm text-muted-foreground" data-slot="tag-size-value">
              {sizeValues.xl}
            </span>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.examples}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Tag>
            <IconCircleCheck {...iconProps} />
            {demoLabels.verified}
          </Tag>
          <Tag color="blue">
            <IconMap {...iconProps} />
            {demoLabels.vector}
          </Tag>
          <Tag color="yellow">
            <IconClock {...iconProps} />
            {demoLabels.review}
          </Tag>
          <Tag color="orange">
            <IconAlertTriangle {...iconProps} />
            {demoLabels.warning}
          </Tag>
          <Tag color="purple">
            <IconChartBar {...iconProps} />
            {demoLabels.analysis}
          </Tag>
          <Tag color="cyan">
            <IconMapPin {...iconProps} />
            {demoLabels.reference}
          </Tag>
          <Tag color="gray">
            <IconArchive {...iconProps} />
            {demoLabels.archived}
          </Tag>
        </div>
      </section>
    </div>
  )
}

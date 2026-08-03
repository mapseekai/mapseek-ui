import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const basicLabels = {
  "zh-CN": {
    runQuery: "运行查询",
    disabled: "禁用",
    outlineDisabled: "轮廓禁用",
    presses: (count: number) => `点击次数：${count}`,
  },
  en: {
    runQuery: "Run query",
    disabled: "Disabled",
    outlineDisabled: "Outline disabled",
    presses: (count: number) => `Presses: ${count}`,
  },
} as const

export function ButtonBasicDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [presses, setPresses] = useState(0)
  const demoLabels = basicLabels[locale]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button data-demo="button-primary-action" onClick={() => setPresses((value) => value + 1)}>
          {demoLabels.runQuery}
        </Button>
        <Button data-demo="button-disabled" disabled>
          {demoLabels.disabled}
        </Button>
        <Button data-demo="button-outline-disabled" variant="outline" disabled>
          {demoLabels.outlineDisabled}
        </Button>
      </div>
      <p data-demo="button-press-count" className="text-xs text-muted-foreground">
        {demoLabels.presses(presses)}
      </p>
    </div>
  )
}

const sizesLabels = {
  "zh-CN": { xSmall: "特小", small: "小", default: "默认", large: "大" },
  en: { xSmall: "XSmall", small: "Small", default: "Default", large: "Large" },
} as const

export function ButtonSizesDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = sizesLabels[locale]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button data-demo="button-size-xs" size="xs">
        {demoLabels.xSmall}
      </Button>
      <Button data-demo="button-size-sm" size="sm">
        {demoLabels.small}
      </Button>
      <Button data-demo="button-size-default" size="default">
        {demoLabels.default}
      </Button>
      <Button data-demo="button-size-lg" size="lg">
        {demoLabels.large}
      </Button>
    </div>
  )
}

const variantsLabels = {
  "zh-CN": {
    default: "默认",
    secondary: "次级",
    outline: "轮廓",
    ghost: "幽灵",
    destructive: "危险",
    link: "链接",
  },
  en: {
    default: "Default",
    secondary: "Secondary",
    outline: "Outline",
    ghost: "Ghost",
    destructive: "Destructive",
    link: "Link",
  },
} as const

export function ButtonVariantsDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = variantsLabels[locale]

  return (
    <div className="flex flex-wrap gap-3">
      <Button data-demo="button-variant-default" variant="default">
        {demoLabels.default}
      </Button>
      <Button data-demo="button-variant-secondary" variant="secondary">
        {demoLabels.secondary}
      </Button>
      <Button data-demo="button-variant-outline" variant="outline">
        {demoLabels.outline}
      </Button>
      <Button data-demo="button-variant-ghost" variant="ghost">
        {demoLabels.ghost}
      </Button>
      <Button data-demo="button-variant-destructive" variant="destructive">
        {demoLabels.destructive}
      </Button>
      <Button data-demo="button-variant-link" variant="link">
        {demoLabels.link}
      </Button>
    </div>
  )
}

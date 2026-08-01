import { Button } from "@registry/ui/button"
import { useState } from "react"
import { useLocaleLabels } from "../use-locale-labels"

export type ButtonBasicDemoLabels = {
  readonly runQuery: string
  readonly disabled: string
  readonly outlineDisabled: string
  readonly presses: (count: number) => string
}

export const zhButtonBasicLabels = {
  runQuery: "运行查询",
  disabled: "禁用",
  outlineDisabled: "轮廓禁用",
  presses: (count: number) => `点击次数：${count}`,
} satisfies ButtonBasicDemoLabels

export const enButtonBasicLabels = {
  runQuery: "Run query",
  disabled: "Disabled",
  outlineDisabled: "Outline disabled",
  presses: (count: number) => `Presses: ${count}`,
} satisfies ButtonBasicDemoLabels

export function ButtonBasicDemo({ labels }: { readonly labels?: ButtonBasicDemoLabels }) {
  const [presses, setPresses] = useState(0)
  const localizedLabels = useLocaleLabels({ zh: zhButtonBasicLabels, en: enButtonBasicLabels })
  const demoLabels = labels ?? localizedLabels

  return (
    <div data-demo="button-basic" className="flex flex-col gap-3">
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

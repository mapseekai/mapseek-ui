import { Button } from "@registry/ui/button"
import { useLocaleLabels } from "../use-locale-labels"

export type ButtonSizesDemoLabels = {
  readonly xSmall: string
  readonly small: string
  readonly default: string
  readonly large: string
}

export const zhButtonSizesLabels = {
  xSmall: "特小",
  small: "小",
  default: "默认",
  large: "大",
} satisfies ButtonSizesDemoLabels

export const enButtonSizesLabels = {
  xSmall: "XSmall",
  small: "Small",
  default: "Default",
  large: "Large",
} satisfies ButtonSizesDemoLabels

export function ButtonSizesDemo({ labels }: { readonly labels?: ButtonSizesDemoLabels }) {
  const localizedLabels = useLocaleLabels({ zh: zhButtonSizesLabels, en: enButtonSizesLabels })
  const demoLabels = labels ?? localizedLabels

  return (
    <div data-demo="button-sizes" className="flex flex-wrap items-center gap-3">
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

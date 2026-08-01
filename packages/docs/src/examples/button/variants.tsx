import { Button } from "@registry/ui/button"
import { useLocaleLabels } from "../use-locale-labels"

export type ButtonVariantsDemoLabels = {
  readonly default: string
  readonly secondary: string
  readonly outline: string
  readonly ghost: string
  readonly destructive: string
  readonly link: string
}

export const zhButtonVariantsLabels = {
  default: "默认",
  secondary: "次级",
  outline: "轮廓",
  ghost: "幽灵",
  destructive: "危险",
  link: "链接",
} satisfies ButtonVariantsDemoLabels

export const enButtonVariantsLabels = {
  default: "Default",
  secondary: "Secondary",
  outline: "Outline",
  ghost: "Ghost",
  destructive: "Destructive",
  link: "Link",
} satisfies ButtonVariantsDemoLabels

export function ButtonVariantsDemo({ labels }: { readonly labels?: ButtonVariantsDemoLabels }) {
  const localizedLabels = useLocaleLabels({
    zh: zhButtonVariantsLabels,
    en: enButtonVariantsLabels,
  })
  const demoLabels = labels ?? localizedLabels

  return (
    <div data-demo="button-variants" className="flex flex-wrap gap-3">
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

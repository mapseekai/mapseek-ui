import { Button } from "@registry/ui/button"

export function ButtonVariantsDemo() {
  return (
    <div data-demo="button-variants" className="flex flex-wrap gap-3">
      <Button data-demo="button-variant-default" variant="default">
        Default
      </Button>
      <Button data-demo="button-variant-secondary" variant="secondary">
        Secondary
      </Button>
      <Button data-demo="button-variant-outline" variant="outline">
        Outline
      </Button>
      <Button data-demo="button-variant-ghost" variant="ghost">
        Ghost
      </Button>
      <Button data-demo="button-variant-destructive" variant="destructive">
        Destructive
      </Button>
      <Button data-demo="button-variant-link" variant="link">
        Link
      </Button>
    </div>
  )
}

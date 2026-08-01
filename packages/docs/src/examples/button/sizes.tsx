import { Button } from "@registry/ui/button"

export function ButtonSizesDemo() {
  return (
    <div data-demo="button-sizes" className="flex flex-wrap items-center gap-3">
      <Button data-demo="button-size-xs" size="xs">
        XSmall
      </Button>
      <Button data-demo="button-size-sm" size="sm">
        Small
      </Button>
      <Button data-demo="button-size-default" size="default">
        Default
      </Button>
      <Button data-demo="button-size-lg" size="lg">
        Large
      </Button>
    </div>
  )
}

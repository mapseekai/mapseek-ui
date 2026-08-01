import { Button } from "@registry/ui/button"
import { useState } from "react"

export function ButtonBasicDemo() {
  const [presses, setPresses] = useState(0)

  return (
    <div data-demo="button-basic" className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button data-demo="button-primary-action" onClick={() => setPresses((value) => value + 1)}>
          Run query
        </Button>
        <Button data-demo="button-disabled" disabled>
          Disabled
        </Button>
        <Button data-demo="button-outline-disabled" variant="outline" disabled>
          Outline disabled
        </Button>
      </div>
      <p data-demo="button-press-count" className="text-xs text-muted-foreground">
        Presses: {presses}
      </p>
    </div>
  )
}

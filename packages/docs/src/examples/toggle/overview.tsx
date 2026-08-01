import { Toggle } from "@registry/ui/toggle"
import { useState } from "react"

export function ToggleOverviewDemo() {
  const [pressed, setPressed] = useState(false)

  return (
    <div className="space-y-8" data-demo="toggle-overview">
      <section className="space-y-3" data-demo="toggle-text">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Text toggles
        </h4>
        <div className="flex flex-wrap gap-2">
          <Toggle>Bold</Toggle>
          <Toggle defaultPressed>Active</Toggle>
          <Toggle disabled>Disabled</Toggle>
          <Toggle aria-invalid>Invalid</Toggle>
        </div>
      </section>

      <section className="space-y-3" data-demo="toggle-controlled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Controlled
        </h4>
        <div className="flex items-center gap-3">
          <Toggle pressed={pressed} onPressedChange={setPressed}>
            Snap
          </Toggle>
          <span className="font-mono text-xs text-muted-foreground" data-demo="toggle-value">
            pressed = {String(pressed)}
          </span>
        </div>
      </section>
    </div>
  )
}

import { Switch } from "@registry/ui/switch"
import { useState } from "react"

export function SwitchOverviewDemo() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="space-y-8 px-3" data-demo="switch-overview">
      <section className="space-y-3" data-demo="switch-sizes">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Sizes</h4>
        <div className="flex flex-wrap items-center gap-4">
          <Switch size="sm" defaultChecked aria-label="Small enabled switch" />
          <Switch size="default" defaultChecked aria-label="Default enabled switch" />
        </div>
      </section>

      <section className="space-y-3" data-demo="switch-states">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          States
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <Switch aria-label="Unchecked switch" />
          <Switch defaultChecked aria-label="Checked switch" />
          <Switch disabled aria-label="Disabled switch" />
          <Switch disabled defaultChecked aria-label="Disabled checked switch" />
          <Switch aria-invalid aria-label="Invalid switch" />
        </div>
      </section>

      <section className="space-y-3" data-demo="switch-controlled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Controlled
        </h4>
        <div className="flex items-center gap-3">
          <Switch aria-label="Enable tile cache" checked={checked} onCheckedChange={setChecked} />
          <span className="font-mono text-xs text-muted-foreground" data-demo="switch-value">
            checked = {String(checked)}
          </span>
        </div>
      </section>
    </div>
  )
}

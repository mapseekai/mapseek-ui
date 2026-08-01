import { Checkbox } from "@registry/ui/checkbox"
import { Label } from "@registry/ui/label"
import { useState } from "react"

export function CheckboxOverviewDemo() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="space-y-8" data-demo="checkbox-overview">
      <section className="space-y-3" data-demo="checkbox-states">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          States
        </h4>
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="docs-checkbox-unchecked" checked={false} />
            <Label htmlFor="docs-checkbox-unchecked">Unchecked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="docs-checkbox-checked" checked />
            <Label htmlFor="docs-checkbox-checked">Checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="docs-checkbox-invalid" aria-invalid checked />
            <Label htmlFor="docs-checkbox-invalid">Invalid selected</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="docs-checkbox-disabled" disabled />
            <Label htmlFor="docs-checkbox-disabled">Disabled</Label>
          </div>
        </div>
      </section>

      <section className="space-y-3" data-demo="checkbox-controlled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Controlled
        </h4>
        <div className="flex items-center gap-2">
          <Checkbox id="docs-checkbox-interactive" checked={checked} onCheckedChange={setChecked} />
          <Label htmlFor="docs-checkbox-interactive">
            {checked ? "Included in export" : "Include in export"}
          </Label>
        </div>
      </section>
    </div>
  )
}

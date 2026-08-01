import { Input } from "@registry/ui/input"
import { type ChangeEvent, useState } from "react"

export function InputOverviewDemo() {
  const [value, setValue] = useState("roads-2026.geojson")

  return (
    <div className="max-w-sm space-y-8" data-demo="input-overview">
      <section className="space-y-3" data-demo="input-default">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Default
        </h4>
        <Input placeholder="Type something..." />
      </section>

      <section className="space-y-3" data-demo="input-controlled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Controlled
        </h4>
        <Input
          aria-label="Dataset file"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.currentTarget.value)}
        />
        <p className="text-xs text-muted-foreground" data-demo="input-value">
          Value: {value}
        </p>
      </section>

      <section className="space-y-3" data-demo="input-readonly">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Read only
        </h4>
        <Input readOnly value="EPSG:4326" aria-label="Read only CRS" />
      </section>

      <section className="space-y-3" data-demo="input-disabled-invalid">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Disabled and invalid
        </h4>
        <Input placeholder="Disabled" disabled />
        <Input aria-invalid placeholder="Invalid field" />
      </section>
    </div>
  )
}

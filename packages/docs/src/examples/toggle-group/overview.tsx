import { ToggleGroup, ToggleGroupItem } from "@registry/ui/toggle-group"
import { useState } from "react"

export function ToggleGroupOverviewDemo() {
  const [alignment, setAlignment] = useState(["left"])
  const [styles, setStyles] = useState(["bold"])

  return (
    <div className="space-y-8" data-demo="toggle-group-overview">
      <section className="space-y-3" data-demo="toggle-group-single">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Single select
        </h4>
        <ToggleGroup value={alignment} onValueChange={setAlignment}>
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground" data-demo="toggle-group-alignment">
          Alignment: {alignment.join(", ") || "none"}
        </p>
      </section>

      <section className="space-y-3" data-demo="toggle-group-multiple">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Multi select
        </h4>
        <ToggleGroup value={styles} onValueChange={setStyles}>
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
          <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
          <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
          <ToggleGroupItem value="disabled" disabled>
            Disabled
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground" data-demo="toggle-group-styles">
          Styles: {styles.join(", ") || "none"}
        </p>
      </section>
    </div>
  )
}

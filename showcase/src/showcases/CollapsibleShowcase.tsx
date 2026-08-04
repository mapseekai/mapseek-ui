import { Button } from "@registry/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@registry/ui/collapsible"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

export function CollapsibleOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="max-w-xl border border-border">
      <div className="flex items-center justify-between gap-4 p-3">
        <div>
          <div className="text-sm font-medium">Dataset details</div>
          <div className="text-xs text-muted-foreground">EPSG:4326 · 2,847 features</div>
        </div>
        <CollapsibleTrigger
          render={<Button data-demo="collapsible-trigger" variant="outline" size="sm" />}
        >
          {open ? "Collapse" : "Expand"}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent
        className="border-t border-border bg-muted p-3 text-xs"
        data-demo="collapsible-content"
      >
        Last updated: 2026-07-31 · Data format: GeoJSON
      </CollapsibleContent>
      <span className="sr-only" data-demo="collapsible-state">
        {open ? "open" : "closed"}
      </span>
    </Collapsible>
  )
}

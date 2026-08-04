import { Button } from "@registry/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@registry/ui/popover"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

export function PopoverOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  void locale
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-8">
      <section className="space-y-3" data-demo="popover-basic">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Basic popover
        </h4>
        <Popover>
          <PopoverTrigger
            render={
              <Button data-demo="popover-basic-trigger" variant="outline">
                Open popover
              </Button>
            }
          />
          <PopoverContent data-demo="popover-basic-content">
            <PopoverHeader>
              <PopoverTitle>Layer metadata</PopoverTitle>
              <PopoverDescription>Administrative boundaries · EPSG:4326</PopoverDescription>
            </PopoverHeader>
            <p className="text-xs text-foreground">2,847 features · updated 2026-07-31</p>
          </PopoverContent>
        </Popover>
      </section>

      <section className="space-y-3" data-demo="popover-placement">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Side and alignment
        </h4>
        <div className="flex flex-wrap gap-3">
          {(["top", "bottom", "left", "right"] as const).map((side) => (
            <Popover key={side}>
              <PopoverTrigger
                render={
                  <Button variant="outline" size="sm">
                    {side}
                  </Button>
                }
              />
              <PopoverContent side={side}>
                <p className="text-xs">Placement side: {side}</p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </section>

      <section className="space-y-3" data-demo="popover-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Controlled popover
        </h4>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button data-demo="popover-controlled-trigger" variant="outline">
                Layer info
              </Button>
            }
          />
          <PopoverContent data-demo="popover-controlled-content" className="w-52">
            <div className="space-y-1">
              <p className="text-xs font-semibold">Administrative Boundaries</p>
              <p className="text-xs text-muted-foreground">CRS: EPSG:4326</p>
              <p className="text-xs text-muted-foreground">Features: 2,847</p>
            </div>
            <div className="flex justify-end">
              <Button
                data-demo="popover-controlled-close"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </section>
    </div>
  )
}

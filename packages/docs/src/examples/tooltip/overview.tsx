import { Button } from "@registry/ui/button"
import { Tooltip, TooltipProvider } from "@registry/ui/tooltip"
import { IconDownload, IconMap, IconSettings, IconTrash, IconZoomIn } from "@tabler/icons-react"

export function TooltipOverviewDemo() {
  return (
    <TooltipProvider>
      <div className="grid gap-8" data-demo="tooltip-overview">
        <section className="space-y-3" data-demo="tooltip-actions">
          <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Hover or focus for help
          </h4>
          <div className="flex flex-wrap gap-3">
            <Tooltip content="View map" asChild>
              <Button data-demo="tooltip-map" variant="outline" size="sm">
                Map
              </Button>
            </Tooltip>
            <Tooltip content="Download dataset" asChild>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </Tooltip>
            <Tooltip content="Delete layer. This cannot be undone." asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </Tooltip>
            <Tooltip content="Layer settings" asChild>
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </Tooltip>
          </div>
        </section>

        <section className="space-y-3" data-demo="tooltip-placement">
          <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Placement
          </h4>
          <div className="flex flex-wrap gap-3">
            {(["top", "bottom", "left", "right"] as const).map((side) => (
              <Tooltip key={side} content={`Side: ${side}`} side={side} asChild>
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              </Tooltip>
            ))}
          </div>
        </section>

        <section className="space-y-3" data-demo="tooltip-disabled">
          <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Disabled tooltip
          </h4>
          <Tooltip content="This tooltip is disabled" disabled asChild>
            <Button data-demo="tooltip-disabled-trigger" variant="outline" size="sm">
              No tooltip
            </Button>
          </Tooltip>
        </section>

        <section className="space-y-3" data-demo="tooltip-toolbar">
          <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Icon toolbar
          </h4>
          <div className="flex gap-1 border border-border p-1">
            <Tooltip content="Layer panel" asChild>
              <Button aria-label="Layer panel" variant="ghost" size="icon-sm">
                <IconMap />
              </Button>
            </Tooltip>
            <Tooltip content="Zoom to selection" asChild>
              <Button aria-label="Zoom to selection" variant="ghost" size="icon-sm">
                <IconZoomIn />
              </Button>
            </Tooltip>
            <Tooltip content="Download" asChild>
              <Button aria-label="Download" variant="ghost" size="icon-sm">
                <IconDownload />
              </Button>
            </Tooltip>
            <Tooltip content="Settings" asChild>
              <Button aria-label="Settings" variant="ghost" size="icon-sm">
                <IconSettings />
              </Button>
            </Tooltip>
            <Tooltip content="Delete. This cannot be undone." asChild>
              <Button
                aria-label="Delete"
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive"
              >
                <IconTrash />
              </Button>
            </Tooltip>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}

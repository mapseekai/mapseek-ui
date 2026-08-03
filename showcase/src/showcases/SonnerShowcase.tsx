import { Button } from "@registry/ui/button"
import { toast } from "@registry/ui/sonner"
import type { LocalizedDemoProps } from "./types"

export function SonnerOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  void locale
  return (
    <div className="grid gap-8">
      <section className="space-y-3" data-demo="sonner-types">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Toast types
        </h4>
        <p className="text-xs text-muted-foreground">Toasts render at the top of the page.</p>
        <div className="flex flex-wrap gap-3">
          <Button
            data-demo="sonner-success"
            variant="outline"
            size="sm"
            onClick={() => toast.success("Dataset uploaded successfully.")}
          >
            Success
          </Button>
          <Button
            data-demo="sonner-error"
            variant="outline"
            size="sm"
            onClick={() => toast.error("Upload failed: file too large.")}
          >
            Error
          </Button>
          <Button
            data-demo="sonner-warning"
            variant="outline"
            size="sm"
            onClick={() => toast.warning("CRS mismatch detected.")}
          >
            Warning
          </Button>
          <Button
            data-demo="sonner-info"
            variant="outline"
            size="sm"
            onClick={() => toast.info("Processing in background.")}
          >
            Info
          </Button>
          <Button
            data-demo="sonner-default"
            variant="outline"
            size="sm"
            onClick={() => toast("Default toast message.")}
          >
            Default
          </Button>
        </div>
      </section>

      <section className="space-y-3" data-demo="sonner-rich">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Description and action
        </h4>
        <div className="flex flex-wrap gap-3">
          <Button
            data-demo="sonner-description"
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Layer saved", {
                description: "road_network.topojson · EPSG:4326",
              })
            }
          >
            Description
          </Button>
          <Button
            data-demo="sonner-action"
            variant="outline"
            size="sm"
            onClick={() =>
              toast.error("Upload failed", {
                description: "File size exceeds the 500 MB limit.",
                action: { label: "Retry", onClick: () => toast.info("Retry queued.") },
              })
            }
          >
            Action
          </Button>
        </div>
      </section>
    </div>
  )
}

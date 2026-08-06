import { CardTabs, CardTabsContent, CardTabsList, CardTabsTrigger } from "@registry/ui/card-tabs"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

export function CardTabsOverviewDemo(_props: LocalizedDemoProps) {
  const [controlledValue, setControlledValue] = useState("schema")

  return (
    <div className="grid gap-8">
      <section className="space-y-3" data-demo="card-tabs-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Controlled line
        </h4>
        <div className="max-w-lg">
          <CardTabs value={controlledValue} onValueChange={setControlledValue}>
            <CardTabsList>
              <CardTabsTrigger value="style">Style</CardTabsTrigger>
              <CardTabsTrigger value="schema">Schema</CardTabsTrigger>
              <CardTabsTrigger value="export">Export</CardTabsTrigger>
            </CardTabsList>
            <CardTabsContent value="style">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Map appearance</p>
                <p className="text-sm text-muted-foreground">
                  Configure layer colors, opacity, and label visibility.
                </p>
              </div>
            </CardTabsContent>
            <CardTabsContent value="schema">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Geometry</p>
                  <p className="mt-1 text-sm font-medium text-foreground">Polygon</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fields</p>
                  <p className="mt-1 text-sm font-medium text-foreground">18 columns</p>
                </div>
              </div>
            </CardTabsContent>
            <CardTabsContent value="export">
              <p className="text-sm text-muted-foreground">
                Choose GeoJSON, GeoPackage, or a tiled archive for delivery.
              </p>
            </CardTabsContent>
          </CardTabs>
        </div>
        <p className="text-xs text-muted-foreground">Selected: {controlledValue}</p>
      </section>

      <section className="space-y-3" data-demo="card-tabs-vertical">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Vertical
        </h4>
        <div className="max-w-lg">
          <CardTabs defaultValue="details" orientation="vertical">
            <CardTabsList>
              <CardTabsTrigger value="details">Details</CardTabsTrigger>
              <CardTabsTrigger value="history">History</CardTabsTrigger>
              <CardTabsTrigger value="access" disabled>
                Access
              </CardTabsTrigger>
            </CardTabsList>
            <CardTabsContent value="details">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Owner</p>
                  <p className="mt-1 text-sm font-medium text-foreground">Spatial Data Team</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dataset metadata, attribution, and publishing settings.
                </p>
              </div>
            </CardTabsContent>
            <CardTabsContent value="history">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Published version 12 · 2 hours ago</p>
                <p>Updated field aliases · Yesterday</p>
              </div>
            </CardTabsContent>
          </CardTabs>
        </div>
      </section>
    </div>
  )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/ui/tabs"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

export function TabsOverviewDemo(_props: LocalizedDemoProps) {
  const [controlledValue, setControlledValue] = useState("schema")

  return (
    <div className="grid gap-8">
      <section className="space-y-3" data-demo="tabs-basic">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Basic tabs
        </h4>
        <div className="max-w-md border border-border p-3">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="pt-3 text-sm text-muted-foreground">Dataset overview content.</p>
            </TabsContent>
            <TabsContent value="schema">
              <p className="pt-3 text-sm text-muted-foreground">Field structure content.</p>
            </TabsContent>
            <TabsContent value="preview">
              <p className="pt-3 text-sm text-muted-foreground">Map preview content.</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="space-y-3" data-demo="tabs-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Controlled line tabs
        </h4>
        <div className="max-w-md border border-border p-3">
          <Tabs value={controlledValue} onValueChange={setControlledValue}>
            <TabsList variant="line">
              <TabsTrigger data-demo="tabs-trigger-style" value="style">
                Style
              </TabsTrigger>
              <TabsTrigger data-demo="tabs-trigger-schema" value="schema">
                Schema
              </TabsTrigger>
              <TabsTrigger data-demo="tabs-trigger-export" value="export">
                Export
              </TabsTrigger>
            </TabsList>
            <TabsContent value="style">
              <p className="pt-3 text-sm text-muted-foreground">Map style and layer colors.</p>
            </TabsContent>
            <TabsContent value="schema">
              <p className="pt-3 text-sm text-muted-foreground">
                Feature attributes and field definitions.
              </p>
            </TabsContent>
            <TabsContent value="export">
              <p className="pt-3 text-sm text-muted-foreground">Export options and file formats.</p>
            </TabsContent>
          </Tabs>
        </div>
        <p className="text-xs text-muted-foreground" data-demo="tabs-controlled-value">
          Selected: {controlledValue}
        </p>
      </section>

      <section className="space-y-3" data-demo="tabs-vertical">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Vertical tabs
        </h4>
        <div className="max-w-lg border border-border p-3">
          <Tabs defaultValue="details" orientation="vertical" className="flex-row">
            <TabsList variant="line">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="access" disabled>
                Access
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <p className="ps-3 text-sm text-muted-foreground">Dataset metadata and ownership.</p>
            </TabsContent>
            <TabsContent value="history">
              <p className="ps-3 text-sm text-muted-foreground">Recent publishing activity.</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

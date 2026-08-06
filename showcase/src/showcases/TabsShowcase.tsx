import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/ui/tabs"
import type { LocalizedDemoProps } from "./types"

export function TabsOverviewDemo(_props: LocalizedDemoProps) {
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

      <section className="space-y-3" data-demo="tabs-line">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Line tabs
        </h4>
        <div className="max-w-md border border-border p-3">
          <Tabs defaultValue="schema">
            <TabsList variant="line">
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

      <section className="space-y-3" data-demo="tabs-primary">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Primary tabs
        </h4>
        <div className="max-w-md border border-border p-3">
          <Tabs defaultValue="schema">
            <TabsList variant="primary">
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
    </div>
  )
}

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@registry/ui/resizable"

import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    horizontal: "水平布局",
    layers: "图层",
    inspector: "检查器",
    nested: "垂直嵌套布局",
    map: "地图画布",
    attributes: "属性",
    details: "详情",
  },
  en: {
    horizontal: "Horizontal layout",
    layers: "Layers",
    inspector: "Inspector",
    nested: "Vertically nested layout",
    map: "Map canvas",
    attributes: "Attributes",
    details: "Details",
  },
}

const panelClassName =
  "flex items-center justify-center bg-muted p-3 text-body-sm text-muted-foreground"

export function ResizableOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="grid w-full gap-8">
      <section className="space-y-3" data-demo="resizable-horizontal">
        <h4 className="text-headline-sm text-foreground">{demoLabels.horizontal}</h4>
        <ResizablePanelGroup className="h-48 border border-border" orientation="horizontal">
          <ResizablePanel className={panelClassName} defaultSize="40%" minSize="25%">
            {demoLabels.layers}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className={panelClassName} minSize="25%">
            {demoLabels.inspector}
          </ResizablePanel>
        </ResizablePanelGroup>
      </section>

      <section className="space-y-3" data-demo="resizable-nested">
        <h4 className="text-headline-sm text-foreground">{demoLabels.nested}</h4>
        <ResizablePanelGroup className="h-48 border border-border" orientation="vertical">
          <ResizablePanel className={panelClassName} defaultSize="55%" minSize="30%">
            {demoLabels.map}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize="30%">
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel className={panelClassName} defaultSize="50%" minSize="25%">
                {demoLabels.attributes}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel className={panelClassName} minSize="25%">
                {demoLabels.details}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </section>
    </div>
  )
}

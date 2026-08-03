import { Button } from "@registry/ui/button"
import { Tooltip, TooltipProvider } from "@registry/ui/tooltip"
import { IconDownload, IconMap, IconSettings, IconTrash, IconZoomIn } from "@tabler/icons-react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    hoverOrFocusForHelp: "悬停或聚焦查看帮助",
    viewMap: "查看地图",
    map: "地图",
    downloadDataset: "下载数据集",
    download: "下载",
    deleteLayerCannotUndo: "删除图层。此操作无法撤销。",
    delete: "删除",
    layerSettings: "图层设置",
    settings: "设置",
    placement: "位置",
    side: (side: string) => `方向：${side}`,
    disabledTooltip: "禁用 tooltip",
    disabledTooltipContent: "此 tooltip 已禁用",
    noTooltip: "无 tooltip",
    iconToolbar: "图标工具栏",
    layerPanel: "图层面板",
    zoomToSelection: "缩放到选中项",
  },
  en: {
    hoverOrFocusForHelp: "Hover or focus for help",
    viewMap: "View map",
    map: "Map",
    downloadDataset: "Download dataset",
    download: "Download",
    deleteLayerCannotUndo: "Delete layer. This cannot be undone.",
    delete: "Delete",
    layerSettings: "Layer settings",
    settings: "Settings",
    placement: "Placement",
    side: (side: string) => `Side: ${side}`,
    disabledTooltip: "Disabled tooltip",
    disabledTooltipContent: "This tooltip is disabled",
    noTooltip: "No tooltip",
    iconToolbar: "Icon toolbar",
    layerPanel: "Layer panel",
    zoomToSelection: "Zoom to selection",
  },
}

export function TooltipOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <TooltipProvider>
      <div className="grid gap-8">
        <section className="space-y-3" data-demo="tooltip-actions">
          <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
            {demoLabels.hoverOrFocusForHelp}
          </h4>
          <div className="flex flex-wrap gap-3">
            <Tooltip content={demoLabels.viewMap} asChild>
              <Button data-demo="tooltip-map" variant="outline" size="sm">
                {demoLabels.map}
              </Button>
            </Tooltip>
            <Tooltip content={demoLabels.downloadDataset} asChild>
              <Button variant="outline" size="sm">
                {demoLabels.download}
              </Button>
            </Tooltip>
            <Tooltip content={demoLabels.deleteLayerCannotUndo} asChild>
              <Button variant="destructive" size="sm">
                {demoLabels.delete}
              </Button>
            </Tooltip>
            <Tooltip content={demoLabels.layerSettings} asChild>
              <Button variant="ghost" size="sm">
                {demoLabels.settings}
              </Button>
            </Tooltip>
          </div>
        </section>

        <section className="space-y-3" data-demo="tooltip-placement">
          <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
            {demoLabels.placement}
          </h4>
          <div className="flex flex-wrap gap-3">
            {(["top", "bottom", "left", "right"] as const).map((side) => (
              <Tooltip key={side} content={demoLabels.side(side)} side={side} asChild>
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              </Tooltip>
            ))}
          </div>
        </section>

        <section className="space-y-3" data-demo="tooltip-disabled">
          <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
            {demoLabels.disabledTooltip}
          </h4>
          <Tooltip content={demoLabels.disabledTooltipContent} disabled asChild>
            <Button data-demo="tooltip-disabled-trigger" variant="outline" size="sm">
              {demoLabels.noTooltip}
            </Button>
          </Tooltip>
        </section>

        <section className="space-y-3" data-demo="tooltip-toolbar">
          <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
            {demoLabels.iconToolbar}
          </h4>
          <div className="flex gap-1 border border-border p-1">
            <Tooltip content={demoLabels.layerPanel} asChild>
              <Button aria-label={demoLabels.layerPanel} variant="ghost" size="icon-sm">
                <IconMap />
              </Button>
            </Tooltip>
            <Tooltip content={demoLabels.zoomToSelection} asChild>
              <Button aria-label={demoLabels.zoomToSelection} variant="ghost" size="icon-sm">
                <IconZoomIn />
              </Button>
            </Tooltip>
            <Tooltip content={demoLabels.download} asChild>
              <Button aria-label={demoLabels.download} variant="ghost" size="icon-sm">
                <IconDownload />
              </Button>
            </Tooltip>
            <Tooltip content={demoLabels.settings} asChild>
              <Button aria-label={demoLabels.settings} variant="ghost" size="icon-sm">
                <IconSettings />
              </Button>
            </Tooltip>
            <Tooltip content={demoLabels.deleteLayerCannotUndo} asChild>
              <Button
                aria-label={demoLabels.delete}
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

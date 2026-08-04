import { Button } from "@registry/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@registry/ui/tooltip"
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
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button data-demo="tooltip-map" variant="outline" size="sm">
                    {demoLabels.map}
                  </Button>
                }
              />
              <TooltipContent>{demoLabels.viewMap}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="sm">
                    {demoLabels.download}
                  </Button>
                }
              />
              <TooltipContent>{demoLabels.downloadDataset}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="destructive" size="sm">
                    {demoLabels.delete}
                  </Button>
                }
              />
              <TooltipContent>{demoLabels.deleteLayerCannotUndo}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="sm">
                    {demoLabels.settings}
                  </Button>
                }
              />
              <TooltipContent>{demoLabels.layerSettings}</TooltipContent>
            </Tooltip>
          </div>
        </section>

        <section className="space-y-3" data-demo="tooltip-placement">
          <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
            {demoLabels.placement}
          </h4>
          <div className="flex flex-wrap gap-3">
            {(["top", "bottom", "left", "right"] as const).map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger
                  render={
                    <Button variant="outline" size="sm">
                      {side}
                    </Button>
                  }
                />
                <TooltipContent side={side}>{demoLabels.side(side)}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>

        <section className="space-y-3" data-demo="tooltip-disabled">
          <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
            {demoLabels.disabledTooltip}
          </h4>
          <Tooltip disabled>
            <TooltipTrigger
              render={
                <Button data-demo="tooltip-disabled-trigger" variant="outline" size="sm">
                  {demoLabels.noTooltip}
                </Button>
              }
            />
            <TooltipContent>{demoLabels.disabledTooltipContent}</TooltipContent>
          </Tooltip>
        </section>

        <section className="space-y-3" data-demo="tooltip-toolbar">
          <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
            {demoLabels.iconToolbar}
          </h4>
          <div className="flex gap-1 border border-border p-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button aria-label={demoLabels.layerPanel} variant="ghost" size="icon-sm">
                    <IconMap />
                  </Button>
                }
              />
              <TooltipContent>{demoLabels.layerPanel}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button aria-label={demoLabels.zoomToSelection} variant="ghost" size="icon-sm">
                    <IconZoomIn />
                  </Button>
                }
              />
              <TooltipContent>{demoLabels.zoomToSelection}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button aria-label={demoLabels.download} variant="ghost" size="icon-sm">
                    <IconDownload />
                  </Button>
                }
              />
              <TooltipContent>{demoLabels.download}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button aria-label={demoLabels.settings} variant="ghost" size="icon-sm">
                    <IconSettings />
                  </Button>
                }
              />
              <TooltipContent>{demoLabels.settings}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    aria-label={demoLabels.delete}
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <IconTrash />
                  </Button>
                }
              />
              <TooltipContent>{demoLabels.deleteLayerCannotUndo}</TooltipContent>
            </Tooltip>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}

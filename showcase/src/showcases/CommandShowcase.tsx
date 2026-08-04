import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@registry/ui/command"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    commandPalette: "命令面板",
    typeCommand: "输入命令...",
    layers: "图层",
    addPointLayer: "添加点图层",
    addLineLayer: "添加线图层",
    addPolygonLayer: "添加面图层",
    project: "项目",
    saveProject: "保存项目",
    exportToGeojson: "导出为 GeoJSON",
    exportToShapefile: "导出为 Shapefile",
    emptyState: "空状态",
    search: "搜索...",
    noResultsFound: "未找到结果。",
  },
  en: {
    commandPalette: "Command palette",
    typeCommand: "Type a command...",
    layers: "Layers",
    addPointLayer: "Add Point Layer",
    addLineLayer: "Add Line Layer",
    addPolygonLayer: "Add Polygon Layer",
    project: "Project",
    saveProject: "Save Project",
    exportToGeojson: "Export to GeoJSON",
    exportToShapefile: "Export to Shapefile",
    emptyState: "Empty state",
    search: "Search...",
    noResultsFound: "No results found.",
  },
}

export function CommandOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  return (
    <div className="mx-auto grid w-full max-w-md gap-8">
      <section className="space-y-3" data-demo="command-palette">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.commandPalette}
        </h4>
        <div className="h-78 w-full border border-border">
          <Command>
            <CommandInput placeholder={demoLabels.typeCommand} />
            <CommandList>
              <CommandGroup heading={demoLabels.layers}>
                <CommandItem>{demoLabels.addPointLayer}</CommandItem>
                <CommandItem>{demoLabels.addLineLayer}</CommandItem>
                <CommandItem>{demoLabels.addPolygonLayer}</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading={demoLabels.project}>
                <CommandItem>
                  {demoLabels.saveProject}
                  <CommandShortcut>Cmd S</CommandShortcut>
                </CommandItem>
                <CommandItem>{demoLabels.exportToGeojson}</CommandItem>
                <CommandItem disabled>{demoLabels.exportToShapefile}</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </section>
      <section className="space-y-3" data-demo="command-empty-state">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.emptyState}
        </h4>
        <div className="h-32 w-full border border-border">
          <Command>
            <CommandInput placeholder={demoLabels.search} />
            <CommandList>
              <CommandEmpty>{demoLabels.noResultsFound}</CommandEmpty>
            </CommandList>
          </Command>
        </div>
      </section>
    </div>
  )
}

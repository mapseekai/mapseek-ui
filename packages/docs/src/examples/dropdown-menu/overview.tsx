import { Button } from "@registry/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@registry/ui/dropdown-menu"
import { useState } from "react"

export function DropdownMenuOverviewDemo() {
  const [gridVisible, setGridVisible] = useState(true)
  const [format, setFormat] = useState("geojson")
  const [lastAction, setLastAction] = useState("No menu action selected")

  return (
    <div className="grid gap-8" data-demo="dropdown-menu-overview">
      <section className="space-y-3" data-demo="dropdown-menu-basic">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Layer actions
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button data-demo="dropdown-menu-trigger" variant="outline" size="sm">
                Layer actions
              </Button>
            }
          />
          <DropdownMenuContent data-demo="dropdown-menu-content">
            <DropdownMenuItem
              data-demo="dropdown-menu-rename"
              onClick={() => setLastAction("Renamed layer")}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLastAction("Duplicated layer")}>
              Duplicate layer <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Publish service</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={gridVisible}
              data-demo="dropdown-menu-grid"
              onCheckedChange={setGridVisible}
            >
              Show grid overlay
            </DropdownMenuCheckboxItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-demo="dropdown-menu-format-trigger">
                Export format
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent data-demo="dropdown-menu-sub-content">
                <DropdownMenuRadioGroup value={format} onValueChange={setFormat}>
                  <DropdownMenuRadioItem value="geojson">GeoJSON</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="shapefile">Shapefile</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem data-demo="dropdown-menu-format-topojson" value="topojson">
                    TopoJSON
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setLastAction("Delete queued")}>
              Delete layer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="space-y-3" data-demo="dropdown-menu-groups">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Labeled groups and alignment
        </h4>
        <div className="flex flex-wrap gap-3">
          {(["start", "center", "end"] as const).map((align) => (
            <DropdownMenu key={align}>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm">
                    {align}
                  </Button>
                }
              />
              <DropdownMenuContent align={align}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Editing</DropdownMenuLabel>
                  <DropdownMenuItem>Style</DropdownMenuItem>
                  <DropdownMenuItem>Schema</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Delete dataset</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted-foreground" data-demo="dropdown-menu-status">
        {lastAction} · grid {gridVisible ? "visible" : "hidden"} · export {format}
      </p>
    </div>
  )
}

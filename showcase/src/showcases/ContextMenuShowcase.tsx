import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@registry/ui/context-menu"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

export function ContextMenuOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [unit, setUnit] = useState("meters")
  const [lastAction, setLastAction] = useState("No action selected")

  return (
    <div className="grid gap-4">
      <ContextMenu>
        <ContextMenuTrigger
          className="grid h-52 w-full max-w-2xl place-items-center border border-dashed border-border-strong bg-muted px-4 text-center text-sm text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          data-demo="context-menu-trigger"
          role="button"
          tabIndex={0}
        >
          Right click this map layer area
        </ContextMenuTrigger>
        <ContextMenuContent data-demo="context-menu-content">
          <ContextMenuGroup>
            <ContextMenuLabel>Layer actions</ContextMenuLabel>
            <ContextMenuItem
              data-demo="context-menu-duplicate"
              onClick={() => setLastAction("Duplicated layer")}
            >
              Duplicate layer <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setLastAction("Zoomed to layer")}>
              Zoom to layer
            </ContextMenuItem>
            <ContextMenuItem disabled>Publish service</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuCheckboxItem
              checked={snapEnabled}
              data-demo="context-menu-snapping"
              onCheckedChange={setSnapEnabled}
            >
              Enable snapping
            </ContextMenuCheckboxItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger data-demo="context-menu-unit-trigger">
                Measurement unit
              </ContextMenuSubTrigger>
              <ContextMenuSubContent data-demo="context-menu-sub-content">
                <ContextMenuRadioGroup value={unit} onValueChange={setUnit}>
                  <ContextMenuRadioItem value="meters">Meters</ContextMenuRadioItem>
                  <ContextMenuRadioItem data-demo="context-menu-unit-kilometers" value="kilometers">
                    Kilometers
                  </ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={() => setLastAction("Delete requested")}>
            Delete layer
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-xs text-muted-foreground" data-demo="context-menu-status">
        {lastAction} · snapping {snapEnabled ? "on" : "off"} · unit {unit}
      </p>
    </div>
  )
}

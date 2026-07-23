import { IconDots, IconEye, IconEyeOff } from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Tooltip } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import type * as React from "react"
import { LayerRowMenuItems, type RowMenuProps } from "./layer-panel-row-menu"
import type { LayerPanelItemProps } from "./layer-panel-shared"
import { geomIcon, layerDetail, layerTypeBadgeClass, layerTypeLabel } from "./layer-panel-shared"
import { LayerItemContext, useLayerPanelContext } from "./use-layer-panel"

export function LayerRow({
  layer,
  selected,
  groups,
  onDragStart,
  onDrop,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  children,
}: {
  readonly layer: LayerPanelItemProps["layer"]
  readonly selected: boolean
  readonly groups: readonly string[]
  readonly onDragStart: () => void
  readonly onDrop: () => void
  readonly onMoveUp: () => void
  readonly onMoveDown: () => void
  readonly canMoveUp: boolean
  readonly canMoveDown: boolean
  readonly children?: React.ReactNode
}) {
  const ctx = useLayerPanelContext()
  const GeometryIcon = geomIcon(layer.geometryType)
  const badgeLabel = layerTypeLabel(layer)
  const menuProps: RowMenuProps = { layer, groups, onMoveUp, onMoveDown, canMoveUp, canMoveDown }

  return (
    <ContextMenu>
      <ContextMenuTrigger render={<div className="rounded-md border border-border/60 bg-card" />}>
        <div
          draggable
          className={cn(
            "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 transition-colors",
            selected ? "bg-primary/10" : "hover:bg-muted/40",
          )}
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = "move"
            onDragStart()
          }}
          onDragOver={(event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = "move"
          }}
          onDrop={(event) => {
            event.preventDefault()
            onDrop()
          }}
        >
          <button
            type="button"
            aria-label={`选择图层 ${layer.name}`}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-sm text-left"
            onClick={() =>
              ctx.runCallback(() => ctx.onSelectChange(layer.id), "选择图层失败，请重试")
            }
          >
            <GeometryIcon className="size-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <div
                className={cn(
                  "truncate text-sm leading-tight",
                  selected ? "font-semibold text-primary" : "font-medium",
                )}
              >
                {layer.name}
              </div>
              <div className="truncate text-[11px] leading-tight text-muted-foreground">
                {layerDetail(layer)}
              </div>
            </div>
          </button>
          <div className="flex shrink-0 items-center gap-1">
            {selected ? (
              <Badge className="rounded-none px-1.5 text-[11px]">当前</Badge>
            ) : (
              <Badge
                variant="outline"
                className={cn("rounded-none px-1.5 text-[11px]", layerTypeBadgeClass(badgeLabel))}
              >
                {badgeLabel}
              </Badge>
            )}
            <Tooltip content={layer.visible ? "隐藏图层" : "显示图层"} side="top">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="rounded-md"
                aria-label={layer.visible ? `隐藏图层 ${layer.name}` : `显示图层 ${layer.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  ctx.onVisibleChange?.(layer.id, !layer.visible)
                }}
              >
                {layer.visible ? (
                  <IconEye className="size-4 text-primary" />
                ) : (
                  <IconEyeOff className="size-4 text-muted-foreground" />
                )}
              </Button>
            </Tooltip>
            <Tooltip content="更多操作" side="top">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="icon-xs" className="rounded-md" />}
                  aria-label={`图层菜单 ${layer.name}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconDots className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-36 rounded-md"
                  onClick={(event) => event.stopPropagation()}
                >
                  <LayerRowMenuItems menu="dropdown" {...menuProps} />
                </DropdownMenuContent>
              </DropdownMenu>
            </Tooltip>
          </div>
        </div>
      </ContextMenuTrigger>
      {selected && children ? (
        <LayerItemContext.Provider value={layer}>
          <div className="border-t border-border bg-background/80 px-2.5 py-2">{children}</div>
        </LayerItemContext.Provider>
      ) : null}
      <ContextMenuContent className="w-36 rounded-md" onClick={(event) => event.stopPropagation()}>
        <LayerRowMenuItems menu="context" {...menuProps} />
      </ContextMenuContent>
    </ContextMenu>
  )
}

import {
  IconChevronDown,
  IconChevronRight,
  IconDots,
  IconEye,
  IconEyeOff,
  IconFolder,
  IconFolderX,
  IconPencil,
} from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Tooltip } from "@workspace/ui/components/tooltip"
import * as React from "react"
import { LayerPanelGroupRename } from "./layer-panel-group-rename"
import { LayerRow } from "./layer-panel-row"

type GroupMenuItemComponent = React.ComponentType<{
  readonly children?: React.ReactNode
  readonly variant?: "default" | "destructive"
  readonly onClick?: (event: React.MouseEvent) => void
}>

import type { LayerPanelItemProps } from "./layer-panel-shared"
import type { LayerData } from "./types"
import { useLayerPanelContext } from "./use-layer-panel"

export function LayerPanelGroup({
  group,
  members,
  visibleMembers,
  items,
  groupNames,
  onRowDragStart,
  onRowDrop,
  onRowMove,
}: {
  readonly group: string
  readonly members: readonly LayerData[]
  readonly visibleMembers: readonly LayerData[]
  readonly items: ReadonlyMap<string, React.ReactElement<LayerPanelItemProps>>
  readonly groupNames: readonly string[]
  readonly onRowDragStart: (id: string) => void
  readonly onRowDrop: (targetId: string) => void
  readonly onRowMove: (id: string, offset: -1 | 1) => void
}) {
  const ctx = useLayerPanelContext()
  const [collapsed, setCollapsed] = React.useState(false)
  const [renaming, setRenaming] = React.useState(false)

  const allVisible = members.length > 0 && members.every((layer) => layer.visible)

  const openRename = () => {
    setRenaming(true)
  }

  const setGroupVisibility = (visible: boolean) => {
    for (const layer of members) {
      if (layer.visible !== visible) ctx.onVisibleChange?.(layer.id, visible)
    }
  }

  const menuItems = (Item: GroupMenuItemComponent) => (
    <>
      <Item onClick={() => setGroupVisibility(true)}>
        <IconEye />
        全部显示
      </Item>
      <Item onClick={() => setGroupVisibility(false)}>
        <IconEyeOff />
        全部隐藏
      </Item>
      <Item onClick={openRename}>
        <IconPencil />
        重命名
      </Item>
      <Item variant="destructive" onClick={() => ctx.onGroupRemove?.(group)}>
        <IconFolderX />
        删除分组
      </Item>
    </>
  )

  return (
    <div className="mb-2 rounded-md border border-transparent">
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <div className="flex items-center justify-between gap-2 rounded-md px-2.5 py-1 hover:bg-muted/50" />
          }
        >
          {renaming ? (
            <LayerPanelGroupRename group={group} onFinish={() => setRenaming(false)} />
          ) : (
            <button
              type="button"
              aria-label={`切换分组 ${group}`}
              aria-expanded={!collapsed}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
              onClick={() => setCollapsed((current) => !current)}
            >
              {collapsed ? (
                <IconChevronRight className="size-4 text-muted-foreground" />
              ) : (
                <IconChevronDown className="size-4 text-muted-foreground" />
              )}
              <IconFolder className="size-4 text-primary" />
              <span className="truncate text-sm font-semibold leading-tight">{group}</span>
              <Badge
                variant="outline"
                className="rounded-none px-1.5 text-[11px] text-muted-foreground"
              >
                {members.length}
              </Badge>
            </button>
          )}
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <Tooltip content={allVisible ? "隐藏分组" : "显示分组"} side="top">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="rounded-md"
                aria-label={allVisible ? `隐藏分组 ${group}` : `显示分组 ${group}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setGroupVisibility(!allVisible)
                }}
              >
                {allVisible ? (
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
                  aria-label={`分组菜单 ${group}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconDots className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-36 rounded-md"
                  onClick={(event) => event.stopPropagation()}
                >
                  {menuItems(DropdownMenuItem)}
                </DropdownMenuContent>
              </DropdownMenu>
            </Tooltip>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-36 rounded-md">
          {menuItems(ContextMenuItem)}
        </ContextMenuContent>
      </ContextMenu>

      {!collapsed && (
        <div className="mt-1 space-y-1 pl-5">
          {visibleMembers.map((layer, visibleIndex) => {
            const item = items.get(layer.id)
            return (
              <LayerRow
                key={layer.id}
                layer={layer}
                selected={ctx.selectedId === layer.id}
                groups={groupNames}
                onDragStart={() => onRowDragStart(layer.id)}
                onDrop={() => onRowDrop(layer.id)}
                onMoveUp={() => onRowMove(layer.id, -1)}
                onMoveDown={() => onRowMove(layer.id, 1)}
                canMoveUp={visibleIndex > 0}
                canMoveDown={visibleIndex < visibleMembers.length - 1}
              >
                {item?.props.children}
              </LayerRow>
            )
          })}
        </div>
      )}
    </div>
  )
}

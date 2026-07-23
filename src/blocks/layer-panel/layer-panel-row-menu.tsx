import {
  IconArrowDown,
  IconArrowUp,
  IconCrosshair,
  IconFolder,
  IconFolderOff,
  IconFolderSymlink,
  IconTable,
  IconTrash,
} from "@tabler/icons-react"
import {
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@workspace/ui/components/context-menu"
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@workspace/ui/components/dropdown-menu"
import type * as React from "react"
import type { LayerPanelItemProps } from "./layer-panel-shared"
import { useLayerPanelContext } from "./use-layer-panel"

export type RowMenuProps = {
  readonly layer: LayerPanelItemProps["layer"]
  readonly groups: readonly string[]
  readonly onMoveUp: () => void
  readonly onMoveDown: () => void
  readonly canMoveUp: boolean
  readonly canMoveDown: boolean
}

type MenuItemComponent = React.ComponentType<{
  readonly children?: React.ReactNode
  readonly disabled?: boolean
  readonly variant?: "default" | "destructive"
  readonly onClick?: (event: React.MouseEvent) => void
}>

type MenuKit = {
  readonly Item: MenuItemComponent
  readonly Sub: React.ComponentType<{ readonly children?: React.ReactNode }>
  readonly SubTrigger: React.ComponentType<{ readonly children?: React.ReactNode }>
  readonly SubContent: React.ComponentType<{
    readonly children?: React.ReactNode
    readonly className?: string
  }>
}

const CONTEXT_KIT: MenuKit = {
  Item: ContextMenuItem,
  Sub: ContextMenuSub,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
}

const DROPDOWN_KIT: MenuKit = {
  Item: DropdownMenuItem,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
}

export function LayerRowMenuItems({
  menu,
  ...props
}: RowMenuProps & { menu: "context" | "dropdown" }) {
  const { Item, Sub, SubTrigger, SubContent } = menu === "context" ? CONTEXT_KIT : DROPDOWN_KIT
  const ctx = useLayerPanelContext()
  const { layer, groups, onMoveUp, onMoveDown, canMoveUp, canMoveDown } = props
  return (
    <>
      <Item disabled={!canMoveUp} onClick={onMoveUp}>
        <IconArrowUp />
        上移
      </Item>
      <Item disabled={!canMoveDown} onClick={onMoveDown}>
        <IconArrowDown />
        下移
      </Item>
      <Item onClick={() => ctx.runCallback(() => ctx.onLocate?.(layer.id), "定位失败，请重试")}>
        <IconCrosshair />
        定位
      </Item>
      <Item
        onClick={() => ctx.runCallback(() => ctx.onOpenTable?.(layer.id), "打开属性表失败，请重试")}
      >
        <IconTable />
        属性表
      </Item>
      <Sub>
        <SubTrigger>
          <IconFolderSymlink />
          移动到分组
        </SubTrigger>
        <SubContent className="rounded-md">
          {groups.map((group) => (
            <Item
              key={group}
              onClick={() =>
                ctx.onLayerGroupChange?.(layer.id, group === "未分组" ? undefined : group)
              }
            >
              {group === "未分组" ? <IconFolderOff /> : <IconFolder />}
              {group}
            </Item>
          ))}
        </SubContent>
      </Sub>
      <Item
        variant="destructive"
        onClick={() => ctx.runCallback(() => ctx.onRemove?.(layer.id), "删除失败，请重试")}
      >
        <IconTrash />
        删除
      </Item>
    </>
  )
}

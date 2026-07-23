import { IconFolderPlus, IconLayoutSidebar, IconPlus, IconStack2 } from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Tooltip } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import * as React from "react"
import { LayerPanelItem, LayerPanelList } from "./layer-panel-list"
import { LayerPanelEmpty, LayerPanelEmptyIcon, LayerPanelSection } from "./layer-panel-section"
import { runSafeCallback } from "./layer-panel-shared"
import type { LayerPanelProps } from "./types"
import { LayerPanelContext, useLayerPanelContext, useSectionState } from "./use-layer-panel"

function LayerPanelRoot({
  layers,
  groups = [],
  selectedId = null,
  onSelectChange,
  onVisibleChange,
  onReorder,
  onRemove,
  onLocate,
  onOpenTable,
  onAddGroup,
  onAddLayer,
  onLayerGroupChange,
  onGroupRemove,
  onGroupRename,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  children,
}: LayerPanelProps) {
  const sectionState = useSectionState()
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed)
  const [callbackError, setCallbackError] = React.useState<string | null>(null)
  const isControlled = collapsed !== undefined
  const isCollapsed = isControlled ? collapsed : internalCollapsed

  const toggleCollapsed = React.useCallback(() => {
    const next = !isCollapsed
    if (!isControlled) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }, [isCollapsed, isControlled, onCollapsedChange])

  const mountedRef = React.useRef(true)
  const callbackGenerationRef = React.useRef(0)
  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const runCallback = React.useCallback(
    (operation: () => void | PromiseLike<void>, errorMessage: string) => {
      const generation = ++callbackGenerationRef.current
      setCallbackError(null)
      runSafeCallback(operation, () => {
        if (!mountedRef.current || callbackGenerationRef.current !== generation) return
        setCallbackError(errorMessage)
      })
    },
    [],
  )

  const ctx = React.useMemo(
    () => ({
      layers,
      groups,
      selectedId,
      onSelectChange: onSelectChange ?? (() => {}),
      onVisibleChange,
      onReorder,
      onRemove,
      onLocate,
      onOpenTable,
      onAddGroup,
      onAddLayer,
      onLayerGroupChange,
      onGroupRemove,
      onGroupRename,
      ...sectionState,
      collapsed: isCollapsed,
      toggleCollapsed,
      callbackError,
      runCallback,
    }),
    [
      callbackError,
      groups,
      isCollapsed,
      layers,
      onAddGroup,
      onAddLayer,
      onLayerGroupChange,
      onGroupRemove,
      onGroupRename,
      onLocate,
      onOpenTable,
      onRemove,
      onReorder,
      onSelectChange,
      onVisibleChange,
      runCallback,
      sectionState,
      selectedId,
      toggleCollapsed,
    ],
  )

  return (
    <LayerPanelContext.Provider value={ctx}>
      <aside
        data-slot="layer-panel"
        className={cn(
          "flex max-h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-foreground shadow-lg",
          className,
        )}
      >
        {children}
      </aside>
    </LayerPanelContext.Provider>
  )
}

function LayerPanelHeader({ className, children }: React.ComponentProps<"div">) {
  const { collapsed, onAddGroup, onAddLayer, toggleCollapsed } = useLayerPanelContext()
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border px-3 py-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <IconStack2 className="size-4" />
        </div>
        <div className="text-sm font-semibold">图层</div>
      </div>
      <div className="flex items-center gap-1">
        <Tooltip content="新建分组" side="top">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-md"
            aria-label="新建分组"
            onClick={onAddGroup}
          >
            <IconFolderPlus className="size-4" />
          </Button>
        </Tooltip>
        <Tooltip content="添加图层" side="top">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-md"
            aria-label="添加图层"
            onClick={onAddLayer}
          >
            <IconPlus className="size-4" />
          </Button>
        </Tooltip>
        <Tooltip content={collapsed ? "展开图层面板" : "收起图层面板"} side="top">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-md"
            aria-label={collapsed ? "展开图层面板" : "收起图层面板"}
            onClick={toggleCollapsed}
          >
            <IconLayoutSidebar className="size-4" />
          </Button>
        </Tooltip>
        {children}
      </div>
    </div>
  )
}

function LayerPanelTitle({ children, className }: React.ComponentProps<"div">) {
  return <div className={cn("text-base font-semibold", className)}>{children}</div>
}

function LayerPanelCount({ className }: { className?: string }) {
  const { layers } = useLayerPanelContext()
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2 text-[11px] text-muted-foreground", className)}
    >
      {layers.length}
    </Badge>
  )
}

function LayerPanelActions({ className, children }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-1", className)}>{children}</div>
}

function LayerPanelAddButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { onAddLayer } = useLayerPanelContext()
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("rounded-md", className)}
      aria-label="添加图层"
      onClick={(event) => {
        props.onClick?.(event)
        if (!event.defaultPrevented) onAddLayer?.()
      }}
      {...props}
    >
      {props.children ?? <IconPlus className="size-4" />}
    </Button>
  )
}

export const LayerPanel = Object.assign(LayerPanelRoot, {
  Header: LayerPanelHeader,
  Title: LayerPanelTitle,
  Count: LayerPanelCount,
  Actions: LayerPanelActions,
  AddButton: LayerPanelAddButton,
  List: LayerPanelList,
  Item: LayerPanelItem,
  Section: LayerPanelSection,
  Empty: LayerPanelEmpty,
  EmptyIcon: LayerPanelEmptyIcon,
})

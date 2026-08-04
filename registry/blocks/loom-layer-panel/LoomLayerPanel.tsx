import { IconFolderPlus, IconLayoutSidebar, IconPlus, IconSearch, IconStack2 } from "@tabler/icons-react"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LOOM_LAYER_PANEL_LABELS_ZH_CN } from "./labels"
import { LoomLayerGroup } from "./LoomLayerGroup"
import type { LoomLayer, LoomLayerPanelLabels } from "./types"

export type LoomLayerPanelProps = {
  readonly layers: readonly LoomLayer[]
  readonly selectedId?: string
  readonly query: string
  readonly visibleOnly: boolean
  readonly collapsed?: boolean
  readonly collapsedGroups?: ReadonlySet<string>
  readonly labels?: LoomLayerPanelLabels
  readonly className?: string
  readonly onQueryChange: (query: string) => void
  readonly onVisibleOnlyChange: (visibleOnly: boolean) => void
  readonly onSelectLayer: (id: string) => void
  readonly onVisibilityChange: (id: string, visible: boolean) => void
  readonly onGroupCollapsedChange?: (group: string, collapsed: boolean) => void
  readonly onCollapsedChange?: (collapsed: boolean) => void
  readonly onRenameGroup?: (group: string) => void
  readonly onCreateGroup?: () => void
  readonly onAddLayer?: () => void
  readonly onLocateLayer?: (id: string) => void
  readonly onOpenAttributeTable?: (id: string) => void
  readonly onMoreLayerActions?: (id: string) => void
}

export function LoomLayerPanel({
  layers,
  selectedId,
  query,
  visibleOnly,
  collapsed = false,
  collapsedGroups = new Set(),
  labels = LOOM_LAYER_PANEL_LABELS_ZH_CN,
  className,
  onQueryChange,
  onVisibleOnlyChange,
  onSelectLayer,
  onVisibilityChange,
  onGroupCollapsedChange,
  onCollapsedChange,
  onRenameGroup,
  onCreateGroup,
  onAddLayer,
  onLocateLayer,
  onOpenAttributeTable,
  onMoreLayerActions,
}: LoomLayerPanelProps) {
  const filteredLayers = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase()
    return layers.filter(
      (layer) =>
        (!visibleOnly || layer.visible) &&
        (keyword.length === 0 || layer.name.toLocaleLowerCase().includes(keyword)),
    )
  }, [layers, query, visibleOnly])
  const groups = [...new Set(layers.map((layer) => layer.group))]

  if (collapsed) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label={labels.expand}
        onClick={() => onCollapsedChange?.(false)}
      >
        <IconStack2 />
      </Button>
    )
  }

  return (
    <aside
      data-slot="loom-layer-panel"
      className={cn(
        "flex h-[560px] w-80 min-w-0 max-w-full flex-col overflow-hidden border border-border bg-card",
        className,
      )}
    >
      <header className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <IconStack2 className="size-4" />
        </span>
        <span className="text-sm font-semibold">{labels.title}</span>
        <Badge variant="outline">{layers.length}</Badge>
        <span className="flex-1" />
        {onCreateGroup && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label={labels.createGroup}
            onClick={onCreateGroup}
          >
            <IconFolderPlus className="size-4" />
          </Button>
        )}
        {onAddLayer && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label={labels.addLayer}
            onClick={onAddLayer}
          >
            <IconPlus className="size-4" />
          </Button>
        )}
        {onCollapsedChange && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label={labels.collapse}
            onClick={() => onCollapsedChange(true)}
          >
            <IconLayoutSidebar className="size-4" />
          </Button>
        )}
      </header>
      <div className="space-y-2 border-b border-border px-3 py-2.5">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label={labels.search}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="ps-8"
            placeholder={labels.search}
          />
        </div>
        <div className="flex gap-1">
          {([false, true] as const).map((onlyVisible) => (
            <button
              key={String(onlyVisible)}
              type="button"
              aria-pressed={visibleOnly === onlyVisible}
              className={cn(
                "px-2.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                visibleOnly === onlyVisible
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground",
              )}
              onClick={() => onVisibleOnlyChange(onlyVisible)}
            >
              {onlyVisible ? labels.visible : labels.all}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {groups.map((group) => {
          const members = filteredLayers.filter((layer) => layer.group === group)
          if (members.length === 0) return null
          return (
            <LoomLayerGroup
              key={group}
              group={group}
              members={members}
              selectedId={selectedId}
              collapsed={collapsedGroups.has(group)}
              labels={labels}
              onGroupCollapsedChange={onGroupCollapsedChange}
              onRenameGroup={onRenameGroup}
              onSelectLayer={onSelectLayer}
              onVisibilityChange={onVisibilityChange}
              onLocateLayer={onLocateLayer}
              onOpenAttributeTable={onOpenAttributeTable}
              onMoreLayerActions={onMoreLayerActions}
            />
          )
        })}
        {filteredLayers.length === 0 && (
          <p className="py-10 text-center text-xs text-muted-foreground">{labels.empty}</p>
        )}
      </div>
    </aside>
  )
}

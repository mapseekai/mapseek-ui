import {
  IconChevronDown,
  IconChevronRight,
  IconFolder,
  IconLine,
  IconPencil,
  IconPointFilled,
  IconPolygon,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LoomLayerActions } from "./LoomLayerActions"
import type { LoomLayer, LoomLayerGeometry, LoomLayerPanelLabels } from "./types"

const GEOMETRY_ICONS = {
  polygon: IconPolygon,
  polyline: IconLine,
  point: IconPointFilled,
} as const satisfies Readonly<Record<LoomLayerGeometry, typeof IconPolygon>>

type LoomLayerGroupProps = {
  readonly group: string
  readonly members: readonly LoomLayer[]
  readonly selectedId?: string
  readonly collapsed: boolean
  readonly labels: LoomLayerPanelLabels
  readonly onGroupCollapsedChange?: (group: string, collapsed: boolean) => void
  readonly onRenameGroup?: (group: string) => void
  readonly onSelectLayer: (id: string) => void
  readonly onVisibilityChange: (id: string, visible: boolean) => void
  readonly onLocateLayer?: (id: string) => void
  readonly onOpenAttributeTable?: (id: string) => void
  readonly onMoreLayerActions?: (id: string) => void
}

export function LoomLayerGroup({
  group,
  members,
  selectedId,
  collapsed,
  labels,
  onGroupCollapsedChange,
  onRenameGroup,
  onSelectLayer,
  onVisibilityChange,
  onLocateLayer,
  onOpenAttributeTable,
  onMoreLayerActions,
}: LoomLayerGroupProps) {
  return (
    <section className="mb-3">
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-expanded={!collapsed}
          className="flex min-w-0 items-center gap-2 py-1.5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onGroupCollapsedChange?.(group, !collapsed)}
        >
          {collapsed ? (
            <IconChevronRight className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
          )}
          <IconFolder className="size-4 shrink-0 text-primary" />
          <span className="truncate text-xs font-semibold">{group}</span>
          <span className="text-[11px] text-muted-foreground">{members.length}</span>
        </button>
        <span className="flex-1" />
        {onRenameGroup && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            aria-label={labels.renameGroup(group)}
            title={labels.renameGroup(group)}
            onClick={() => onRenameGroup(group)}
          >
            <IconPencil className="size-3.5" />
          </Button>
        )}
      </div>
      {!collapsed && (
        <div className="space-y-1 ps-5">
          {members.map((layer) => {
            const GeometryIcon = GEOMETRY_ICONS[layer.geometry]
            const selected = selectedId === layer.id
            return (
              <div
                key={layer.id}
                className={cn(
                  "flex items-center gap-1 border px-2 py-2",
                  selected ? "border-primary/30 bg-primary/10" : "border-border",
                )}
              >
                <button
                  type="button"
                  aria-label={labels.selectLayer(layer.name)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => onSelectLayer(layer.id)}
                >
                  <GeometryIcon className="size-3.5 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">{layer.name}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {labels.geometry[layer.geometry]} · {labels.featureCount(layer.featureCount)}
                    </span>
                  </span>
                  {selected && <Badge>{labels.current}</Badge>}
                </button>
                <LoomLayerActions
                  layer={layer}
                  labels={labels}
                  selected={selected}
                  onVisibilityChange={onVisibilityChange}
                  onLocateLayer={onLocateLayer}
                  onOpenAttributeTable={onOpenAttributeTable}
                  onMoreLayerActions={onMoreLayerActions}
                />
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

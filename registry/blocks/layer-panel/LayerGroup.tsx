import {
  IconChevronDown,
  IconChevronRight,
  IconEye,
  IconEyeOff,
  IconFolder,
  IconLine,
  IconPencil,
  IconPointFilled,
  IconPolygon,
  IconStack2,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/utils"
import { LayerActions } from "./LayerActions"
import type { LayerData, LayerGeometry, LayerPanelLabels } from "./types"

const GEOMETRY_ICONS = {
  polygon: IconPolygon,
  polyline: IconLine,
  point: IconPointFilled,
  mixed: IconStack2,
  raster: IconStack2,
} as const satisfies Readonly<Record<LayerGeometry, typeof IconPolygon>>

type LayerGroupProps = {
  readonly group: string
  readonly members: readonly LayerData[]
  readonly selectedId?: string
  readonly collapsed: boolean
  readonly labels: LayerPanelLabels
  readonly onGroupCollapsedChange?: (group: string, collapsed: boolean) => void
  readonly onRenameGroup?: (group: string) => void
  readonly onSelectLayer: (id: string) => void
  readonly onVisibilityChange: (id: string, visible: boolean) => void
  readonly onLocateLayer?: (id: string) => void
  readonly onOpenAttributeTable?: (id: string) => void
  readonly onMoreLayerActions?: (id: string) => void
}

export function LayerGroup({
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
}: LayerGroupProps) {
  const allVisible = members.every((layer) => layer.visible)
  const groupVisibilityLabel = allVisible ? labels.hideGroup(group) : labels.showGroup(group)

  return (
    <section className="flex flex-col gap-1">
      <div className="flex items-center gap-1 transition-colors hover:bg-accent/50">
        <Button
          variant="link"
          size="sm"
          type="button"
          aria-expanded={!collapsed}
          className="h-auto min-w-0 justify-start py-1.5 text-start text-foreground hover:no-underline"
          onClick={() => onGroupCollapsedChange?.(group, !collapsed)}
        >
          {collapsed ? (
            <IconChevronRight data-icon="inline-start" className="text-muted-foreground" />
          ) : (
            <IconChevronDown data-icon="inline-start" className="text-muted-foreground" />
          )}
          <IconFolder data-icon="inline-start" className="text-primary" />
          <span className="truncate text-body-md-strong" title={group}>
            {group}
          </span>
          <span className="text-body-sm text-muted-foreground">{members.length}</span>
        </Button>
        <span className="flex-1" />
        <IconButton
          size="xs"
          label={groupVisibilityLabel}
          tooltip={allVisible ? labels.actions.hideGroup : labels.actions.showGroup}
          onClick={() => {
            for (const layer of members) onVisibilityChange(layer.id, !allVisible)
          }}
        >
          {allVisible ? (
            <IconEye className="text-primary" />
          ) : (
            <IconEyeOff className="text-muted-foreground" />
          )}
        </IconButton>
        {onRenameGroup && (
          <IconButton
            size="xs"
            label={labels.renameGroup(group)}
            tooltip={labels.actions.renameGroup}
            onClick={() => onRenameGroup(group)}
          >
            <IconPencil />
          </IconButton>
        )}
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-1 ps-5">
          {members.map((layer) => {
            const GeometryIcon = GEOMETRY_ICONS[layer.geometry]
            const selected = selectedId === layer.id
            const metadata = `${labels.geometry[layer.geometry]} · ${labels.featureCount(layer.featureCount)}`
            return (
              <div
                key={layer.id}
                className={cn(
                  "flex items-center gap-1 border px-2 py-2 transition-colors",
                  selected
                    ? "border-primary/40 bg-selection-bg"
                    : "border-border hover:bg-accent/50",
                )}
              >
                <Button
                  variant="link"
                  size="sm"
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  aria-label={labels.selectLayer(layer.name)}
                  className={cn(
                    "h-auto min-w-0 flex-1 justify-start p-0 text-start hover:no-underline",
                    selected ? "text-primary" : "text-foreground",
                  )}
                  onClick={() => onSelectLayer(layer.id)}
                >
                  <GeometryIcon data-icon="inline-start" className="text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-md-medium" title={layer.name}>
                      {layer.name}
                    </span>
                    <span
                      className="block truncate text-body-sm text-muted-foreground"
                      title={metadata}
                    >
                      {metadata}
                    </span>
                  </span>
                  {selected && <Tag variant="solid">{labels.current}</Tag>}
                </Button>
                <LayerActions
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

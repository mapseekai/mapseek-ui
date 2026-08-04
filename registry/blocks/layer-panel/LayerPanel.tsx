import {
  IconChevronDown,
  IconChevronUp,
  IconCurrentLocation,
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconLine,
  IconMapOff,
  IconPlus,
  IconPointFilled,
  IconPolygon,
  type IconProps,
  IconStack2,
  IconTable,
  IconTrash,
} from "@tabler/icons-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { DEFAULT_LAYER_PANEL_LABELS } from "./defaults"
import type { LayerPanelLabels } from "./labels"
import type { LayerData, LayerGeometry, LayerPanelProps } from "./types"
import {
  LayerItemContext,
  LayerPanelContext,
  useLayerItemContext,
  useLayerPanelContext,
  useSectionState,
} from "./use-layer-panel"

function getGeomLabel(labels: LayerPanelLabels, geometry: LayerGeometry) {
  switch (geometry) {
    case "point":
      return labels.point
    case "polyline":
      return labels.polyline
    case "polygon":
      return labels.polygon
    case "mixed":
      return labels.mixed
    case "raster":
      return labels.raster
  }
}

function GeomIcon({
  type,
  size = 13,
  className,
}: {
  type: LayerGeometry
  size?: number
  className?: string
}) {
  switch (type) {
    case "polygon":
      return <IconPolygon size={size} className={className} />
    case "polyline":
      return <IconLine size={size} className={className} />
    case "point":
      return <IconPointFilled size={size} className={className} />
    default:
      return <IconStack2 size={size} className={className} />
  }
}

function LayerPanelRoot({
  layers,
  selectedId,
  onSelectChange,
  onVisibleChange,
  onReorder,
  onRemove,
  onLocate,
  onOpenTable,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  labels,
  className,
  children,
}: LayerPanelProps) {
  const { isSectionOpen, toggleSection, registerSectionDefault } = useSectionState()
  const resolvedLabels = resolveLabels(DEFAULT_LAYER_PANEL_LABELS, labels)
  const [collapsedUncontrolled, setCollapsedUncontrolled] = React.useState(defaultCollapsed)
  const isControlled = collapsedProp !== undefined
  const collapsed = isControlled ? collapsedProp : collapsedUncontrolled

  const toggleCollapsed = React.useCallback(() => {
    const next = !collapsed
    if (!isControlled) setCollapsedUncontrolled(next)
    onCollapsedChange?.(next)
  }, [collapsed, isControlled, onCollapsedChange])

  const ctx = React.useMemo(
    () => ({
      layers,
      selectedId: selectedId ?? null,
      onSelectChange: onSelectChange ?? (() => {}),
      onVisibleChange,
      onReorder,
      onRemove,
      onLocate,
      onOpenTable,
      isSectionOpen,
      toggleSection,
      registerSectionDefault,
      collapsed,
      toggleCollapsed,
      labels: resolvedLabels,
    }),
    [
      layers,
      selectedId,
      onSelectChange,
      onVisibleChange,
      onReorder,
      onRemove,
      onLocate,
      onOpenTable,
      isSectionOpen,
      toggleSection,
      registerSectionDefault,
      collapsed,
      toggleCollapsed,
      resolvedLabels,
    ],
  )

  return (
    <LayerPanelContext.Provider value={ctx}>
      <aside
        data-slot="layer-panel"
        data-collapsed={collapsed ? "true" : undefined}
        className={cn(
          "relative flex max-h-full flex-col overflow-hidden border border-border bg-card text-[13px]",
          className,
          collapsed && "h-8",
        )}
      >
        {children}
      </aside>
    </LayerPanelContext.Provider>
  )
}

function LayerPanelHeader({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { collapsed, toggleCollapsed } = useLayerPanelContext()
  return (
    <header
      data-slot="layer-panel-header"
      className={cn(
        "relative flex h-8 shrink-0 select-none items-center border-b border-border bg-card hover:bg-muted/40",
        collapsed && "border-b-transparent",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        type="button"
        aria-expanded={!collapsed}
        aria-label="Toggle layer panel"
        onClick={toggleCollapsed}
        className="absolute inset-0 z-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
      />
      <div className="pointer-events-none relative z-10 flex min-w-0 flex-1 items-center gap-1.5 px-3">
        <IconChevronDown
          size={12}
          className="text-muted-foreground transition-transform duration-[180ms]"
          style={{ transform: collapsed ? "rotate(-90deg)" : "none" }}
        />
        <IconStack2 size={13} className="text-muted-foreground" />
        {children}
      </div>
    </header>
  )
}

function LayerPanelTitle({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "text-[11px] font-medium uppercase leading-[14px] tracking-[0.06em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  )
}

function LayerPanelCount({ className }: { className?: string }) {
  const { layers } = useLayerPanelContext()
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center border border-primary/25 bg-primary/10 px-[5px] font-mono text-[10px] font-medium tracking-[0.04em] text-primary",
        className,
      )}
    >
      {layers.length}
    </span>
  )
}

function LayerPanelActions({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <>
      <span className="flex-1" />
      <div
        data-slot="layer-panel-actions"
        className={cn("pointer-events-auto flex items-center gap-1", className)}
      >
        {children}
      </div>
    </>
  )
}

function LayerPanelAddButton({
  onClick,
  className,
  children,
  disabled,
}: {
  onClick?: () => void
  className?: string
  children?: React.ReactNode
  disabled?: boolean
}) {
  const { labels } = useLayerPanelContext()
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={labels.addLayer}
      title={labels.addLayer}
      className={cn(
        "inline-flex h-6 items-center gap-1.5 bg-transparent px-2.5 text-[11px] font-medium leading-none text-foreground hover:bg-muted disabled:opacity-50",
        className,
      )}
    >
      <IconPlus size={13} />
      {children ?? labels.addLayer}
    </Button>
  )
}

function LayerPanelList({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { collapsed } = useLayerPanelContext()
  if (collapsed) return null
  return (
    <div
      data-slot="layer-panel-list"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden pb-2",
        className,
      )}
    >
      {children}
    </div>
  )
}

function LayerPanelItem({
  layer,
  className,
  children,
}: {
  layer: LayerData
  className?: string
  children?: React.ReactNode
}) {
  const ctx = useLayerPanelContext()
  const isSelected = ctx.selectedId === layer.id

  function handleDragStart(e: React.DragEvent<HTMLButtonElement>) {
    e.dataTransfer.setData("text/plain", layer.id)
    e.dataTransfer.effectAllowed = "move"
  }
  function handleDragOver(e: React.DragEvent<HTMLButtonElement>) {
    if (!ctx.onReorder) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }
  function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    if (!ctx.onReorder) return
    e.preventDefault()
    const src = e.dataTransfer.getData("text/plain")
    if (!src || src === layer.id) return
    const ids = ctx.layers.map((l) => l.id)
    const srcIdx = ids.indexOf(src)
    const tgtIdx = ids.indexOf(layer.id)
    if (srcIdx < 0 || tgtIdx < 0) return
    ids.splice(srcIdx, 1)
    ids.splice(tgtIdx, 0, src)
    ctx.onReorder(ids)
  }

  return (
    <LayerItemContext.Provider value={layer}>
      <div
        data-slot="layer-panel-item"
        data-testid="layer-item"
        data-selected={isSelected ? "true" : undefined}
        className={cn(
          "group relative flex select-none items-center gap-2 border-l-2 px-2.5 py-2 transition-colors",
          isSelected
            ? "border-l-primary bg-selection-bg"
            : "border-l-transparent hover:bg-muted/50",
          className,
        )}
      >
        {ctx.onReorder && (
          <IconGripVertical
            size={10}
            className="cursor-grab text-muted-foreground/50 opacity-0 group-hover:opacity-100"
          />
        )}

        <Button
          variant="ghost"
          size="sm"
          type="button"
          draggable={!!ctx.onReorder}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => ctx.onSelectChange(layer.id)}
          className="absolute inset-0 z-0 cursor-pointer border-0 bg-transparent p-0 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
          aria-label={layer.name}
        />

        {ctx.onVisibleChange && (
          <Button
            variant="ghost"
            size="icon-xs"
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              ctx.onVisibleChange?.(layer.id, !layer.visible)
            }}
            aria-label={`Toggle visibility for ${layer.name}`}
            className={cn(
              "shrink-0 hover:text-foreground",
              layer.visible ? "text-primary" : "text-muted-foreground",
            )}
          >
            {layer.visible ? <IconEye size={15} /> : <IconEyeOff size={15} />}
          </Button>
        )}

        <GeomIcon
          type={layer.geometryType}
          size={13}
          className="pointer-events-none shrink-0 text-primary"
        />

        <div className="pointer-events-none min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium leading-tight text-foreground">
            {layer.name}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] leading-tight text-muted-foreground">
            {layer.featureCount != null && (
              <>
                <span className="font-mono tabular-nums">{layer.featureCount}</span>
                <span>{ctx.labels.features}</span>
                <span className="text-muted-foreground/50">·</span>
              </>
            )}
            <span>{getGeomLabel(ctx.labels, layer.geometryType)}</span>
            {layer.crsLabel && (
              <span className="ml-0.5 inline-flex items-center border border-primary/25 bg-primary/10 px-1 font-mono text-[10px] font-medium uppercase tracking-[0.04em] text-primary">
                {layer.crsLabel}
              </span>
            )}
          </div>
        </div>

        <div
          className={cn(
            "relative z-10 flex shrink-0 items-center gap-0.5 transition-opacity",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        >
          {ctx.onLocate && (
            <Button
              variant="ghost"
              size="icon-xs"
              type="button"
              onClick={() => ctx.onLocate?.(layer.id)}
              aria-label={ctx.labels.locate}
              title={ctx.labels.zoomToLayer}
              className="inline-flex size-6 items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground"
            >
              <IconCurrentLocation size={14} />
            </Button>
          )}
          {ctx.onOpenTable && (
            <Button
              variant="ghost"
              size="icon-xs"
              type="button"
              onClick={() => ctx.onOpenTable?.(layer.id)}
              aria-label={ctx.labels.attributeTable}
              title={ctx.labels.attributeTable}
              className="inline-flex size-6 items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground"
            >
              <IconTable size={14} />
            </Button>
          )}
          {ctx.onRemove && (
            <button
              type="button"
              onClick={() => ctx.onRemove?.(layer.id)}
              aria-label={`Remove ${layer.name}`}
              title={ctx.labels.delete}
              className="inline-flex size-6 items-center justify-center text-muted-foreground hover:bg-card hover:text-destructive"
            >
              <IconTrash size={14} />
            </button>
          )}
        </div>
      </div>
      {isSelected && children}
    </LayerItemContext.Provider>
  )
}

function LayerPanelSection({
  id,
  icon: Icon,
  label,
  defaultOpen = true,
  hidden = false,
  className,
  children,
}: {
  id: string
  icon: React.ComponentType<IconProps>
  label: React.ReactNode
  defaultOpen?: boolean
  hidden?: boolean
  className?: string
  children: React.ReactNode
}) {
  const ctx = useLayerPanelContext()
  const layer = useLayerItemContext()

  React.useEffect(() => {
    ctx.registerSectionDefault(layer.id, id, defaultOpen)
  }, [ctx, layer.id, id, defaultOpen])

  if (hidden) return null

  const open = ctx.isSectionOpen(layer.id, id)

  return (
    <div
      data-slot="layer-panel-section"
      data-section-id={id}
      className={cn("relative border-b border-border", className)}
    >
      <span className="pointer-events-none absolute bottom-0 left-[21px] top-0 w-px bg-border" />
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          ctx.toggleSection(layer.id, id)
        }}
        className="relative flex h-7 w-full cursor-pointer select-none items-center gap-1.5 border-0 bg-transparent pl-8 pr-3 text-left"
      >
        <span className="pointer-events-none absolute left-[21px] top-1/2 h-px w-[9px] bg-border" />
        <Icon size={12} className="text-foreground" />
        <span className="flex-1 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.06em] text-foreground">
          {label}
        </span>
        <IconChevronUp
          size={12}
          className="text-muted-foreground transition-transform duration-[180ms]"
          style={{ transform: open ? "none" : "rotate(180deg)" }}
        />
      </Button>
      <div
        style={{
          maxHeight: open ? 2000 : 0,
          overflow: "hidden",
          transition: "max-height 180ms",
        }}
      >
        <div className="py-1 pb-3 pl-8 pr-3 pt-1">{children}</div>
      </div>
    </div>
  )
}

function LayerPanelEmpty({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { layers, collapsed } = useLayerPanelContext()
  if (collapsed || layers.length > 0) return null
  return (
    <div
      data-slot="layer-panel-empty"
      className={cn(
        "absolute inset-x-0 bottom-0 top-8 flex flex-col items-center justify-center gap-2.5 px-3 text-center",
        className,
      )}
    >
      {children}
    </div>
  )
}

function LayerPanelEmptyIcon({ className }: { className?: string }) {
  return (
    <IconMapOff size={28} className={cn("text-muted-foreground", className)} strokeWidth={1.5} />
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

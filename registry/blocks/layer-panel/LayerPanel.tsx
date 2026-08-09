import {
  IconFolderPlus,
  IconLayoutSidebar,
  IconPlus,
  IconSearch,
  IconStack2,
} from "@tabler/icons-react"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { IconButton } from "@/components/ui/icon-button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Tag } from "@/components/ui/tag"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { LayerGroup } from "./LayerGroup"
import { LAYER_PANEL_LABELS_ZH_CN } from "./labels"
import type { LayerData, LayerPanelLabels } from "./types"

const selectedToggleClass =
  "aria-pressed:border-primary/40 aria-pressed:bg-selection-bg aria-pressed:text-primary aria-pressed:hover:bg-selection-bg aria-pressed:hover:text-primary data-[state=on]:border-primary/40 data-[state=on]:bg-selection-bg data-[state=on]:text-primary data-[state=on]:hover:bg-selection-bg data-[state=on]:hover:text-primary"

export type LayerPanelProps = {
  readonly layers: readonly LayerData[]
  readonly selectedId?: string
  readonly query: string
  readonly visibleOnly: boolean
  readonly collapsed?: boolean
  readonly collapsedGroups?: ReadonlySet<string>
  readonly labels?: LayerPanelLabels
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

export function LayerPanel({
  layers,
  selectedId,
  query,
  visibleOnly,
  collapsed = false,
  collapsedGroups = new Set(),
  labels = LAYER_PANEL_LABELS_ZH_CN,
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
}: LayerPanelProps) {
  const filteredLayers = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase()
    return layers.filter(
      (layer) =>
        (!visibleOnly || layer.visible) &&
        (keyword.length === 0 || layer.name.toLocaleLowerCase().includes(keyword)),
    )
  }, [layers, query, visibleOnly])
  const groups = [...new Set(filteredLayers.map((layer) => layer.group))]

  if (collapsed) {
    return (
      <aside data-slot="layer-panel" data-collapsed="true" className="inline-flex">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label={labels.expand}
                onClick={() => onCollapsedChange?.(false)}
              />
            }
          >
            <IconStack2 data-icon="inline-start" />
          </TooltipTrigger>
          <TooltipContent>{labels.expand}</TooltipContent>
        </Tooltip>
      </aside>
    )
  }

  return (
    <aside
      data-slot="layer-panel"
      className={cn(
        "flex h-[560px] w-80 min-w-0 max-w-full flex-col overflow-hidden border border-border bg-card text-body-md",
        className,
      )}
    >
      <header className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="flex size-7 items-center justify-center border border-border text-foreground">
          <IconStack2 className="size-4" />
        </span>
        <h2 className="text-headline-sm">{labels.title}</h2>
        <Tag size="sm">{layers.length}</Tag>
        <span className="flex-1" />
        {onCreateGroup && (
          <IconButton size="sm" label={labels.createGroup} tooltip onClick={onCreateGroup}>
            <IconFolderPlus />
          </IconButton>
        )}
        {onAddLayer && (
          <IconButton size="sm" label={labels.addLayer} tooltip onClick={onAddLayer}>
            <IconPlus />
          </IconButton>
        )}
        {onCollapsedChange && (
          <IconButton
            size="sm"
            label={labels.collapse}
            tooltip
            onClick={() => onCollapsedChange(true)}
          >
            <IconLayoutSidebar />
          </IconButton>
        )}
      </header>
      <div className="flex flex-col gap-2 border-b border-border px-3 py-2.5">
        <InputGroup>
          <InputGroupInput
            aria-label={labels.search}
            autoComplete="off"
            name="layer-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={labels.search}
          />
          <Tooltip>
            <TooltipTrigger render={<InputGroupAddon aria-label={labels.search} />}>
              <IconSearch aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>{labels.search}</TooltipContent>
          </Tooltip>
        </InputGroup>
        <ToggleGroup
          aria-label={labels.title}
          value={[String(visibleOnly)]}
          onValueChange={([value]) => {
            if (value) onVisibleOnlyChange(value === "true")
          }}
          variant="outline"
          size="sm"
          spacing={1}
        >
          {([false, true] as const).map((onlyVisible) => (
            <ToggleGroupItem
              key={String(onlyVisible)}
              value={String(onlyVisible)}
              className={selectedToggleClass}
            >
              {onlyVisible ? labels.visible : labels.all}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        {groups.map((group) => (
          <LayerGroup
            key={group}
            group={group}
            members={filteredLayers.filter((layer) => layer.group === group)}
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
        ))}
        {filteredLayers.length === 0 && (
          <Empty className="min-h-40 border-0 p-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconStack2 />
              </EmptyMedia>
              <EmptyTitle>{labels.empty}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </aside>
  )
}

import {
  IconCurrentLocation,
  IconDotsVertical,
  IconEye,
  IconEyeOff,
  IconTable,
} from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconButton } from "@/components/ui/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { LayerData, LayerPanelLabels } from "./types"

type LayerActionsProps = {
  readonly layer: LayerData
  readonly labels: LayerPanelLabels
  readonly selected: boolean
  readonly onVisibilityChange: (id: string, visible: boolean) => void
  readonly onLocateLayer?: (id: string) => void
  readonly onOpenAttributeTable?: (id: string) => void
  readonly onMoreLayerActions?: (id: string) => void
}

export function LayerActions({
  layer,
  labels,
  selected,
  onVisibilityChange,
  onLocateLayer,
  onOpenAttributeTable,
  onMoreLayerActions,
}: LayerActionsProps) {
  const menuAriaLabel = labels.moreLayerActions(layer.name)
  const showOverflowMenu = selected && Boolean(onOpenAttributeTable || onMoreLayerActions)

  return (
    <>
      {selected && onLocateLayer && (
        <IconButton
          size="xs"
          label={labels.locateLayer(layer.name)}
          tooltip={labels.actions.locateLayer}
          onClick={() => onLocateLayer(layer.id)}
        >
          <IconCurrentLocation />
        </IconButton>
      )}
      <IconButton
        size="xs"
        label={layer.visible ? labels.hideLayer(layer.name) : labels.showLayer(layer.name)}
        tooltip={layer.visible ? labels.actions.hideLayer : labels.actions.showLayer}
        onClick={() => onVisibilityChange(layer.id, !layer.visible)}
      >
        {layer.visible ? (
          <IconEye className="text-primary" />
        ) : (
          <IconEyeOff className="text-muted-foreground" />
        )}
      </IconButton>
      {showOverflowMenu && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <DropdownMenuTrigger render={<IconButton size="xs" label={menuAriaLabel} />}>
                <IconDotsVertical />
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>{labels.actions.moreLayerActions}</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {onOpenAttributeTable && (
                <DropdownMenuItem onClick={() => onOpenAttributeTable(layer.id)}>
                  <IconTable />
                  {labels.actions.openAttributeTable}
                </DropdownMenuItem>
              )}
              {onMoreLayerActions && (
                <DropdownMenuItem onClick={() => onMoreLayerActions(layer.id)}>
                  <IconDotsVertical />
                  {labels.actions.moreLayerActions}
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

import {
  IconCurrentLocation,
  IconDotsVertical,
  IconEye,
  IconEyeOff,
  IconTable,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import type { LoomLayer, LoomLayerPanelLabels } from "./types"

type LoomLayerActionsProps = {
  readonly layer: LoomLayer
  readonly labels: LoomLayerPanelLabels
  readonly selected: boolean
  readonly onVisibilityChange: (id: string, visible: boolean) => void
  readonly onLocateLayer?: (id: string) => void
  readonly onOpenAttributeTable?: (id: string) => void
  readonly onMoreLayerActions?: (id: string) => void
}

export function LoomLayerActions({
  layer,
  labels,
  selected,
  onVisibilityChange,
  onLocateLayer,
  onOpenAttributeTable,
  onMoreLayerActions,
}: LoomLayerActionsProps) {
  return (
    <>
      {selected && onLocateLayer && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0"
          aria-label={labels.locateLayer(layer.name)}
          title={labels.locateLayer(layer.name)}
          onClick={() => onLocateLayer(layer.id)}
        >
          <IconCurrentLocation />
        </Button>
      )}
      {selected && onOpenAttributeTable && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0"
          aria-label={labels.openAttributeTable(layer.name)}
          title={labels.openAttributeTable(layer.name)}
          onClick={() => onOpenAttributeTable(layer.id)}
        >
          <IconTable />
        </Button>
      )}
      {selected && onMoreLayerActions && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0"
          aria-label={labels.moreLayerActions(layer.name)}
          title={labels.moreLayerActions(layer.name)}
          onClick={() => onMoreLayerActions(layer.id)}
        >
          <IconDotsVertical />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="size-6 shrink-0"
        aria-label={layer.visible ? labels.hideLayer(layer.name) : labels.showLayer(layer.name)}
        title={layer.visible ? labels.hideLayer(layer.name) : labels.showLayer(layer.name)}
        onClick={() => onVisibilityChange(layer.id, !layer.visible)}
      >
        {layer.visible ? (
          <IconEye className="text-primary" />
        ) : (
          <IconEyeOff className="text-muted-foreground" />
        )}
      </Button>
    </>
  )
}

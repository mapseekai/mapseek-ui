import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconDeviceFloppy,
  IconMagnet,
  IconPencil,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LOOM_TOOLBAR_LABELS_ZH_CN } from "./labels"
import type { LoomToolbarGroup, LoomToolbarLabels } from "./types"

export type LoomToolbarProps = {
  readonly groups: readonly LoomToolbarGroup[]
  readonly activeMode: string
  readonly activeLayerName: string
  readonly editing: boolean
  readonly dirty: boolean
  readonly snapping: boolean
  readonly canUndo: boolean
  readonly canRedo: boolean
  readonly labels?: LoomToolbarLabels
  readonly className?: string
  readonly onEditingChange: (editing: boolean) => void
  readonly onModeChange: (mode: string) => void
  readonly onSnappingChange: (snapping: boolean) => void
  readonly onSave: () => void
  readonly onUndo: () => void
  readonly onRedo: () => void
}

function Separator() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-border" />
}

export function LoomToolbar({
  groups,
  activeMode,
  activeLayerName,
  editing,
  dirty,
  snapping,
  canUndo,
  canRedo,
  labels = LOOM_TOOLBAR_LABELS_ZH_CN,
  className,
  onEditingChange,
  onModeChange,
  onSnappingChange,
  onSave,
  onUndo,
  onRedo,
}: LoomToolbarProps) {
  const activeTool = groups.flatMap((group) => group.tools).find((tool) => tool.id === activeMode)

  return (
    <div
      data-slot="loom-toolbar"
      className={cn(
        "relative min-h-[500px] w-full overflow-hidden border border-border bg-muted/40",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute start-[8%] top-[36%] h-36 w-[46%] border-2 border-primary/45 bg-primary/10 [clip-path:polygon(8%_14%,78%_0,100%_56%,68%_100%,0_82%)]" />

      <div className="absolute inset-x-3 top-4 flex justify-center">
        <div className="max-w-full overflow-x-auto border border-border bg-card">
          <div className="flex h-11 min-w-max items-center gap-1 px-1.5">
            <Button
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-body-md-medium"
              onClick={() => onEditingChange(!editing)}
            >
              <IconPencil data-icon="inline-start" />
              {editing ? labels.stopEditing : labels.startEditing}
            </Button>

            {editing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!dirty}
                  className="h-7 gap-1.5 px-2 text-body-md-medium"
                  onClick={onSave}
                >
                  <IconDeviceFloppy data-icon="inline-start" />
                  {labels.save}
                </Button>
                <Badge variant="outline">{labels.currentLayer(activeLayerName)}</Badge>
              </>
            )}

            <Separator />
            {groups.map((group, groupIndex) => (
              <fieldset
                key={group.label}
                className="flex min-w-0 items-center gap-0.5 border-0 p-0"
                aria-label={group.label}
              >
                {groupIndex > 0 && <Separator />}
                {group.tools.map((tool) => {
                  const ToolIcon = tool.icon
                  const active = activeMode === tool.id
                  const disabled = Boolean(tool.editOnly && !editing)
                  const title = disabled
                    ? labels.editRequired(tool.label)
                    : [tool.label, tool.shortcut].filter(Boolean).join(" · ")
                  return (
                    <Button
                      key={tool.id}
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={tool.label}
                      aria-pressed={active}
                      title={title}
                      disabled={disabled}
                      className={cn(
                        "size-8",
                        active &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                      )}
                      onClick={() => onModeChange(tool.id)}
                    >
                      <ToolIcon />
                    </Button>
                  )
                })}
              </fieldset>
            ))}

            <Separator />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={snapping ? labels.disableSnapping : labels.enableSnapping}
              aria-pressed={snapping}
              title={labels.snappingStatus(snapping)}
              className={cn(
                "size-8",
                snapping &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
              )}
              onClick={() => onSnappingChange(!snapping)}
            >
              <IconMagnet />
            </Button>

            <Separator />
            <Button
              variant="ghost"
              size="icon"
              aria-label={labels.undo}
              title={labels.undo}
              disabled={!canUndo}
              className="size-8"
              onClick={onUndo}
            >
              <IconArrowBackUp />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={labels.redo}
              title={labels.redo}
              disabled={!canRedo}
              className="size-8"
              onClick={onRedo}
            >
              <IconArrowForwardUp />
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 end-4 flex items-center gap-2 border border-border bg-card/95 px-3 py-2 text-body-md">
        <span className="text-muted-foreground">{labels.currentMode}</span>
        <Badge>{activeTool?.label ?? activeMode}</Badge>
        {dirty && <span className="text-warning">{labels.unsaved}</span>}
      </div>
    </div>
  )
}

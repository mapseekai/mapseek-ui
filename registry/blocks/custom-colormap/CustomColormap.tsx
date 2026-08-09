import { Button } from "@/components/ui/button"
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  buildColormapGradient,
  type ColormapPreset,
  CustomColormapEditor,
  type CustomColormap as CustomColormapValue,
  DEFAULT_COLORMAP_PRESETS,
} from "../raster-style-panel"
import { CUSTOM_COLORMAP_LABELS_ZH_CN, type CustomColormapDialogLabels } from "./labels"

export type CustomColormapProps = {
  readonly value: CustomColormapValue
  readonly draft: CustomColormapValue
  readonly open: boolean
  readonly labels?: CustomColormapDialogLabels
  readonly presets?: ColormapPreset[]
  readonly className?: string
  readonly showTrigger?: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onDraftChange: (value: CustomColormapValue) => void
  readonly onApply: (value: CustomColormapValue) => void
}

export function CustomColormap({
  value,
  draft,
  open,
  labels = CUSTOM_COLORMAP_LABELS_ZH_CN,
  presets,
  className,
  showTrigger = true,
  onOpenChange,
  onDraftChange,
  onApply,
}: CustomColormapProps) {
  const editorPresets =
    presets ??
    DEFAULT_COLORMAP_PRESETS.map((preset) => ({
      ...preset,
      name: labels.presetNames?.[preset.id] ?? preset.name,
    }))

  return (
    <div data-slot="custom-colormap" className={cn("flex flex-col gap-4", className)}>
      {showTrigger ? (
        <div className="flex flex-wrap items-center gap-3">
          <span
            data-slot="custom-colormap-preview"
            aria-hidden="true"
            className="h-6 min-w-40 flex-1 border border-border sm:max-w-64"
            style={{ background: buildColormapGradient(value) }}
          />
          <span className="font-mono text-body-sm text-muted-foreground">
            {labels.summary(value.stops.length, value.interpolation, value.colorSpace)}
          </span>
          <Button size="sm" onClick={() => onOpenChange(true)}>
            {labels.edit}
          </Button>
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          width={460}
          title={labels.title}
          description={labels.description}
          closeLabel={labels.close}
        >
          <DialogBody>
            <CustomColormapEditor
              value={draft}
              presets={editorPresets}
              onChange={onDraftChange}
              labels={labels.editor}
            />
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              {labels.cancel}
            </Button>
            <Button size="sm" onClick={() => onApply(draft)}>
              {labels.apply}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

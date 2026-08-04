import { Button } from "@/components/ui/button"
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  buildColormapGradient,
  CustomColormapEditor,
  type CustomColormap as CustomColormapValue,
} from "../raster-style-panel"
import { CUSTOM_COLORMAP_LABELS_ZH_CN, type CustomColormapDialogLabels } from "./labels"

export type CustomColormapProps = {
  readonly value: CustomColormapValue
  readonly draft: CustomColormapValue
  readonly open: boolean
  readonly labels?: CustomColormapDialogLabels
  readonly className?: string
  readonly onOpenChange: (open: boolean) => void
  readonly onDraftChange: (value: CustomColormapValue) => void
  readonly onApply: (value: CustomColormapValue) => void
}

export function CustomColormap({
  value,
  draft,
  open,
  labels = CUSTOM_COLORMAP_LABELS_ZH_CN,
  className,
  onOpenChange,
  onDraftChange,
  onApply,
}: CustomColormapProps) {
  return (
    <div data-slot="custom-colormap" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="h-6 min-w-40 flex-1 sm:max-w-64"
          style={{ background: buildColormapGradient(value) }}
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          {labels.summary(value.stops.length, value.interpolation, value.colorSpace)}
        </span>
        <Button size="sm" onClick={() => onOpenChange(true)}>
          {labels.edit}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent width={460} title={labels.title} description={labels.description}>
          <DialogBody>
            <CustomColormapEditor value={draft} onChange={onDraftChange} labels={labels.editor} />
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

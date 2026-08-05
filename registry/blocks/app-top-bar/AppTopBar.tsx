import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { AppTopBarProps } from "./types"

/**
 * Application top bar: back + brand slot + document name + status slot +
 * primary Save action, with before/after/end action slots. Pure layout
 * chrome — no engine, no i18n. See BLOCKS-EXTRACTION.md § AppTopBar.
 */
export function AppTopBar({
  brand,
  projectName,
  status,
  onBack,
  onSave,
  saveDisabled,
  savePending,
  centerActions,
  beforeSaveActions,
  afterSaveActions,
  endActions,
  labels,
  className,
}: AppTopBarProps) {
  return (
    <header
      className={cn(
        "relative z-20 grid min-h-10 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1 overflow-hidden border-b border-border bg-card px-2 py-1 md:h-10 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-2 md:px-3 md:py-0",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2 overflow-hidden">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label={labels.back}
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="-ml-1 size-6 rounded-none text-muted-foreground hover:text-foreground"
              >
                <IconArrowLeft />
              </Button>
            }
          />
          <TooltipContent side="bottom">{labels.backTooltip ?? labels.back}</TooltipContent>
        </Tooltip>

        {brand}
        {brand && <span className="mx-0.5 h-3.5 w-px bg-border" />}

        <span className="truncate text-[13px] leading-none font-semibold text-foreground">
          {projectName}
        </span>

        {status}
      </div>

      <div className="flex min-w-0 items-center justify-center">{centerActions}</div>

      <div className="col-span-2 flex min-w-0 items-center justify-end gap-2 md:col-auto">
        {beforeSaveActions}

        {onSave && (
          <Button
            size="sm"
            aria-label={labels.save}
            disabled={saveDisabled || savePending}
            aria-busy={savePending || undefined}
            onClick={() => void onSave()}
            className="m-0 gap-1.5 rounded-none border-primary bg-primary text-[11px] font-medium text-primary-foreground hover:bg-primary/90"
          >
            <IconDeviceFloppy data-icon="inline-start" /> {labels.save}
          </Button>
        )}

        {afterSaveActions}
        {endActions}
      </div>
    </header>
  )
}

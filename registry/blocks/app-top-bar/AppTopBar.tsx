import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { AppTopBarProps, AppTopBarSize } from "./types"

const appTopBarSizeConfig = {
  xs: {
    headerClassName: "md:h-8",
    toolbarClassName: "min-h-6 md:h-6",
    backButtonSize: "icon-xs",
    saveButtonSize: "xs",
  },
  sm: {
    headerClassName: "md:h-9",
    toolbarClassName: "min-h-7 md:h-7",
    backButtonSize: "icon-sm",
    saveButtonSize: "sm",
  },
  default: {
    headerClassName: "md:h-12",
    toolbarClassName: "min-h-10 md:h-10",
    backButtonSize: "icon",
    saveButtonSize: "default",
  },
  lg: {
    headerClassName: "md:h-14",
    toolbarClassName: "min-h-12 md:h-12",
    backButtonSize: "icon-lg",
    saveButtonSize: "lg",
  },
} as const satisfies Record<
  AppTopBarSize,
  {
    headerClassName: string
    toolbarClassName: string
    backButtonSize: "icon-xs" | "icon-sm" | "icon" | "icon-lg"
    saveButtonSize: "xs" | "sm" | "default" | "lg"
  }
>

/**
 * Application top bar: back + brand slot + document name + status slot +
 * primary Save action, with before/after/end action slots. Pure layout
 * chrome — no engine, no i18n. See BLOCKS-EXTRACTION.md § AppTopBar.
 */
export function AppTopBar({
  size = "default",
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
  const sizeConfig = appTopBarSizeConfig[size]
  const toolbarLayoutClassName = centerActions
    ? "md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-2"
    : "md:flex-nowrap md:gap-2"

  return (
    <header
      className={cn(
        "relative z-20 shrink-0 bg-card py-1 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border after:content-['']",
        sizeConfig.headerClassName,
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 overflow-hidden px-2 md:px-3",
          toolbarLayoutClassName,
          sizeConfig.toolbarClassName,
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-center gap-1",
            centerActions && "md:col-start-1 md:gap-2",
          )}
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label={labels.back}
                  variant="ghost"
                  size={sizeConfig.backButtonSize}
                  onClick={onBack}
                  className="-ml-1 rounded-none text-muted-foreground hover:text-foreground"
                >
                  <IconArrowLeft />
                </Button>
              }
            />
            <TooltipContent side="bottom">{labels.backTooltip ?? labels.back}</TooltipContent>
          </Tooltip>

          {brand && (
            <span
              className={cn(
                "inline-flex shrink-0 items-center",
                centerActions && "md:hidden lg:inline-flex",
              )}
            >
              {brand}
            </span>
          )}
          {brand && (
            <span
              className={cn(
                "mx-0.5 h-3.5 w-px shrink-0 bg-border",
                centerActions && "md:hidden lg:block",
              )}
            />
          )}

          <span className="min-w-0 truncate text-body-lg-medium leading-none text-foreground">
            {projectName}
          </span>

          {status && (
            <span className={cn("shrink-0", centerActions && "md:hidden lg:inline-flex")}>
              {status}
            </span>
          )}
        </div>

        {centerActions && (
          <div className="mx-auto flex min-w-0 items-center justify-center md:col-start-2 md:mx-0">
            {centerActions}
          </div>
        )}

        <div
          className={cn(
            "flex min-w-0 basis-full items-center justify-end gap-2 md:basis-auto",
            centerActions ? "md:col-start-3 md:justify-self-end" : "md:ml-auto",
          )}
        >
          {beforeSaveActions}

          {onSave && (
            <Button
              size={sizeConfig.saveButtonSize}
              aria-label={labels.save}
              disabled={saveDisabled || savePending}
              aria-busy={savePending || undefined}
              onClick={() => void onSave()}
              className="m-0 rounded-none border-primary bg-primary text-body-md-medium text-primary-foreground hover:bg-primary/90"
            >
              <IconDeviceFloppy data-icon="inline-start" /> {labels.save}
            </Button>
          )}

          {afterSaveActions}
          {endActions}
        </div>
      </div>
    </header>
  )
}

import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react"
import { Button } from "../../components/button"
import { Tooltip } from "../../components/tooltip"
import { cn } from "../../lib/utils"
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
  beforeSaveActions,
  afterSaveActions,
  endActions,
  labels,
  className,
}: AppTopBarProps) {
  return (
    <header
      className={cn(
        "relative z-20 flex h-10 shrink-0 items-center gap-2 border-b border-border bg-card px-3",
        className,
      )}
    >
      <Tooltip content={labels.backTooltip ?? labels.back} side="bottom">
        <Button
          aria-label={labels.back}
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="-ml-1 size-6 rounded-none text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={16} />
        </Button>
      </Tooltip>

      {brand}
      {brand && <span className="mx-0.5 h-3.5 w-px bg-border" />}

      <span className="text-[13px] leading-none font-semibold text-foreground">{projectName}</span>

      {status}

      <span className="flex-1" />

      {beforeSaveActions}

      <Button
        aria-label={labels.save}
        onClick={() => void onSave()}
        className="h-[26px] gap-1.5 rounded-none bg-primary px-2.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90"
      >
        <IconDeviceFloppy size={13} /> {labels.save}
      </Button>

      {afterSaveActions}
      {endActions}
    </header>
  )
}

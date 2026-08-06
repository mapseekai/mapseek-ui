import { IconChevronDown, IconDatabase, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { formatBytes } from "./format-bytes"
import type { StorageMeterProps } from "./types"

/**
 * Inline storage-usage chip + breakdown popover. Pure view — data, labels and
 * the isolation footer are injected. See BLOCKS-EXTRACTION.md § StorageMeter.
 *
 * Collapsed (default): tiny button — icon + used/quota + mini progress bar.
 * Click → opens a Popover with per-bucket breakdown and an app-supplied footer.
 */
export function StorageMeter({
  data,
  loading,
  error,
  errorLabel,
  onRefresh,
  labels,
  footer,
  className,
}: StorageMeterProps) {
  if (data.unsupported) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <span className="inline-flex h-6 items-center gap-1 border border-dashed border-border px-2 font-sans text-[11px] leading-none text-muted-foreground">
              <IconDatabase size={11} /> {labels.unsupported}
            </span>
          }
        />
        <TooltipContent>{labels.unsupportedHint}</TooltipContent>
      </Tooltip>
    )
  }

  const pct = Math.round(data.ratio * 100)
  const det = data.details
  const barColor = pct >= 95 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-primary"

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            aria-label={`${labels.used} ${formatBytes(data.usage)} / ${formatBytes(data.quota)} (${pct}%)`}
            className={cn(
              "inline-flex h-6 cursor-pointer items-center gap-1.5 rounded-none border-border bg-background px-2 font-sans text-[11px] leading-none text-foreground hover:bg-accent/50 aria-expanded:border-primary aria-expanded:bg-selection-bg aria-expanded:text-primary aria-expanded:hover:bg-selection-bg aria-expanded:hover:text-primary aria-expanded:[&_span]:text-primary aria-expanded:[&_strong]:text-primary aria-expanded:[&_svg]:text-primary",
              className,
            )}
          >
            <IconDatabase data-icon="inline-start" className="text-muted-foreground" />
            <span className="inline-flex items-baseline gap-[3px] whitespace-nowrap font-mono text-[11px] tabular-nums">
              <strong className="font-semibold text-foreground">{formatBytes(data.usage)}</strong>
              <span className="text-muted-foreground">/</span>
              <span>{formatBytes(data.quota)}</span>
            </span>
            <Progress
              aria-hidden
              value={pct}
              className="w-14 gap-0"
              indicatorClassName={cn("transition-[width] duration-200", barColor)}
            />
            <IconChevronDown data-icon="inline-end" className="text-muted-foreground" />
          </Button>
        }
      />
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={6}
        aria-label={labels.details}
        className="w-auto min-w-[300px] max-w-[360px] gap-0 p-3 font-sans text-xs leading-snug text-foreground shadow-none"
      >
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
          <IconDatabase size={12} />
          <span>{labels.title}</span>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={onRefresh}
                  disabled={loading}
                  aria-label={labels.refresh}
                  className="ml-auto text-muted-foreground hover:text-foreground disabled:cursor-progress disabled:opacity-40"
                >
                  <IconRefresh />
                </Button>
              }
            />
            <TooltipContent>{labels.refresh}</TooltipContent>
          </Tooltip>
        </div>

        <div className="mb-2 grid grid-cols-4 gap-1.5">
          {[
            [labels.used, formatBytes(data.usage)],
            [labels.available, formatBytes(data.available)],
            [labels.quota, formatBytes(data.quota)],
            [labels.usageRate, `${pct}%`],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-[0.04em] text-muted-foreground">
                {label}
              </span>
              <b className="font-mono text-xs font-semibold tabular-nums text-foreground">
                {value}
              </b>
            </div>
          ))}
        </div>

        <Progress
          value={pct}
          className="mb-2 gap-0"
          indicatorClassName={cn("transition-[width] duration-200", barColor)}
        />

        {(det.fileSystem != null || det.indexedDB != null || det.caches != null) && (
          <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
            {det.fileSystem != null && (
              <span>
                <em className="not-italic mr-1 font-medium text-foreground">OPFS</em>
                {formatBytes(det.fileSystem)}
              </span>
            )}
            {det.indexedDB != null && (
              <span>
                <em className="not-italic mr-1 font-medium text-foreground">IndexedDB</em>
                {formatBytes(det.indexedDB)}
              </span>
            )}
            {det.caches != null && det.caches > 0 && (
              <span>
                <em className="not-italic mr-1 font-medium text-foreground">Caches</em>
                {formatBytes(det.caches)}
              </span>
            )}
          </div>
        )}

        {footer}

        {error && (
          <p className="mt-1.5 text-[11px] text-destructive">
            {errorLabel ? errorLabel(error) : error}
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}

import {
  IconChevronLeft,
  IconChevronRight,
  IconColorPicker,
  IconCopy,
  IconLock,
  IconX,
} from "@tabler/icons-react"
import { IconButton } from "../../components/icon-button"
import { Tooltip } from "../../components/tooltip"
import { cn } from "../../lib/utils"
import type { PixelField, PixelProbeProps } from "./types"

function FieldRow({ field }: { field: PixelField }) {
  const isBadge = field.type === "ENUM"
  return (
    <div className="flex flex-col gap-[3px]">
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-muted-foreground">
          {field.key}
        </span>
        <span className="border border-border bg-muted px-1 py-px font-mono text-[9px] uppercase tracking-[0.04em] text-muted-foreground">
          {field.type}
        </span>
        {field.locked && <IconLock size={11} className="ml-auto text-muted-foreground" />}
      </div>
      <div
        className={cn(
          "flex h-7 items-center border border-border bg-muted px-2 text-xs text-foreground select-text",
          !isBadge && "font-mono tabular-nums",
        )}
      >
        {isBadge ? (
          <span className="inline-flex h-[18px] items-center border border-border bg-card px-1.5 font-mono text-[10px] tracking-[0.04em] text-muted-foreground">
            {field.value}
          </span>
        ) : (
          field.value
        )}
        {field.unit && (
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">{field.unit}</span>
        )}
      </div>
    </div>
  )
}

/**
 * Read-only raster pixel readout (TiTiler /point). Header + lock-marked
 * field rows + optional pixel prev/next footer. Position via `className`.
 */
export function PixelProbe({
  fields,
  count,
  index,
  labels,
  onCopy,
  onClose,
  onPrev,
  onNext,
  className,
}: PixelProbeProps) {
  const showFooter = onPrev != null || onNext != null || index != null
  return (
    <div
      data-testid="pixel-probe"
      className={cn("flex flex-col overflow-hidden border border-border bg-card", className)}
    >
      {/* Header */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-border px-3">
        <IconColorPicker size={13} className="text-muted-foreground" />
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          {labels.title}
        </span>
        {count != null && (
          <span className="inline-flex h-4 items-center border border-primary/25 bg-primary/10 px-1.5 font-mono text-[9px] tracking-[0.04em] text-primary">
            {count}
          </span>
        )}
        <span className="flex-1" />
        {onCopy && (
          <IconButton size="sm" onClick={onCopy} title={labels.copy}>
            <IconCopy size={13} stroke={1.75} />
          </IconButton>
        )}
        {onClose && (
          <IconButton size="sm" onClick={onClose} title={labels.close}>
            <IconX size={14} stroke={1.75} />
          </IconButton>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 overflow-x-hidden overflow-y-auto px-3 py-2.5">
        {fields.map((f) => (
          <FieldRow key={f.key} field={f} />
        ))}
      </div>

      {/* Footer — pixel navigation */}
      {showFooter && (
        <div className="flex items-center gap-1.5 border-t border-border px-3 py-2">
          <span className="flex-1" />
          <Tooltip content={labels.prev}>
            <IconButton size="sm" onClick={onPrev}>
              <IconChevronLeft size={13} stroke={1.75} />
            </IconButton>
          </Tooltip>
          {index != null && (
            <span className="font-mono text-[10px] tracking-[0.04em] text-muted-foreground">
              {labels.pointPrefix} {index}
            </span>
          )}
          <Tooltip content={labels.next}>
            <IconButton size="sm" onClick={onNext}>
              <IconChevronRight size={13} stroke={1.75} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  )
}

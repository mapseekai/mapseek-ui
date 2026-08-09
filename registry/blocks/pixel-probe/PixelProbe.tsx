import {
  IconChevronLeft,
  IconChevronRight,
  IconColorPicker,
  IconLock,
  IconX,
} from "@tabler/icons-react"
import { CopyButton } from "@/components/ui/copy-button"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { IconButton } from "@/components/ui/icon-button"
import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/utils"
import type { PixelField, PixelProbeProps } from "./types"

function FieldRow({ field, lockedLabel }: { field: PixelField; lockedLabel: string }) {
  const isEnum = field.type === "ENUM"

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="flex min-w-0 items-center gap-1.5">
        <span className="font-mono text-label-md uppercase text-muted-foreground">{field.key}</span>
        <Tag color="gray" size="sm">
          {field.type}
        </Tag>
        {field.locked && (
          <span className="ml-auto inline-flex text-muted-foreground">
            <IconLock aria-hidden="true" size={14} stroke={1.75} />
            <span className="sr-only">{lockedLabel}</span>
          </span>
        )}
      </dt>
      <dd className="flex h-7 min-w-0 items-center gap-2 border border-border bg-muted px-2 text-body-md text-foreground select-text">
        <div
          className={cn(
            "min-w-0 flex-1 overflow-x-auto whitespace-nowrap",
            !isEnum && "font-mono tabular-nums",
          )}
        >
          {isEnum ? <Tag color="gray">{field.value}</Tag> : field.value}
        </div>
        {field.unit && (
          <span className="shrink-0 font-mono text-label-md text-muted-foreground">
            {field.unit}
          </span>
        )}
      </dd>
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
    <section
      aria-label={labels.title}
      data-testid="pixel-probe"
      className={cn(
        "flex min-w-0 flex-col overflow-hidden border border-border bg-card",
        className,
      )}
    >
      {/* Header */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-border px-3">
        <IconColorPicker
          aria-hidden="true"
          size={14}
          stroke={1.75}
          className="text-muted-foreground"
        />
        <span className="text-label-sm uppercase text-muted-foreground">{labels.title}</span>
        {count != null && (
          <Tag color="gray">
            <span className="tabular-nums">{count}</span>
          </Tag>
        )}
        <span className="flex-1" />
        {onCopy && (
          <CopyButton
            content={JSON.stringify(fields, null, 2)}
            label={labels.copy}
            copiedLabel={labels.copied ?? labels.copy}
            onCopy={onCopy}
            title={labels.copy}
          />
        )}
        {onClose && (
          <IconButton size="xs" label={labels.close} tooltip onClick={onClose}>
            <IconX aria-hidden="true" stroke={1.75} />
          </IconButton>
        )}
      </div>

      {/* Body */}
      {fields.length === 0 ? (
        <Empty className="min-h-24 p-4">
          <EmptyHeader>
            <EmptyTitle>{labels.empty}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <dl className="flex min-h-0 min-w-0 flex-col gap-2.5 overflow-y-auto px-3 py-2.5">
          {fields.map((field) => (
            <FieldRow key={field.key} field={field} lockedLabel={labels.locked} />
          ))}
        </dl>
      )}

      {/* Footer — pixel navigation */}
      {showFooter && (
        <div className="flex items-center gap-1.5 border-t border-border px-3 py-2">
          <span className="flex-1" />
          <IconButton size="xs" label={labels.prev} tooltip onClick={onPrev}>
            <IconChevronLeft aria-hidden="true" stroke={1.75} />
          </IconButton>
          {index != null && (
            <span className="font-mono text-label-md tabular-nums text-muted-foreground">
              {labels.pointPrefix} {index}
            </span>
          )}
          <IconButton size="xs" label={labels.next} tooltip onClick={onNext}>
            <IconChevronRight aria-hidden="true" stroke={1.75} />
          </IconButton>
        </div>
      )}
    </section>
  )
}

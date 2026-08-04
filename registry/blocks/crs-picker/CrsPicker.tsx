import { IconMap2, IconSearch, IconWorld, type Icon as TablerIcon } from "@tabler/icons-react"
import * as React from "react"
import { Input } from "@/components/ui/input"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { buildCrsList } from "./built-in-crs"
import { DEFAULT_CRS_PICKER_LABELS } from "./defaults"
import type { CrsItem, CrsPickerProps } from "./types"

// ── search filter ─────────────────────────────────────────────────────────────

function filterItems(items: CrsItem[], query: string): CrsItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((i) => i.epsg.toLowerCase().includes(q) || i.name.toLowerCase().includes(q))
}

// ── CrsPicker ─────────────────────────────────────────────────────────────────

export function CrsPicker({
  value: valueProp,
  defaultValue,
  onChange,
  allowedEpsgs,
  extraItems,
  className,
  labels: labelsProp,
}: CrsPickerProps) {
  const labels = resolveLabels(DEFAULT_CRS_PICKER_LABELS, labelsProp)
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | null>(
    defaultValue ?? null,
  )
  const isControlled = valueProp !== undefined
  const selectedEpsg = isControlled ? (valueProp ?? null) : uncontrolledValue

  const [query, setQuery] = React.useState("")

  const allItems = React.useMemo(
    () => buildCrsList(allowedEpsgs, extraItems, labels),
    [allowedEpsgs, extraItems, labels],
  )

  const visibleItems = React.useMemo(() => filterItems(allItems, query), [allItems, query])

  const hasQuery = query.trim().length > 0

  function handleSelect(epsg: string) {
    if (!isControlled) setUncontrolledValue(epsg)
    onChange?.(epsg)
  }

  const geographic = visibleItems.filter((i) => i.kind === "geographic")
  const projected = visibleItems.filter((i) => i.kind === "projected")

  return (
    <div
      data-slot="crs-picker"
      className={cn("w-[280px] border border-border bg-background text-sm", className)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <IconWorld size={13} strokeWidth={1.75} className="shrink-0 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">{labels.title}</span>
      </div>

      {/* Search */}
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border px-2.5",
          hasQuery ? "bg-background" : "bg-muted",
        )}
      >
        <IconSearch
          size={12}
          strokeWidth={2}
          className={cn("shrink-0", hasQuery ? "text-primary" : "text-muted-foreground")}
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="h-8 w-full border-0 bg-transparent px-0 text-xs text-foreground placeholder:text-muted-foreground shadow-none outline-none focus-visible:ring-0"
        />
      </div>

      {/* Items */}
      <div role="listbox" aria-label={labels.listLabel} className="p-1.5">
        {visibleItems.length === 0 ? (
          <div className="px-3 py-5 text-center text-xs text-muted-foreground">
            {labels.noResults}
          </div>
        ) : hasQuery ? (
          visibleItems.map((item) => (
            <CrsRow
              key={item.epsg}
              item={item}
              selected={selectedEpsg === item.epsg}
              onSelect={handleSelect}
            />
          ))
        ) : (
          <>
            {geographic.length > 0 && (
              <>
                <GroupLabel icon={IconWorld}>{labels.geographic}</GroupLabel>
                {geographic.map((item) => (
                  <CrsRow
                    key={item.epsg}
                    item={item}
                    selected={selectedEpsg === item.epsg}
                    onSelect={handleSelect}
                  />
                ))}
              </>
            )}
            {projected.length > 0 && (
              <>
                <GroupLabel icon={IconMap2} className={geographic.length > 0 ? "mt-1" : undefined}>
                  {labels.projected}
                </GroupLabel>
                {projected.map((item) => (
                  <CrsRow
                    key={item.epsg}
                    item={item}
                    selected={selectedEpsg === item.epsg}
                    onSelect={handleSelect}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── sub-components ────────────────────────────────────────────────────────────

function GroupLabel({
  children,
  icon: Icon,
  className,
}: {
  children: React.ReactNode
  icon: TablerIcon
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-1 flex items-center gap-1.5 bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-foreground",
        className,
      )}
    >
      <Icon size={11} stroke={1.75} className="shrink-0" />
      {children}
    </div>
  )
}

function CrsRow({
  item,
  selected,
  onSelect,
}: {
  item: CrsItem
  selected: boolean
  onSelect: (epsg: string) => void
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelect(item.epsg)
    }
  }

  return (
    <div
      role="option"
      aria-selected={selected}
      aria-label={item.epsg}
      tabIndex={0}
      onClick={() => onSelect(item.epsg)}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex cursor-pointer items-start justify-between px-2 py-[7px]",
        "border-l-2",
        selected
          ? "border-l-primary bg-[oklch(0.627_0.194_149_/_0.06)]"
          : "border-l-transparent hover:bg-muted",
      )}
    >
      <div className="min-w-0">
        <div
          className={cn(
            "font-mono text-[12px] font-semibold leading-snug",
            selected ? "text-primary" : "text-foreground",
          )}
        >
          {item.epsg}
        </div>
        <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
          {item.description}
        </div>
      </div>
      <div
        className={cn(
          "shrink-0 pl-2 font-mono text-[12px] font-medium leading-snug",
          selected ? "text-primary" : "text-muted-foreground",
        )}
      >
        {item.name}
      </div>
    </div>
  )
}

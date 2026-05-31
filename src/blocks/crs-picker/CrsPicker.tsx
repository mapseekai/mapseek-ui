import * as React from "react"
import {
  IconMap2,
  IconSearch,
  IconWorld,
  type Icon as TablerIcon,
} from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"
import { buildCrsList } from "./built-in-crs"
import type { CrsItem, CrsPickerProps } from "./types"

// ── search filter ─────────────────────────────────────────────────────────────

function filterItems(items: CrsItem[], query: string): CrsItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter(
    i =>
      i.epsg.toLowerCase().includes(q) ||
      i.name.toLowerCase().includes(q),
  )
}

// ── CrsPicker ─────────────────────────────────────────────────────────────────

export function CrsPicker({
  value: valueProp,
  defaultValue,
  onChange,
  allowedEpsgs,
  extraItems,
  className,
}: CrsPickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | null>(
    defaultValue ?? null,
  )
  const isControlled = valueProp !== undefined
  const selectedEpsg = isControlled ? (valueProp ?? null) : uncontrolledValue

  const [query, setQuery] = React.useState("")

  const allItems = React.useMemo(
    () => buildCrsList(allowedEpsgs, extraItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(allowedEpsgs), JSON.stringify(extraItems)],
  )

  const visibleItems = React.useMemo(
    () => filterItems(allItems, query),
    [allItems, query],
  )

  const hasQuery = query.trim().length > 0

  function handleSelect(epsg: string) {
    if (!isControlled) setUncontrolledValue(epsg)
    onChange?.(epsg)
  }

  const geographic = visibleItems.filter(i => i.kind === "geographic")
  const projected = visibleItems.filter(i => i.kind === "projected")

  return (
    <div
      data-slot="crs-picker"
      className={cn("w-[280px] border border-border bg-background text-sm", className)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <IconWorld size={13} strokeWidth={1.75} className="shrink-0 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">坐标参考系</span>
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
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="搜索 EPSG 或名称…"
          className="h-8 w-full border-0 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Items */}
      <div role="listbox" aria-label="坐标参考系" className="p-1.5">
        {visibleItems.length === 0 ? (
          <div className="px-3 py-5 text-center text-xs text-muted-foreground">
            未找到匹配的坐标系
          </div>
        ) : hasQuery ? (
          visibleItems.map(item => (
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
                <GroupLabel icon={IconWorld}>球面坐标系</GroupLabel>
                {geographic.map(item => (
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
                  平面坐标系
                </GroupLabel>
                {projected.map(item => (
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
  return (
    <div
      role="option"
      aria-selected={selected}
      aria-label={item.epsg}
      onClick={() => onSelect(item.epsg)}
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
        <div className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">
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

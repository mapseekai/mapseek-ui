import { IconAlertTriangle } from "@tabler/icons-react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ColumnDef, RowSource } from "./types"

const ROW_HEIGHT = 36
const COL_WIDTH = 160
const INDEX_COL_WIDTH = 64
const STUB_ROWS = 20
const SKELETON_ROW_KEYS = Array.from({ length: STUB_ROWS }, (_, index) => `skeleton-row-${index}`)

export type VirtualTableProps<TRow> = {
  columns: ColumnDef[]
  source: RowSource<TRow>
  getRowKey: (row: TRow | undefined, index: number) => string | number
  renderCell: (row: TRow, col: ColumnDef) => React.ReactNode
  selectedRowKey?: string | number | null
  onRowClick?: (row: TRow) => void
  emptyLabel: string
  errorRetryLabel: string
  indexColLabel: string
  className?: string
}

export function VirtualTable<TRow>({
  columns,
  source,
  getRowKey,
  renderCell,
  selectedRowKey,
  onRowClick,
  emptyLabel,
  errorRetryLabel,
  indexColLabel,
  className,
}: VirtualTableProps<TRow>) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const totalCount = source.totalCount
  const virtualCount = totalCount ?? 0

  const virtualizer = useVirtualizer({
    count: virtualCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const visibleStart = virtualItems[0]?.index ?? 0
  const visibleEnd = virtualItems[virtualItems.length - 1]?.index ?? 0

  // Forward visible range to the source (debounce/dispatch is the
  // source's responsibility — memory sources can ignore).
  const cb = source.onVisibleRangeChange
  useEffect(() => {
    if (cb) cb(visibleStart, visibleEnd)
  }, [cb, visibleStart, visibleEnd])

  const tableMinWidth = columns.length * COL_WIDTH + INDEX_COL_WIDTH

  if (source.error) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center gap-2 text-xs text-muted-foreground",
          className,
        )}
      >
        <IconAlertTriangle size={20} stroke={1.5} className="text-destructive" />
        <span>{source.error.message}</span>
        <button
          type="button"
          onClick={source.refetch}
          className="rounded-none border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-muted"
        >
          {errorRetryLabel}
        </button>
      </div>
    )
  }

  if (!source.isInitialLoading && totalCount === 0) {
    return (
      <div
        className={cn(
          "flex h-full items-center justify-center text-xs text-muted-foreground",
          className,
        )}
      >
        {emptyLabel}
      </div>
    )
  }

  const showStubSkeleton = source.isInitialLoading || totalCount == null

  return (
    <div
      key={source.scrollKey}
      ref={scrollRef}
      className={cn(
        "h-full overflow-auto [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:size-1.5 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent",
        className,
      )}
    >
      <div style={{ minWidth: tableMinWidth }} className="relative w-full font-mono text-[12px]">
        {/* Sticky header */}
        <div className="sticky top-0 z-[1] flex border-b border-border bg-muted">
          <HeaderCell width={INDEX_COL_WIDTH} className="justify-end text-muted-foreground">
            {indexColLabel}
          </HeaderCell>
          {columns.map((c) => (
            <HeaderCell key={c.name} width={COL_WIDTH}>
              {c.name}
            </HeaderCell>
          ))}
        </div>

        {/* Body */}
        <div
          style={{
            height: showStubSkeleton ? STUB_ROWS * ROW_HEIGHT : virtualizer.getTotalSize(),
            position: "relative",
          }}
        >
          {showStubSkeleton
            ? SKELETON_ROW_KEYS.map((rowKey) => (
                <div
                  key={rowKey}
                  data-skeleton="true"
                  style={{ height: ROW_HEIGHT }}
                  className="flex border-b border-border/60"
                >
                  <Cell width={INDEX_COL_WIDTH} className="justify-end">
                    <Skeleton className="h-3 w-6" />
                  </Cell>
                  {columns.map((c) => (
                    <Cell key={c.name} width={COL_WIDTH}>
                      <Skeleton className="h-3 w-20" />
                    </Cell>
                  ))}
                </div>
              ))
            : virtualItems.map((vi) => {
                const row = source.getRow(vi.index)
                const rowKey = getRowKey(row, vi.index)
                const isSelected =
                  row != null && selectedRowKey != null && rowKey === selectedRowKey
                return (
                  <button
                    type="button"
                    key={vi.key}
                    data-index={vi.index}
                    ref={virtualizer.measureElement}
                    disabled={!row || !onRowClick}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: `translateY(${vi.start}px)`,
                      width: "100%",
                      height: ROW_HEIGHT,
                    }}
                    className={cn(
                      "flex border-x-0 border-t-0 border-b border-border/60 bg-transparent p-0 text-left font-inherit text-inherit transition-colors",
                      row ? "cursor-pointer hover:bg-muted/40" : "pointer-events-none",
                      isSelected &&
                        "bg-primary/15 ring-1 ring-primary/40 ring-inset hover:bg-primary/20",
                    )}
                    onClick={() => {
                      if (row && onRowClick) onRowClick(row)
                    }}
                  >
                    <Cell
                      width={INDEX_COL_WIDTH}
                      className={cn(
                        "tnum justify-end text-muted-foreground",
                        isSelected && "text-primary",
                      )}
                    >
                      {(vi.index + 1).toLocaleString()}
                    </Cell>
                    {row
                      ? columns.map((c) => (
                          <Cell key={c.name} width={COL_WIDTH}>
                            {renderCell(row, c)}
                          </Cell>
                        ))
                      : columns.map((c) => (
                          <Cell key={c.name} width={COL_WIDTH}>
                            <Skeleton className="h-3 w-20" />
                          </Cell>
                        ))}
                  </button>
                )
              })}
        </div>
      </div>
    </div>
  )
}

function HeaderCell({
  children,
  width,
  className,
}: {
  children: React.ReactNode
  width: number
  className?: string
}) {
  return (
    <div
      style={{ width, minWidth: width }}
      className={cn(
        "flex h-9 items-center border-r border-border/60 px-3 text-[11px] font-medium text-muted-foreground last:border-r-0",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Cell({
  children,
  width,
  className,
}: {
  children: React.ReactNode
  width: number
  className?: string
}) {
  return (
    <div
      style={{ width, minWidth: width }}
      className={cn(
        "flex h-full items-center overflow-hidden border-r border-border/60 px-3 last:border-r-0",
        className,
      )}
    >
      <span className="truncate">{children}</span>
    </div>
  )
}

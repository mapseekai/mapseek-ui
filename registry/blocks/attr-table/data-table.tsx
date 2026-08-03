import type { ColumnDef, RowSource } from "./types"
import { VirtualTable } from "./virtual-table"

export type DataTableProps<TRow> = {
  columns: ColumnDef[]
  source: RowSource<TRow>
  getRowKey: (row: TRow | undefined, index: number) => string | number
  renderCell: (row: TRow, col: ColumnDef) => React.ReactNode
  selectedRowKey?: string | number | null
  onRowClick?: (row: TRow) => void
  emptyLabel: string
  errorRetryLabel: string
  indexColLabel?: string
  className?: string
}

export function DataTable<TRow>({
  columns,
  source,
  getRowKey,
  renderCell,
  selectedRowKey,
  onRowClick,
  emptyLabel,
  errorRetryLabel,
  indexColLabel = "#",
  className,
}: DataTableProps<TRow>) {
  return (
    <VirtualTable
      columns={columns}
      source={source}
      getRowKey={getRowKey}
      renderCell={renderCell}
      selectedRowKey={selectedRowKey}
      onRowClick={onRowClick}
      emptyLabel={emptyLabel}
      errorRetryLabel={errorRetryLabel}
      indexColLabel={indexColLabel}
      className={className}
    />
  )
}

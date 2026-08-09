import { IconSearch } from "@tabler/icons-react"
import { useId, useMemo, useState } from "react"
import { CopyButton } from "@/components/ui/copy-button"
import { Input } from "@/components/ui/input"
import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/utils"
import { attributeColumns, rawTypeTagColor } from "./columns"
import type { ColumnDef } from "./types"
import { useStaticRowSource } from "./use-static-row-source"
import { VirtualTable } from "./virtual-table"

type SchemaRow = ColumnDef

const COLUMNS: ColumnDef[] = [
  { name: "name", rawType: "string" },
  { name: "type", rawType: "string" },
]

export type SchemaTableProps = {
  attributes: Record<string, string>
  onCopyField?: (name: string) => void
  searchPlaceholder: string
  emptyLabel: string
  noMatchLabel: string
  copyActionLabel: string
  className?: string
}

export function SchemaTable({
  attributes,
  onCopyField,
  searchPlaceholder,
  emptyLabel,
  noMatchLabel,
  copyActionLabel,
  className,
}: SchemaTableProps) {
  const [query, setQuery] = useState("")
  const searchInputId = useId()

  const items = useMemo<SchemaRow[]>(() => attributeColumns(attributes), [attributes])

  const itemsKey = useMemo(() => Object.keys(attributes).join("|"), [attributes])

  const source = useStaticRowSource(items, {
    query,
    match: (it, q) => it.name.toLowerCase().includes(q) || it.rawType.toLowerCase().includes(q),
    itemsKey,
  })

  const isFiltered = query.trim().length > 0

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex shrink-0 items-center border-b border-border bg-card px-2 py-1.5">
        <div className="relative flex items-center">
          <label className="sr-only" htmlFor={searchInputId}>
            {searchPlaceholder}
          </label>
          <IconSearch
            size={13}
            stroke={1.5}
            className="pointer-events-none absolute left-2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id={searchInputId}
            type="search"
            name="schema-field-search"
            autoComplete="off"
            className="h-8 w-[200px] rounded-none pl-7 text-body-md"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <VirtualTable
          columns={COLUMNS}
          source={source}
          getRowKey={(row, i) => row?.name ?? i}
          renderCell={(row, c) =>
            c.name === "name" ? (
              <span className="flex w-full items-center justify-between gap-2">
                <span className="font-medium">{row.name}</span>
                <CopyButton
                  content={row.name}
                  aria-label={copyActionLabel}
                  label={copyActionLabel}
                  className="shrink-0"
                  onCopy={() => onCopyField?.(row.name)}
                />
              </span>
            ) : (
              <Tag color={rawTypeTagColor(row.rawType)}>{row.rawType}</Tag>
            )
          }
          getCellText={(row, column) => (column.name === "name" ? row.name : row.rawType)}
          emptyLabel={isFiltered ? noMatchLabel : emptyLabel}
          errorRetryLabel=""
          indexColLabel="#"
        />
      </div>
    </div>
  )
}

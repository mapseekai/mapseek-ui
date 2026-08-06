import { IconSearch } from "@tabler/icons-react"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/ui/copy-button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { attributeColumns, rawTypeBadgeClass } from "./columns"
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
          <IconSearch
            size={13}
            stroke={1.5}
            className="pointer-events-none absolute left-2 text-muted-foreground"
          />
          <Input
            className="h-7 w-[200px] rounded-none pl-7 text-body-md"
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
              <Badge variant="outline" className={rawTypeBadgeClass(row.rawType)}>
                {row.rawType}
              </Badge>
            )
          }
          emptyLabel={isFiltered ? noMatchLabel : emptyLabel}
          errorRetryLabel=""
          indexColLabel="#"
        />
      </div>
    </div>
  )
}

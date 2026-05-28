import { useMemo, useState } from "react"
import { IconCopy, IconSearch } from "@tabler/icons-react"
import { Input } from "../../components/input"
import { cn } from "../../lib/utils"
import { useStaticRowSource } from "./use-static-row-source"
import { VirtualTable } from "./virtual-table"
import type { ColumnDef } from "./types"

type SchemaRow = { name: string; rawType: string }

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

  const items = useMemo<SchemaRow[]>(
    () =>
      Object.entries(attributes)
        .filter(([_, type]) => !type.toLowerCase().includes("geometry"))
        .map(([name, rawType]) => ({ name, rawType })),
    [attributes],
  )

  const itemsKey = useMemo(() => Object.keys(attributes).join("|"), [attributes])

  const source = useStaticRowSource(items, {
    query,
    match: (it, q) =>
      it.name.toLowerCase().includes(q) || it.rawType.toLowerCase().includes(q),
    itemsKey,
  })

  const handleCopy = (name: string) => {
    if (onCopyField) onCopyField(name)
    else if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(name)
    }
  }

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
            className="h-7 w-[200px] rounded-none pl-7 text-xs"
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
                <button
                  type="button"
                  aria-label={copyActionLabel}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy(row.name)
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <IconCopy size={12} stroke={1.5} />
                </button>
              </span>
            ) : (
              <span className="text-muted-foreground">{row.rawType}</span>
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

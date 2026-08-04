import { IconAdjustmentsAlt, IconCode, IconEye, IconPlus, IconX } from "@tabler/icons-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { DEFAULT_FILTER_PANEL_LABELS } from "./defaults"
import type {
  FilterCondition,
  FilterPanelContextValue,
  FilterPanelProps,
  FilterValue,
} from "./types"
import { EMPTY_FILTER } from "./types"

const FilterPanelContext = React.createContext<FilterPanelContextValue | null>(null)

function useFilterPanelContext(): FilterPanelContextValue {
  const ctx = React.useContext(FilterPanelContext)
  if (!ctx) {
    throw new Error("FilterPanel sub-components must be used inside <FilterPanel>.")
  }
  return ctx
}

function patch(
  value: FilterValue,
  onChange: (v: FilterValue) => void,
  delta: Partial<FilterValue>,
) {
  onChange({ ...value, ...delta })
}

const miniSelect = "h-6 rounded-none border-border bg-background px-2 font-mono text-[11px]"

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function FilterPanelRoot({
  fields,
  value,
  onChange,
  labels: labelsProp,
  className,
  children,
}: FilterPanelProps) {
  const labels = resolveLabels(DEFAULT_FILTER_PANEL_LABELS, labelsProp)
  const ctx = React.useMemo(
    () => ({ fields, value, onChange, labels }),
    [fields, value, onChange, labels],
  )
  return (
    <FilterPanelContext.Provider value={ctx}>
      <div data-slot="filter-panel" className={cn("flex flex-col", className)}>
        {children}
      </div>
    </FilterPanelContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Sub-controls
// ---------------------------------------------------------------------------

function FilterPanelModeToggle({ className }: { className?: string }) {
  const { value, onChange, labels } = useFilterPanelContext()
  const modes = [
    { id: "builder" as const, label: labels.builder, Icon: IconAdjustmentsAlt },
    { id: "sql" as const, label: "SQL", Icon: IconCode },
  ]
  return (
    <div className={cn("mb-2.5 flex", className)}>
      {modes.map((m, i) => {
        const isCur = value.mode === m.id
        return (
          <Button
            key={m.id}
            variant="ghost"
            onClick={() => patch(value, onChange, { mode: m.id })}
            className={cn(
              "h-6 flex-1 gap-1.5 rounded-none border border-border-strong px-2 text-[11px] font-medium leading-none shadow-none",
              i > 0 && "-ml-px",
              isCur
                ? "bg-selection-bg text-primary hover:text-primary"
                : "bg-background text-foreground",
            )}
          >
            <m.Icon size={12} />
            {m.label}
          </Button>
        )
      })}
    </div>
  )
}

function FilterPanelBuilder({ ops, className }: { ops: string[]; className?: string }) {
  const { fields, value, onChange, labels } = useFilterPanelContext()
  if (value.mode !== "builder") return null

  const updateRow = (id: number, delta: Partial<FilterCondition>) => {
    patch(value, onChange, {
      rows: value.rows.map((r) => (r.id === id ? { ...r, ...delta } : r)),
    })
  }
  const removeRow = (id: number) => {
    patch(value, onChange, { rows: value.rows.filter((r) => r.id !== id) })
  }
  const addRow = () => {
    const nextId = (value.rows[value.rows.length - 1]?.id ?? 0) + 1
    patch(value, onChange, {
      rows: [
        ...value.rows,
        {
          id: nextId,
          conn: "AND",
          field: fields[0] ?? "",
          op: ops[0] ?? "=",
          value: "",
        },
      ],
    })
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-1.5">
        {value.rows.length === 0 && (
          <div className="py-2.5 text-center text-[11px] leading-[1.5] text-muted-foreground">
            {labels.noConditions}
          </div>
        )}
        {value.rows.map((f, idx) => (
          <div key={f.id} className="flex flex-col gap-1">
            {idx > 0 && (
              <div className="flex">
                {(["AND", "OR"] as const).map((c, ci) => {
                  const isCur = f.conn === c
                  return (
                    <Button
                      key={c}
                      variant="ghost"
                      onClick={() => updateRow(f.id, { conn: c })}
                      className={cn(
                        "h-5 rounded-none border border-border px-1.5 font-mono text-[10px] font-semibold leading-none tracking-[0.04em]",
                        ci > 0 && "-ml-px",
                        isCur
                          ? "bg-selection-bg text-primary hover:text-primary"
                          : "bg-background text-muted-foreground",
                      )}
                    >
                      {c}
                    </Button>
                  )
                })}
              </div>
            )}
            <div className="grid grid-cols-[64px_auto_minmax(0,1fr)_20px] items-center gap-x-1">
              <Select
                value={f.field}
                onValueChange={(val) => updateRow(f.id, { field: val })}
                className={miniSelect}
              >
                {fields.map((o) => (
                  <Select.Item key={o} value={o}>
                    {o}
                  </Select.Item>
                ))}
              </Select>
              <Select
                value={f.op}
                onValueChange={(val) => updateRow(f.id, { op: val })}
                className={cn(miniSelect, "w-max min-w-12 whitespace-nowrap")}
              >
                {ops.map((o) => (
                  <Select.Item key={o} value={o}>
                    {o}
                  </Select.Item>
                ))}
              </Select>
              <Input
                className="h-6 rounded-none border-border bg-background px-2 font-mono text-[11px]"
                placeholder={labels.valuePlaceholder}
                value={f.value}
                onChange={(e) => updateRow(f.id, { value: e.target.value })}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRow(f.id)}
                aria-label={labels.removeCondition}
                className="size-5 rounded-none text-muted-foreground"
              >
                <IconX size={12} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={addRow}
          className="h-6 flex-1 gap-1 rounded-none border border-dashed border-primary/40 px-1.5 text-[11px] font-medium leading-none text-primary hover:text-primary"
        >
          <IconPlus size={12} /> {labels.addCondition}
        </Button>
      </div>
    </div>
  )
}

function FilterPanelSql({ keywords, className }: { keywords: string[]; className?: string }) {
  const { value, onChange } = useFilterPanelContext()
  if (value.mode !== "sql") return null
  return (
    <div className={cn("flex flex-col", className)}>
      <Textarea
        value={value.sql}
        spellCheck={false}
        onChange={(e) => patch(value, onChange, { sql: e.target.value })}
        placeholder='code = "R2" AND area_m2 > 30000'
        className="min-h-[70px] w-full resize-y rounded-none border-border-strong bg-muted p-2 font-mono text-[11px] font-medium leading-[1.5] text-foreground shadow-none"
      />
      <div className="mt-1 flex flex-wrap gap-[3px]">
        {keywords.map((kw) => (
          <Button
            key={kw}
            variant="ghost"
            onClick={() =>
              patch(value, onChange, {
                sql: value.sql ? `${value.sql} ${kw} ` : `${kw} `,
              })
            }
            className="h-5 rounded-none border border-border bg-background px-[5px] font-mono text-[10px] font-medium leading-none text-primary hover:text-primary"
          >
            {kw}
          </Button>
        ))}
      </div>
    </div>
  )
}

function FilterPanelFooter({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div data-slot="filter-panel-footer" className={cn("mt-2 flex items-center gap-2", className)}>
      {children}
    </div>
  )
}

function FilterPanelEstimate({
  count,
  total,
  className,
}: {
  count: number
  total: number
  className?: string
}) {
  const { labels } = useFilterPanelContext()
  return (
    <span
      className={cn(
        "flex-1 font-mono text-[10px] uppercase tracking-[0.04em] text-muted-foreground",
        className,
      )}
    >
      <IconEye size={11} className="mr-1 align-[-1px]" />
      {labels.estimate} <span className="text-primary">{count}</span> / {total} {labels.rows}
    </span>
  )
}

function FilterPanelClearButton({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { value, onChange, labels } = useFilterPanelContext()
  return (
    <Button
      variant="outline"
      onClick={() => onChange({ ...EMPTY_FILTER, mode: value.mode })}
      className={cn("h-6 rounded-none px-2 text-[11px]", className)}
    >
      {children ?? labels.clear}
    </Button>
  )
}

function FilterPanelApplyButton({
  onClick,
  className,
  children,
}: {
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}) {
  const { labels } = useFilterPanelContext()
  return (
    <Button onClick={onClick} className={cn("-ml-px h-6 rounded-none px-2 text-[11px]", className)}>
      {children ?? labels.apply}
    </Button>
  )
}

export const FilterPanel = Object.assign(FilterPanelRoot, {
  ModeToggle: FilterPanelModeToggle,
  Builder: FilterPanelBuilder,
  Sql: FilterPanelSql,
  Footer: FilterPanelFooter,
  Estimate: FilterPanelEstimate,
  ClearButton: FilterPanelClearButton,
  ApplyButton: FilterPanelApplyButton,
})

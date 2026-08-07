import { IconAdjustmentsAlt, IconCode, IconEye, IconPlus, IconX } from "@tabler/icons-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

const miniSelect = "rounded-none px-2 font-mono text-body-sm"

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
        <Tabs
          value={value.mode}
          onValueChange={(mode) => {
            if (mode === "builder" || mode === "sql") {
              patch(value, onChange, { mode })
            }
          }}
          className="gap-0"
        >
          {children}
        </Tabs>
      </div>
    </FilterPanelContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Sub-controls
// ---------------------------------------------------------------------------

function FilterPanelModeToggle({ className }: { className?: string }) {
  const { labels } = useFilterPanelContext()
  const modes = [
    { id: "builder" as const, label: labels.builder, Icon: IconAdjustmentsAlt },
    { id: "sql" as const, label: "SQL", Icon: IconCode },
  ]
  return (
    <TabsList variant="primary" className={cn("mb-2.5 grid h-7 w-full grid-cols-2", className)}>
      {modes.map((mode) => (
        <TabsTrigger key={mode.id} value={mode.id} className="text-body-md-medium">
          <mode.Icon data-icon="inline-start" />
          {mode.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

function FilterPanelBuilder({ ops, className }: { ops: string[]; className?: string }) {
  const { fields, value, onChange, labels } = useFilterPanelContext()

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
    <TabsContent value="builder" className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-1.5">
        {value.rows.length === 0 && (
          <div className="py-2.5 text-center text-body-sm leading-[1.5] text-muted-foreground">
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
                        "h-5 rounded-none border border-border px-1.5 font-mono text-[10px] tracking-[0.04em] leading-none",
                        ci > 0 && "-ml-px",
                        isCur
                          ? "bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary"
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
                onValueChange={(val) => val != null && updateRow(f.id, { field: val })}
              >
                <SelectTrigger size="xs" className={miniSelect}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {fields.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={f.op}
                onValueChange={(val) => val != null && updateRow(f.id, { op: val })}
              >
                <SelectTrigger
                  size="xs"
                  className={cn(miniSelect, "w-max min-w-12 whitespace-nowrap")}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ops.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                className="h-6 rounded-none border-input bg-input-surface px-2 font-mono text-body-sm"
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
                <IconX />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={addRow}
          className="h-6 flex-1 gap-1 rounded-none border border-dashed border-primary/40 px-1.5 text-body-sm-medium leading-none text-primary hover:text-primary"
        >
          <IconPlus data-icon="inline-start" /> {labels.addCondition}
        </Button>
      </div>
    </TabsContent>
  )
}

function FilterPanelSql({ keywords, className }: { keywords: string[]; className?: string }) {
  const { value, onChange } = useFilterPanelContext()
  return (
    <TabsContent value="sql" className={cn("flex flex-col", className)}>
      <Textarea
        value={value.sql}
        spellCheck={false}
        onChange={(e) => patch(value, onChange, { sql: e.target.value })}
        placeholder='code = "R2" AND area_m2 > 30000'
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
    </TabsContent>
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
        "flex-1 font-mono text-[10px] tracking-[0.04em] uppercase text-muted-foreground",
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
      className={cn("h-6 rounded-none px-2 text-body-sm", className)}
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
    <Button
      onClick={onClick}
      className={cn("-ml-px h-6 rounded-none px-2 text-body-sm", className)}
    >
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

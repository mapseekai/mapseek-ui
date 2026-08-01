import { EMPTY_FILTER, FilterPanel, type FilterValue } from "@registry/blocks/filter-panel"
import { useState } from "react"

export type FilterPanelDemoLabels = {
  readonly intro: string
  readonly clearExternal: string
  readonly statusPrefix: string
}

export const zhFilterPanelLabels = {
  intro: "受控过滤面板。模式、条件行和 SQL 文本都由调用方保存。",
  clearExternal: "外部清空",
  statusPrefix: "当前模式",
} satisfies FilterPanelDemoLabels

export const enFilterPanelLabels = {
  intro: "Controlled filter panel. The caller stores mode, builder rows, and SQL text.",
  clearExternal: "External clear",
  statusPrefix: "Current mode",
} satisfies FilterPanelDemoLabels

export function FilterPanelDemo({ labels }: { readonly labels: FilterPanelDemoLabels }) {
  const [value, setValue] = useState<FilterValue>({
    mode: "builder",
    rows: [{ id: 1, conn: "AND", field: "type", op: "=", value: "road" }],
    sql: "",
  })

  return (
    <div data-demo="filter-panel" className="flex w-full max-w-md flex-col gap-3">
      <p className="m-0 text-xs text-muted-foreground">{labels.intro}</p>
      <div className="border border-border bg-card p-4">
        <FilterPanel fields={["type", "name", "area_m2"]} value={value} onChange={setValue}>
          <FilterPanel.ModeToggle />
          <FilterPanel.Builder ops={["=", "!=", ">", "<", "contains"]} />
          <FilterPanel.Sql keywords={["AND", "OR", "LIKE", "IN"]} />
          <FilterPanel.Footer>
            <FilterPanel.Estimate count={2847} total={12540} />
            <FilterPanel.ClearButton />
            <FilterPanel.ApplyButton />
          </FilterPanel.Footer>
        </FilterPanel>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-demo-action="external-clear"
          className="border border-border bg-background px-2 py-1 font-mono text-xs hover:bg-muted"
          onClick={() => setValue(EMPTY_FILTER)}
        >
          {labels.clearExternal}
        </button>
        <span data-demo-status="filter-mode" className="font-mono text-xs text-muted-foreground">
          {labels.statusPrefix}: {value.mode}
        </span>
      </div>
      <pre className="max-h-[180px] overflow-auto border border-border bg-muted/30 p-2 font-mono text-[11px]">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

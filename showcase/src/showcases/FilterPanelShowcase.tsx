import { EMPTY_FILTER, FilterPanel, type FilterValue } from "@registry/blocks/filter-panel"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    intro: "受控过滤面板。模式、条件行和 SQL 文本都由调用方保存。",
    clearExternal: "外部清空",
    statusPrefix: "当前模式",
  },
  en: {
    intro: "Controlled filter panel. The caller stores mode, builder rows, and SQL text.",
    clearExternal: "External clear",
    statusPrefix: "Current mode",
  },
}

export function FilterPanelDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [value, setValue] = useState<FilterValue>({
    mode: "builder",
    rows: [{ id: 1, conn: "AND", field: "type", op: "=", value: "road" }],
    sql: "",
  })

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <p className="m-0 text-xs text-muted-foreground">{demoLabels.intro}</p>
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
        <Button
          type="button"
          data-demo-action="external-clear"
          variant="outline"
          size="xs"
          onClick={() => setValue(EMPTY_FILTER)}
        >
          {demoLabels.clearExternal}
        </Button>
        <span data-demo-status="filter-mode" className="font-mono text-xs text-muted-foreground">
          {demoLabels.statusPrefix}: {value.mode}
        </span>
      </div>
      <div className="not-prose max-h-40 w-full min-w-0 overflow-auto border border-border bg-muted/30">
        <pre className="m-0 min-w-max p-2 font-mono !text-[10px] !leading-4">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </div>
  )
}

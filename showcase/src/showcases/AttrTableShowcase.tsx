import {
  AttrTableSheet,
  type ColumnDef,
  DataTable,
  type RowSource,
  SchemaTable,
  useStaticRowSource,
} from "@registry/blocks/attr-table"
import { Button } from "@registry/ui/button"
import { Checkbox } from "@registry/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@registry/ui/toggle-group"
import { useMemo, useState } from "react"
import type { LocalizedDemoProps } from "./types"

const schema: Record<string, string> = {
  fid: "int",
  name: "varchar(64)",
  use: "varchar(32)",
  code: "varchar(16)",
  area_m2: "numeric",
  perimeter_m: "numeric",
  owner: "varchar(64)",
  updated: "timestamptz",
  district: "varchar(32)",
  source_id: "varchar(64)",
  confidence: "numeric",
  flag: "boolean",
  notes: "text",
  geom: "geometry(MultiPolygon,4326)",
  centroid: "geography(Point,4326)",
}

type FeatureRow = {
  readonly id: number
  readonly properties: {
    readonly name: string
    readonly type: string
    readonly size: number
  }
}

const columns: ColumnDef[] = [
  { name: "name", rawType: "string" },
  { name: "type", rawType: "string" },
  { name: "size", rawType: "number" },
]

const sections = ["schema", "data", "sheet"] as const
type Section = (typeof sections)[number]

function buildRows(): FeatureRow[] {
  return Array.from({ length: 600 }, (_, index) => ({
    id: index,
    properties: {
      name: `feature-${index.toString(36)}`,
      type: index % 3 === 0 ? "A" : index % 3 === 1 ? "B" : "C",
      size: Math.round(Math.sin(index) * 1000) + 5000,
    },
  }))
}

function getCellText(row: FeatureRow, column: ColumnDef) {
  return String(row.properties[column.name as keyof FeatureRow["properties"]])
}

const labels = {
  "zh-CN": {
    schema: "字段 Schema",
    data: "要素数据",
    sheet: "底部抽屉",
    loading: "模拟加载中",
    error: "模拟错误",
    empty: "模拟空数据",
    openSheet: "打开属性表抽屉",
    close: "关闭",
    fullscreen: "全屏",
    search: "搜索字段",
    noFields: "无字段",
    noMatch: "无匹配字段",
    copyField: "复制字段名",
    noRows: "无数据",
    retry: "重试",
    selected: "选中",
  },
  en: {
    schema: "Schema",
    data: "Data",
    sheet: "Bottom sheet",
    loading: "Simulate loading",
    error: "Simulate error",
    empty: "Simulate empty",
    openSheet: "Open attribute sheet",
    close: "Close",
    fullscreen: "Fullscreen",
    search: "Search fields",
    noFields: "No fields",
    noMatch: "No matching fields",
    copyField: "Copy field name",
    noRows: "No rows",
    retry: "Retry",
    selected: "Selected",
  },
}

export function AttrTableDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [section, setSection] = useState<Section>("schema")
  const [simulateLoading, setSimulateLoading] = useState(false)
  const [simulateError, setSimulateError] = useState(false)
  const [simulateEmpty, setSimulateEmpty] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const rows = useMemo(() => (simulateEmpty ? [] : buildRows()), [simulateEmpty])
  const baseSource = useStaticRowSource(rows, { itemsKey: simulateEmpty ? "empty" : "features" })
  const source: RowSource<FeatureRow> = {
    ...baseSource,
    totalCount: simulateLoading ? null : baseSource.totalCount,
    isInitialLoading: simulateLoading,
    error: simulateError ? new Error("Network unavailable") : null,
    refetch: () => setSimulateError(false),
  }

  const table = (
    <DataTable<FeatureRow>
      columns={columns}
      source={source}
      getRowKey={(row, index) => row?.id ?? index}
      renderCell={getCellText}
      getCellText={getCellText}
      selectedRowKey={selected}
      onRowClick={(row) => setSelected(row.id)}
      emptyLabel={demoLabels.noRows}
      errorRetryLabel={demoLabels.retry}
    />
  )

  return (
    <div className="flex w-full flex-col gap-4">
      <ToggleGroup
        value={[section]}
        size="sm"
        onValueChange={(nextSections) => {
          const nextSection = nextSections.at(-1) as Section | undefined
          if (nextSection) setSection(nextSection)
        }}
      >
        {sections.map((item) => (
          <ToggleGroupItem
            key={item}
            value={item}
            data-demo-action={`section-${item}`}
            aria-label={demoLabels[item]}
          >
            {demoLabels[item]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {section === "schema" ? (
        <div className="h-[420px] border border-border">
          <SchemaTable
            attributes={schema}
            searchPlaceholder={demoLabels.search}
            emptyLabel={demoLabels.noFields}
            noMatchLabel={demoLabels.noMatch}
            copyActionLabel={demoLabels.copyField}
          />
        </div>
      ) : section === "data" ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label htmlFor="attr-table-simulate-loading" className="flex items-center gap-1">
              <Checkbox
                id="attr-table-simulate-loading"
                checked={simulateLoading}
                onCheckedChange={(checked) => setSimulateLoading(checked === true)}
              />
              {demoLabels.loading}
            </label>
            <label htmlFor="attr-table-simulate-error" className="flex items-center gap-1">
              <Checkbox
                id="attr-table-simulate-error"
                checked={simulateError}
                onCheckedChange={(checked) => setSimulateError(checked === true)}
              />
              {demoLabels.error}
            </label>
            <label htmlFor="attr-table-simulate-empty" className="flex items-center gap-1">
              <Checkbox
                id="attr-table-simulate-empty"
                checked={simulateEmpty}
                onCheckedChange={(checked) => setSimulateEmpty(checked === true)}
              />
              {demoLabels.empty}
            </label>
            {selected !== null ? (
              <span data-demo-status="selected-row" className="font-mono text-muted-foreground">
                {demoLabels.selected}: {selected}
              </span>
            ) : null}
          </div>
          <div className="h-[480px] border border-border">{table}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            data-demo-action="open-sheet"
            size="xs"
            className="w-fit"
            onClick={() => setSheetOpen(true)}
          >
            {demoLabels.openSheet}
          </Button>
          {sheetOpen ? (
            <div className="fixed inset-0 z-50 bg-black/10" data-demo="attr-table-sheet">
              <div className="relative h-full w-full overflow-hidden">
                <AttrTableSheet
                  ariaLabel={demoLabels.sheet}
                  onClose={() => setSheetOpen(false)}
                  fullscreenLabel={demoLabels.fullscreen}
                  closeLabel={demoLabels.close}
                  left={
                    <>
                      <span className="truncate text-sm font-semibold">land_use</span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {rows.length.toLocaleString()} rows
                      </span>
                    </>
                  }
                >
                  {table}
                </AttrTableSheet>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

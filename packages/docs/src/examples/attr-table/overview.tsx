import {
  AttrTableSheet,
  type ColumnDef,
  DataTable,
  type RowSource,
  SchemaTable,
  useStaticRowSource,
} from "@registry/blocks/attr-table"
import { useMemo, useState } from "react"

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

export type AttrTableDemoLabels = {
  readonly schema: string
  readonly data: string
  readonly sheet: string
  readonly loading: string
  readonly error: string
  readonly empty: string
  readonly openSheet: string
  readonly close: string
  readonly fullscreen: string
  readonly search: string
  readonly noFields: string
  readonly noMatch: string
  readonly copyField: string
  readonly noRows: string
  readonly retry: string
  readonly selected: string
}

export const zhAttrTableLabels = {
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
} satisfies AttrTableDemoLabels

export const enAttrTableLabels = {
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
} satisfies AttrTableDemoLabels

export function AttrTableDemo({ labels }: { readonly labels: AttrTableDemoLabels }) {
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
      renderCell={(row, column) =>
        String(row.properties[column.name as keyof FeatureRow["properties"]])
      }
      selectedRowKey={selected}
      onRowClick={(row) => setSelected(row.id)}
      emptyLabel={labels.noRows}
      errorRetryLabel={labels.retry}
    />
  )

  return (
    <div data-demo="attr-table" className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {sections.map((item) => (
          <button
            key={item}
            type="button"
            data-demo-action={`section-${item}`}
            className={[
              "border border-border px-3 py-1 font-mono text-xs",
              section === item
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted",
            ].join(" ")}
            onClick={() => setSection(item)}
          >
            {labels[item]}
          </button>
        ))}
      </div>
      {section === "schema" ? (
        <div className="h-[420px] border border-border">
          <SchemaTable
            attributes={schema}
            searchPlaceholder={labels.search}
            emptyLabel={labels.noFields}
            noMatchLabel={labels.noMatch}
            copyActionLabel={labels.copyField}
          />
        </div>
      ) : section === "data" ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={simulateLoading}
                onChange={(event) => setSimulateLoading(event.target.checked)}
              />
              {labels.loading}
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(event) => setSimulateError(event.target.checked)}
              />
              {labels.error}
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={simulateEmpty}
                onChange={(event) => setSimulateEmpty(event.target.checked)}
              />
              {labels.empty}
            </label>
            {selected !== null ? (
              <span data-demo-status="selected-row" className="font-mono text-muted-foreground">
                {labels.selected}: {selected}
              </span>
            ) : null}
          </div>
          <div className="h-[480px] border border-border">{table}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            data-demo-action="open-sheet"
            className="w-fit border border-border bg-primary px-3 py-1 font-mono text-xs text-primary-foreground hover:opacity-90"
            onClick={() => setSheetOpen(true)}
          >
            {labels.openSheet}
          </button>
          {sheetOpen ? (
            <div className="fixed inset-0 z-50 bg-background/80" data-demo="attr-table-sheet">
              <div className="relative h-full w-full overflow-hidden bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_10px,transparent_10px,transparent_20px)]">
                <AttrTableSheet
                  ariaLabel={labels.sheet}
                  onClose={() => setSheetOpen(false)}
                  fullscreenLabel={labels.fullscreen}
                  closeLabel={labels.close}
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

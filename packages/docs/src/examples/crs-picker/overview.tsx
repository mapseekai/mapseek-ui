import { type CrsItem, CrsPicker, type CrsPickerLabels } from "@registry/blocks/crs-picker"
import { useState } from "react"

export type CrsPickerDemoLabels = {
  readonly subset: string
  readonly custom: string
  readonly controlled: string
  readonly switch3857: string
  readonly switch4326: string
  readonly logTitle: string
  readonly emptyLog: string
  readonly current: string
  readonly changed: string
  readonly coreItems: readonly CrsItem[]
  readonly extraItems: readonly CrsItem[]
  readonly picker: CrsPickerLabels
}

export const zhCrsPickerLabels = {
  subset: "限定内置条目",
  custom: "追加与覆盖条目",
  controlled: "受控模式",
  switch3857: "外部切换 3857",
  switch4326: "外部切换 4326",
  logTitle: "回调日志",
  emptyLog: "-",
  current: "当前",
  changed: "已切换",
  coreItems: [
    {
      epsg: "EPSG:4326",
      name: "WGS 84",
      description: "全球通用 · 经纬度",
      kind: "geographic",
    },
    {
      epsg: "EPSG:4490",
      name: "CGCS2000",
      description: "国测 · 经纬度",
      kind: "geographic",
    },
    {
      epsg: "EPSG:3857",
      name: "Web Mercator",
      description: "切片底图 · 米",
      kind: "projected",
    },
  ],
  extraItems: [
    {
      epsg: "EPSG:32650",
      name: "WGS 84 / UTM 50N",
      description: "测绘项目 · 米",
      kind: "projected",
    },
    {
      epsg: "EPSG:4326",
      name: "WGS 84（覆盖）",
      description: "外部条目覆盖",
      kind: "geographic",
    },
  ],
  picker: {
    title: "坐标参考系",
    searchPlaceholder: "搜索 EPSG 或名称",
    listLabel: "坐标参考系列表",
    noResults: "没有匹配的坐标参考系",
    geographic: "地理坐标系",
    projected: "投影坐标系",
    wgs84Description: "全球通用 · 经纬度",
    cgcs2000Description: "国测 · 经纬度",
    beijing1954Description: "北京 54 · 历史坐标系",
    xian1980Description: "西安 80 · 历史坐标系",
    webMercatorDescription: "切片底图 · 米",
  },
} satisfies CrsPickerDemoLabels

export const enCrsPickerLabels = {
  subset: "Allowed built-ins",
  custom: "Extra and override items",
  controlled: "Controlled mode",
  switch3857: "Switch to 3857",
  switch4326: "Switch to 4326",
  logTitle: "Callback log",
  emptyLog: "-",
  current: "Current",
  changed: "Changed",
  coreItems: [
    {
      epsg: "EPSG:4326",
      name: "WGS 84",
      description: "Global standard · longitude/latitude",
      kind: "geographic",
    },
    {
      epsg: "EPSG:4490",
      name: "CGCS2000",
      description: "China geodetic standard · longitude/latitude",
      kind: "geographic",
    },
    {
      epsg: "EPSG:3857",
      name: "Web Mercator",
      description: "Tile basemap · meters",
      kind: "projected",
    },
  ],
  extraItems: [
    {
      epsg: "EPSG:32650",
      name: "WGS 84 / UTM 50N",
      description: "Survey project · meters",
      kind: "projected",
    },
    {
      epsg: "EPSG:4326",
      name: "WGS 84 (override)",
      description: "External item override",
      kind: "geographic",
    },
  ],
  picker: {
    title: "Coordinate reference system",
    searchPlaceholder: "Search EPSG or name",
    listLabel: "Coordinate reference systems",
    noResults: "No coordinate reference system found",
    geographic: "Geographic",
    projected: "Projected",
    wgs84Description: "Global standard · longitude/latitude",
    cgcs2000Description: "China geodetic standard · longitude/latitude",
    beijing1954Description: "Beijing 1954 · legacy datum",
    xian1980Description: "Xian 1980 · legacy datum",
    webMercatorDescription: "Tile basemap · meters",
  },
} satisfies CrsPickerDemoLabels

export function CrsPickerDemo({ labels }: { readonly labels: CrsPickerDemoLabels }) {
  const [value, setValue] = useState("EPSG:4326")
  const [log, setLog] = useState<string[]>([])
  const coreItems = labels.coreItems.map((item) => ({ ...item }))
  const extraItems = labels.extraItems.map((item) => ({ ...item }))

  const handleChange = (epsg: string) => {
    setValue(epsg)
    setLog((current) => [`onChange("${epsg}")`, ...current].slice(0, 6))
  }

  return (
    <div data-demo="crs-picker" className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-5">
        <section className="space-y-2">
          <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">{labels.subset}</h3>
          <CrsPicker
            defaultValue="EPSG:4326"
            allowedEpsgs={["EPSG:4326", "EPSG:4490", "EPSG:3857"]}
            extraItems={coreItems}
            labels={labels.picker}
          />
        </section>
        <section className="space-y-2">
          <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">{labels.custom}</h3>
          <CrsPicker defaultValue="EPSG:4326" extraItems={extraItems} labels={labels.picker} />
        </section>
      </div>
      <section className="space-y-3">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {labels.controlled}
        </h3>
        <CrsPicker
          value={value}
          onChange={handleChange}
          extraItems={coreItems}
          labels={labels.picker}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            data-demo-action="crs-picker-switch-3857"
            className="border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-muted"
            onClick={() => handleChange("EPSG:3857")}
          >
            {labels.switch3857}
          </button>
          <button
            type="button"
            data-demo-action="crs-picker-switch-4326"
            className="border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-muted"
            onClick={() => handleChange("EPSG:4326")}
          >
            {labels.switch4326}
          </button>
        </div>
        <div className="min-h-[84px] space-y-0.5 border border-border bg-card p-2">
          <p className="mb-1 font-mono text-[10px] text-muted-foreground">{labels.logTitle}</p>
          {log.length === 0 ? (
            <p className="font-mono text-[10px] text-muted-foreground">{labels.emptyLog}</p>
          ) : (
            log.map((entry) => (
              <p key={entry} className="font-mono text-[10px] text-foreground">
                {entry}
              </p>
            ))
          )}
        </div>
        <p data-demo-status="crs-picker" className="m-0 text-xs text-muted-foreground">
          {labels.current}: <code className="font-mono text-[11px]">{value}</code>
        </p>
      </section>
    </div>
  )
}

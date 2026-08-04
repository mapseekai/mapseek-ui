import { type CrsItem, CrsPicker } from "@registry/blocks/crs-picker"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    subset: "限定内置条目",
    custom: "追加与覆盖条目",
    controlled: "受控模式",
    switch3857: "外部切换 3857",
    switch4326: "外部切换 4326",
    logTitle: "回调日志",
    emptyLog: "-",
    current: "当前",
    changed: "已切换",
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
    ] satisfies CrsItem[],
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
  },
  en: {
    subset: "Allowed built-ins",
    custom: "Extra and override items",
    controlled: "Controlled mode",
    switch3857: "Switch to 3857",
    switch4326: "Switch to 4326",
    logTitle: "Callback log",
    emptyLog: "-",
    current: "Current",
    changed: "Changed",
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
    ] satisfies CrsItem[],
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
  },
}

export function CrsPickerDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [value, setValue] = useState("EPSG:4326")
  const [log, setLog] = useState<string[]>([])
  const extraItems = demoLabels.extraItems.map((item) => ({ ...item }))

  const handleChange = (epsg: string) => {
    setValue(epsg)
    setLog((current) => [`onChange("${epsg}")`, ...current].slice(0, 6))
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-5">
        <section className="space-y-2">
          <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
            {demoLabels.subset}
          </h3>
          <CrsPicker
            defaultValue="EPSG:4326"
            allowedEpsgs={["EPSG:4326", "EPSG:4490", "EPSG:3857"]}
            labels={demoLabels.picker}
          />
        </section>
        <section className="space-y-2">
          <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
            {demoLabels.custom}
          </h3>
          <CrsPicker defaultValue="EPSG:4326" extraItems={extraItems} labels={demoLabels.picker} />
        </section>
      </div>
      <section className="space-y-3">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.controlled}
        </h3>
        <CrsPicker value={value} onChange={handleChange} labels={demoLabels.picker} />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            data-demo-action="crs-picker-switch-3857"
            variant="outline"
            size="xs"
            onClick={() => handleChange("EPSG:3857")}
          >
            {demoLabels.switch3857}
          </Button>
          <Button
            type="button"
            data-demo-action="crs-picker-switch-4326"
            variant="outline"
            size="xs"
            onClick={() => handleChange("EPSG:4326")}
          >
            {demoLabels.switch4326}
          </Button>
        </div>
        <div className="min-h-[84px] space-y-0.5 border border-border bg-card p-2">
          <p className="mb-1 font-mono text-[10px] text-muted-foreground">{demoLabels.logTitle}</p>
          {log.length === 0 ? (
            <p className="font-mono text-[10px] text-muted-foreground">{demoLabels.emptyLog}</p>
          ) : (
            log.map((entry) => (
              <p key={entry} className="font-mono text-[10px] text-foreground">
                {entry}
              </p>
            ))
          )}
        </div>
        <p data-demo-status="crs-picker" className="m-0 text-xs text-muted-foreground">
          {demoLabels.current}: <code className="font-mono text-[11px]">{value}</code>
        </p>
      </section>
    </div>
  )
}

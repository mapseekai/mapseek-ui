import { Select } from "@registry/ui/select"
import { useState } from "react"
import { useLocaleLabels } from "../use-locale-labels"

export type SelectOverviewDemoLabels = {
  readonly controlled: string
  readonly crsAriaLabel: string
  readonly selectCrs: string
  readonly value: (value: string) => string
  readonly none: string
  readonly preselected: string
  readonly defaultFormatAriaLabel: string
  readonly selectFormat: string
  readonly small: string
  readonly smallFormatAriaLabel: string
  readonly disabled: string
  readonly disabledSelectAriaLabel: string
  readonly select: string
  readonly optionOne: string
  readonly optionTwo: string
}

export const zhSelectOverviewLabels = {
  controlled: "受控",
  crsAriaLabel: "坐标参考系统",
  selectCrs: "选择 CRS...",
  value: (value: string) => `当前值：${value}`,
  none: "无",
  preselected: "预选",
  defaultFormatAriaLabel: "默认格式",
  selectFormat: "选择格式...",
  small: "小尺寸",
  smallFormatAriaLabel: "小尺寸格式",
  disabled: "禁用",
  disabledSelectAriaLabel: "禁用选择",
  select: "选择...",
  optionOne: "选项 1",
  optionTwo: "选项 2",
} satisfies SelectOverviewDemoLabels

export const enSelectOverviewLabels = {
  controlled: "Controlled",
  crsAriaLabel: "Coordinate reference system",
  selectCrs: "Select CRS...",
  value: (value: string) => `Value: ${value}`,
  none: "none",
  preselected: "Preselected",
  defaultFormatAriaLabel: "Default format",
  selectFormat: "Select format...",
  small: "Small",
  smallFormatAriaLabel: "Small format",
  disabled: "Disabled",
  disabledSelectAriaLabel: "Disabled select",
  select: "Select...",
  optionOne: "Option 1",
  optionTwo: "Option 2",
} satisfies SelectOverviewDemoLabels

export function SelectOverviewDemo({ labels }: { readonly labels?: SelectOverviewDemoLabels }) {
  const [value, setValue] = useState("")
  const localizedLabels = useLocaleLabels({
    zh: zhSelectOverviewLabels,
    en: enSelectOverviewLabels,
  })
  const demoLabels = labels ?? localizedLabels

  return (
    <div className="grid gap-8" data-demo="select-overview">
      <section className="space-y-3" data-demo="select-controlled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.controlled}
        </h4>
        <div className="max-w-xs">
          <Select
            aria-label={demoLabels.crsAriaLabel}
            placeholder={demoLabels.selectCrs}
            value={value}
            onValueChange={setValue}
          >
            <Select.Item value="4326">EPSG:4326 - WGS 84</Select.Item>
            <Select.Item value="3857">EPSG:3857 - Web Mercator</Select.Item>
            <Select.Item value="4490">EPSG:4490 - CGCS2000</Select.Item>
            <Select.Item value="2154">EPSG:2154 - France Lambert 93</Select.Item>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground" data-demo="select-value">
          {demoLabels.value(value || demoLabels.none)}
        </p>
      </section>

      <section className="space-y-3" data-demo="select-default">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.preselected}
        </h4>
        <div className="max-w-xs">
          <Select
            aria-label={demoLabels.defaultFormatAriaLabel}
            placeholder={demoLabels.selectFormat}
            defaultValue="geojson"
          >
            <Select.Item value="geojson">GeoJSON</Select.Item>
            <Select.Item value="topojson">TopoJSON</Select.Item>
            <Select.Item value="shapefile">Shapefile</Select.Item>
            <Select.Item value="kml">KML</Select.Item>
          </Select>
        </div>
      </section>

      <section className="space-y-3" data-demo="select-small">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.small}
        </h4>
        <div className="max-w-xs">
          <Select
            aria-label={demoLabels.smallFormatAriaLabel}
            placeholder={demoLabels.selectFormat}
            defaultValue="geojson"
            size="sm"
          >
            <Select.Item value="geojson">GeoJSON</Select.Item>
            <Select.Item value="topojson">TopoJSON</Select.Item>
            <Select.Item value="shapefile">Shapefile</Select.Item>
          </Select>
        </div>
      </section>

      <section className="space-y-3" data-demo="select-disabled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {demoLabels.disabled}
        </h4>
        <div className="max-w-xs">
          <Select
            aria-label={demoLabels.disabledSelectAriaLabel}
            placeholder={demoLabels.select}
            disabled
          >
            <Select.Item value="opt1">{demoLabels.optionOne}</Select.Item>
            <Select.Item value="opt2">{demoLabels.optionTwo}</Select.Item>
          </Select>
        </div>
      </section>
    </div>
  )
}

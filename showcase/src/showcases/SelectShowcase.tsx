import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@registry/ui/select"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
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
  },
  en: {
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
  },
}

export function SelectOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [value, setValue] = useState("")
  const demoLabels = labels[locale]

  return (
    <div className="grid w-full max-w-xs gap-8">
      <section className="space-y-3" data-demo="select-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.controlled}
        </h4>
        <div className="max-w-xs">
          <Select
            value={value}
            onValueChange={(nextValue) => nextValue != null && setValue(nextValue)}
          >
            <SelectTrigger aria-label={demoLabels.crsAriaLabel}>
              <SelectValue placeholder={demoLabels.selectCrs} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="4326">EPSG:4326 - WGS 84</SelectItem>
                <SelectItem value="3857">EPSG:3857 - Web Mercator</SelectItem>
                <SelectItem value="4490">EPSG:4490 - CGCS2000</SelectItem>
                <SelectItem value="2154">EPSG:2154 - France Lambert 93</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground" data-demo="select-value">
          {demoLabels.value(value || demoLabels.none)}
        </p>
      </section>

      <section className="space-y-3" data-demo="select-default">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.preselected}
        </h4>
        <div className="max-w-xs">
          <Select defaultValue="geojson">
            <SelectTrigger aria-label={demoLabels.defaultFormatAriaLabel}>
              <SelectValue placeholder={demoLabels.selectFormat} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="geojson">GeoJSON</SelectItem>
                <SelectItem value="topojson">TopoJSON</SelectItem>
                <SelectItem value="shapefile">Shapefile</SelectItem>
                <SelectItem value="kml">KML</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="space-y-3" data-demo="select-small">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.small}
        </h4>
        <div className="max-w-xs">
          <Select defaultValue="geojson">
            <SelectTrigger size="sm" aria-label={demoLabels.smallFormatAriaLabel}>
              <SelectValue placeholder={demoLabels.selectFormat} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="geojson">GeoJSON</SelectItem>
                <SelectItem value="topojson">TopoJSON</SelectItem>
                <SelectItem value="shapefile">Shapefile</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="space-y-3" data-demo="select-disabled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.disabled}
        </h4>
        <div className="max-w-xs">
          <Select disabled>
            <SelectTrigger aria-label={demoLabels.disabledSelectAriaLabel}>
              <SelectValue placeholder={demoLabels.select} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="opt1">{demoLabels.optionOne}</SelectItem>
                <SelectItem value="opt2">{demoLabels.optionTwo}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>
    </div>
  )
}

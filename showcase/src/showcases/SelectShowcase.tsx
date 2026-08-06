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
    sizes: "尺寸变体",
    sizeAriaLabel: (size: string) => `${size} 尺寸格式`,
    widths: "宽度变体",
    fixedWidth: "固定宽度（默认）",
    contentWidth: "跟随选中内容",
    widthAriaLabel: (width: string) => `${width} 宽度格式`,
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
    sizes: "Sizes",
    sizeAriaLabel: (size: string) => `${size} format`,
    widths: "Widths",
    fixedWidth: "Fixed width (default)",
    contentWidth: "Fit selected content",
    widthAriaLabel: (width: string) => `${width} width format`,
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
          {demoLabels.sizes}
        </h4>
        <div className="grid max-w-xs gap-2">
          {(["xs", "sm", "default", "lg"] as const).map((size) => (
            <Select key={size} defaultValue="geojson">
              <SelectTrigger
                size={size}
                width="content"
                aria-label={demoLabels.sizeAriaLabel(size)}
              >
                <SelectValue placeholder={demoLabels.selectFormat} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="geojson">GeoJSON</SelectItem>
                  <SelectItem value="topojson">TopoJSON</SelectItem>
                  <SelectItem value="shapefile">Shapefile</SelectItem>
                  <SelectItem value="cloud-optimized-geotiff">Cloud Optimized GeoTIFF</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ))}
        </div>
      </section>

      <section className="space-y-3" data-demo="select-widths">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.widths}
        </h4>
        <div className="grid max-w-xs gap-3">
          {(["fixed", "content"] as const).map((width) => (
            <div key={width} className="grid gap-1.5">
              <span className="text-xs text-muted-foreground">
                {width === "fixed" ? demoLabels.fixedWidth : demoLabels.contentWidth}
              </span>
              <Select defaultValue="geojson">
                <SelectTrigger
                  width={width === "content" ? "content" : undefined}
                  aria-label={demoLabels.widthAriaLabel(width)}
                >
                  <SelectValue placeholder={demoLabels.selectFormat} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="geojson">GeoJSON</SelectItem>
                    <SelectItem value="cloud-optimized-geotiff">Cloud Optimized GeoTIFF</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
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

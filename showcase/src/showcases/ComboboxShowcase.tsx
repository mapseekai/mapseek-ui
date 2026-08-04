import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@registry/ui/combobox"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const formats = [
  { value: "geojson", label: "GeoJSON" },
  { value: "topojson", label: "TopoJSON" },
  { value: "shapefile", label: "Shapefile" },
  { value: "kml", label: "KML" },
  { value: "gpx", label: "GPX" },
  { value: "csv", label: "CSV" },
] as const
const crsList = [
  { value: "4326", label: "EPSG:4326 - WGS 84" },
  { value: "3857", label: "EPSG:3857 - Web Mercator" },
  { value: "4490", label: "EPSG:4490 - CGCS2000" },
  { value: "2154", label: "EPSG:2154 - France Lambert 93" },
] as const
const labels = {
  "zh-CN": {
    searchableFormat: "可搜索格式",
    selectFormat: "选择格式",
    selectFormatPlaceholder: "选择格式...",
    noFormatsFound: "未找到格式。",
    value: (value: string) => `当前值：${value}`,
    none: "无",
    crsPicker: "CRS 选择器",
    searchCrs: "搜索 CRS",
    searchCrsPlaceholder: "搜索 CRS...",
    noCrsFound: "未找到 CRS。",
  },
  en: {
    searchableFormat: "Searchable format",
    selectFormat: "Select format",
    selectFormatPlaceholder: "Select format...",
    noFormatsFound: "No formats found.",
    value: (value: string) => `Value: ${value}`,
    none: "none",
    crsPicker: "CRS picker",
    searchCrs: "Search CRS",
    searchCrsPlaceholder: "Search CRS...",
    noCrsFound: "No CRS found.",
  },
}

export function ComboboxOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [formatValue, setFormatValue] = useState("")
  const [crsValue, setCrsValue] = useState("")
  const demoLabels = labels[locale]
  const normalizedFormat = formatValue.toLowerCase()
  const normalizedCrs = crsValue.toLowerCase()
  const filteredFormats = normalizedFormat
    ? formats.filter((format) => format.label.toLowerCase().includes(normalizedFormat))
    : formats
  const filteredCrs = normalizedCrs
    ? crsList.filter((crs) => crs.label.toLowerCase().includes(normalizedCrs))
    : crsList
  return (
    <div className="mx-auto grid w-full max-w-xs gap-8">
      <section className="min-w-0 space-y-3" data-demo="combobox-format">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.searchableFormat}
        </h4>
        <Combobox
          value={formatValue}
          onValueChange={(value: string | null) => setFormatValue(value ?? "")}
        >
          <ComboboxInput
            aria-label={demoLabels.selectFormat}
            className="w-[calc(100%-4px)] max-w-xs"
            placeholder={demoLabels.selectFormatPlaceholder}
            showTrigger
            showClear={formatValue.length > 0}
          />
          <ComboboxContent>
            <ComboboxList>
              {filteredFormats.map((format) => (
                <ComboboxItem key={format.value} value={format.value}>
                  {format.label}
                </ComboboxItem>
              ))}
              <ComboboxEmpty>{demoLabels.noFormatsFound}</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <p className="text-xs text-muted-foreground" data-demo="combobox-format-value">
          {demoLabels.value(formatValue || demoLabels.none)}
        </p>
      </section>
      <section className="min-w-0 space-y-3" data-demo="combobox-crs">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.crsPicker}
        </h4>
        <Combobox
          value={crsValue}
          onValueChange={(value: string | null) => setCrsValue(value ?? "")}
        >
          <ComboboxInput
            aria-label={demoLabels.searchCrs}
            className="w-[calc(100%-4px)] max-w-xs"
            placeholder={demoLabels.searchCrsPlaceholder}
            showTrigger
            showClear={crsValue.length > 0}
          />
          <ComboboxContent>
            <ComboboxList>
              {filteredCrs.map((crs) => (
                <ComboboxItem key={crs.value} value={crs.value}>
                  {crs.label}
                </ComboboxItem>
              ))}
              <ComboboxEmpty>{demoLabels.noCrsFound}</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </section>
    </div>
  )
}

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@registry/ui/combobox"
import { useState } from "react"

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

export function ComboboxOverviewDemo() {
  const [formatValue, setFormatValue] = useState("")
  const [crsValue, setCrsValue] = useState("")
  const normalizedFormat = formatValue.toLowerCase()
  const normalizedCrs = crsValue.toLowerCase()
  const filteredFormats = normalizedFormat
    ? formats.filter((format) => format.label.toLowerCase().includes(normalizedFormat))
    : formats
  const filteredCrs = normalizedCrs
    ? crsList.filter((crs) => crs.label.toLowerCase().includes(normalizedCrs))
    : crsList

  return (
    <div className="grid max-w-full gap-8" data-demo="combobox-overview">
      <section className="min-w-0 space-y-3" data-demo="combobox-format">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Searchable format
        </h4>
        <Combobox
          value={formatValue}
          onValueChange={(value: string | null) => setFormatValue(value ?? "")}
        >
          <ComboboxInput
            aria-label="Select format"
            className="w-[calc(100%-4px)] max-w-xs"
            placeholder="Select format..."
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
              <ComboboxEmpty>No formats found.</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <p className="text-xs text-muted-foreground" data-demo="combobox-format-value">
          Value: {formatValue || "none"}
        </p>
      </section>

      <section className="min-w-0 space-y-3" data-demo="combobox-crs">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          CRS picker
        </h4>
        <Combobox
          value={crsValue}
          onValueChange={(value: string | null) => setCrsValue(value ?? "")}
        >
          <ComboboxInput
            aria-label="Search CRS"
            className="w-[calc(100%-4px)] max-w-xs"
            placeholder="Search CRS..."
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
              <ComboboxEmpty>No CRS found.</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </section>
    </div>
  )
}

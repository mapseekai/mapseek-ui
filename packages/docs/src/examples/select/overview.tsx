import { Select } from "@registry/ui/select"
import { useState } from "react"

export function SelectOverviewDemo() {
  const [value, setValue] = useState("")

  return (
    <div className="grid gap-8" data-demo="select-overview">
      <section className="space-y-3" data-demo="select-controlled">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Controlled
        </h4>
        <div className="max-w-xs">
          <Select
            aria-label="Coordinate reference system"
            placeholder="Select CRS..."
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
          Value: {value || "none"}
        </p>
      </section>

      <section className="space-y-3" data-demo="select-default">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Preselected
        </h4>
        <div className="max-w-xs">
          <Select aria-label="Default format" placeholder="Select format..." defaultValue="geojson">
            <Select.Item value="geojson">GeoJSON</Select.Item>
            <Select.Item value="topojson">TopoJSON</Select.Item>
            <Select.Item value="shapefile">Shapefile</Select.Item>
            <Select.Item value="kml">KML</Select.Item>
          </Select>
        </div>
      </section>

      <section className="space-y-3" data-demo="select-small">
        <h4 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Small</h4>
        <div className="max-w-xs">
          <Select
            aria-label="Small format"
            placeholder="Select format..."
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
          Disabled
        </h4>
        <div className="max-w-xs">
          <Select aria-label="Disabled select" placeholder="Select..." disabled>
            <Select.Item value="opt1">Option 1</Select.Item>
            <Select.Item value="opt2">Option 2</Select.Item>
          </Select>
        </div>
      </section>
    </div>
  )
}

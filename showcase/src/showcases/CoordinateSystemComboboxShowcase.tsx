import {
  CoordinateSystemCombobox,
  type CoordinateSystemItem,
} from "@registry/blocks/coordinate-system-combobox"
import { useState } from "react"

import type { LocalizedDemoProps } from "./types"

const extraItems = [
  {
    epsg: "EPSG:32650",
    name: "WGS 84 / UTM zone 50N",
    kind: "projected",
  },
  {
    epsg: "EPSG:4491",
    name: "CGCS2000 / Gauss-Kruger zone 13 (project override)",
    kind: "projected",
  },
] satisfies CoordinateSystemItem[]

const labels = {
  "zh-CN": {
    controlled: "受控选择",
    extra: "追加与覆盖条目",
    combobox: {
      inputLabel: "坐标系",
      searchPlaceholder: "搜索 EPSG 或名称",
      geographic: "球面坐标系",
      projected: "平面坐标系",
      noResults: "未找到匹配的坐标系",
    },
  },
  en: {
    controlled: "Controlled selection",
    extra: "Append and override items",
    combobox: {
      inputLabel: "Coordinate system",
      searchPlaceholder: "Search EPSG or name",
      geographic: "Geographic coordinate systems",
      projected: "Projected coordinate systems",
      noResults: "No matching coordinate systems",
    },
  },
}

export function CoordinateSystemComboboxDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [value, setValue] = useState<string | null>("EPSG:4490")

  return (
    <div className="mx-auto grid w-full max-w-xs gap-8">
      <section className="min-w-0 space-y-3">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.controlled}
        </h3>
        <CoordinateSystemCombobox
          value={value}
          onValueChange={setValue}
          labels={demoLabels.combobox}
        />
      </section>
      <section className="min-w-0 space-y-3">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.extra}
        </h3>
        <CoordinateSystemCombobox
          defaultValue="EPSG:4491"
          extraItems={extraItems}
          labels={demoLabels.combobox}
        />
      </section>
    </div>
  )
}

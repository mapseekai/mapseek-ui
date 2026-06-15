import type { CrsItem } from "./types"

export const DEFAULT_CRS_ITEMS: CrsItem[] = [
  { epsg: "EPSG:4326", name: "WGS 84", description: "全球通用 · 经纬度", kind: "geographic" },
  { epsg: "EPSG:4490", name: "CGCS2000", description: "国测 · 经纬度", kind: "geographic" },
  { epsg: "EPSG:4214", name: "Beijing 1954", description: "北京54 · 历史", kind: "geographic" },
  { epsg: "EPSG:4610", name: "Xian 1980", description: "西安80 · 历史", kind: "geographic" },
  { epsg: "EPSG:3857", name: "Web Mercator", description: "切片底图 · 米", kind: "projected" },
]

/**
 * Merge built-in list with caller options.
 * allowedEpsgs filters built-in (but never filters extraItems).
 * extraItems overrides built-in entries with the same epsg.
 */
export function buildCrsList(allowedEpsgs?: string[], extraItems?: CrsItem[]): CrsItem[] {
  const base = allowedEpsgs
    ? DEFAULT_CRS_ITEMS.filter((i) => allowedEpsgs.includes(i.epsg))
    : DEFAULT_CRS_ITEMS

  const map = new Map(base.map((i) => [i.epsg, i]))
  extraItems?.forEach((i) => map.set(i.epsg, i))

  return [...map.values()]
}

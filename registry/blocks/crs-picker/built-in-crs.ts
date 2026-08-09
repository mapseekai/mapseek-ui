import type { CrsItem } from "./types"

function createDefaultCrsItems(): CrsItem[] {
  return [
    {
      epsg: "EPSG:4326",
      name: "WGS 84",
      kind: "geographic",
    },
    {
      epsg: "EPSG:4490",
      name: "CGCS2000",
      kind: "geographic",
    },
    {
      epsg: "EPSG:4214",
      name: "Beijing 1954",
      kind: "geographic",
    },
    {
      epsg: "EPSG:4610",
      name: "Xian 1980",
      kind: "geographic",
    },
    {
      epsg: "EPSG:3857",
      name: "Web Mercator",
      kind: "projected",
    },
  ]
}

export const DEFAULT_CRS_ITEMS = createDefaultCrsItems()

/**
 * Merge built-in list with caller options.
 * allowedEpsgs filters built-in (but never filters extraItems).
 * extraItems overrides built-in entries with the same epsg.
 */
export function buildCrsList(allowedEpsgs?: string[], extraItems?: CrsItem[]): CrsItem[] {
  const defaultItems = createDefaultCrsItems()
  const base = allowedEpsgs
    ? defaultItems.filter((i) => allowedEpsgs.includes(i.epsg))
    : defaultItems

  const map = new Map(base.map((i) => [i.epsg, i]))
  extraItems?.forEach((i) => {
    map.set(i.epsg, i)
  })

  return Array.from(map.values())
}

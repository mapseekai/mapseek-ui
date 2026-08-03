import { DEFAULT_CRS_PICKER_LABELS } from "./defaults"
import type { CrsItem } from "./types"

function createDefaultCrsItems(labels: typeof DEFAULT_CRS_PICKER_LABELS): CrsItem[] {
  return [
    {
      epsg: "EPSG:4326",
      name: "WGS 84",
      description: labels.wgs84Description,
      kind: "geographic",
    },
    {
      epsg: "EPSG:4490",
      name: "CGCS2000",
      description: labels.cgcs2000Description,
      kind: "geographic",
    },
    {
      epsg: "EPSG:4214",
      name: "Beijing 1954",
      description: labels.beijing1954Description,
      kind: "geographic",
    },
    {
      epsg: "EPSG:4610",
      name: "Xian 1980",
      description: labels.xian1980Description,
      kind: "geographic",
    },
    {
      epsg: "EPSG:3857",
      name: "Web Mercator",
      description: labels.webMercatorDescription,
      kind: "projected",
    },
  ]
}

export const DEFAULT_CRS_ITEMS = createDefaultCrsItems(DEFAULT_CRS_PICKER_LABELS)

/**
 * Merge built-in list with caller options.
 * allowedEpsgs filters built-in (but never filters extraItems).
 * extraItems overrides built-in entries with the same epsg.
 */
export function buildCrsList(
  allowedEpsgs?: string[],
  extraItems?: CrsItem[],
  labels = DEFAULT_CRS_PICKER_LABELS,
): CrsItem[] {
  const defaultItems = createDefaultCrsItems(labels)
  const base = allowedEpsgs
    ? defaultItems.filter((i) => allowedEpsgs.includes(i.epsg))
    : defaultItems

  const map = new Map(base.map((i) => [i.epsg, i]))
  extraItems?.forEach((i) => {
    map.set(i.epsg, i)
  })

  return Array.from(map.values())
}

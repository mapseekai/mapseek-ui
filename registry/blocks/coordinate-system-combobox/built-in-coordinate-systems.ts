import type { CoordinateSystemItem } from "./types"

function createCgcs2000SixDegreeZones(): CoordinateSystemItem[] {
  return Array.from({ length: 11 }, (_, index) => {
    const zone = index + 13

    return {
      epsg: `EPSG:${4491 + index}`,
      name: `CGCS2000 / Gauss-Kruger zone ${zone}`,
      kind: "projected",
    }
  })
}

function createCgcs2000ThreeDegreeZones(): CoordinateSystemItem[] {
  return Array.from({ length: 21 }, (_, index) => {
    const zone = index + 25

    return {
      epsg: `EPSG:${4513 + index}`,
      name: `CGCS2000 / 3-degree Gauss-Kruger zone ${zone}`,
      kind: "projected",
    }
  })
}

export const DEFAULT_COORDINATE_SYSTEM_ITEMS: CoordinateSystemItem[] = [
  { epsg: "EPSG:4326", name: "WGS 84", kind: "geographic" },
  { epsg: "EPSG:4490", name: "CGCS2000", kind: "geographic" },
  { epsg: "EPSG:4214", name: "Beijing 1954", kind: "geographic" },
  { epsg: "EPSG:4610", name: "Xian 1980", kind: "geographic" },
  { epsg: "EPSG:3857", name: "Web Mercator", kind: "projected" },
  ...createCgcs2000SixDegreeZones(),
  ...createCgcs2000ThreeDegreeZones(),
]

export function buildCoordinateSystemList(
  extraItems: CoordinateSystemItem[] = [],
): CoordinateSystemItem[] {
  const itemsByEpsg = new Map(DEFAULT_COORDINATE_SYSTEM_ITEMS.map((item) => [item.epsg, item]))

  for (const item of extraItems) itemsByEpsg.set(item.epsg, item)

  return Array.from(itemsByEpsg.values())
}

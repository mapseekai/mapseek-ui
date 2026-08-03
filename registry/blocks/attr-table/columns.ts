import type { ColumnDef } from "./types"

const GEOMETRY_RAW_TYPES = new Set([
  "geometry",
  "geography",
  "wkb",
  "wkt",
  "point",
  "polygon",
  "linestring",
  "multipoint",
  "multipolygon",
  "multilinestring",
  "geometrycollection",
])

export function isGeometryColumn(rawType: string): boolean {
  if (!rawType) return false
  const head = rawType.toLowerCase().trim().split(/[\s(]/)[0] ?? ""
  return GEOMETRY_RAW_TYPES.has(head)
}

export function attributeColumns(schema: Record<string, string>): ColumnDef[] {
  return Object.entries(schema)
    .filter(([, rawType]) => !isGeometryColumn(rawType))
    .map(([name, rawType]) => ({ name, rawType }))
}

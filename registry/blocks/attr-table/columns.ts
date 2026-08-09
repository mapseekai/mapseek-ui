import type { TagColor } from "@/components/ui/tag"
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

const TEXT_RAW_TYPES = new Set(["char", "citext", "string", "text", "uuid", "varchar"])

const NUMBER_RAW_TYPES = new Set([
  "bigint",
  "bigserial",
  "decimal",
  "double",
  "float",
  "float4",
  "float8",
  "int",
  "int2",
  "int4",
  "int8",
  "integer",
  "numeric",
  "real",
  "serial",
  "smallint",
  "smallserial",
])

const BOOLEAN_RAW_TYPES = new Set(["bool", "boolean"])

const TEMPORAL_RAW_TYPES = new Set([
  "date",
  "interval",
  "time",
  "timestamp",
  "timestamptz",
  "timetz",
])

const STRUCTURED_RAW_TYPES = new Set(["array", "json", "jsonb", "object", "record"])

const RAW_TYPE_TAG_COLORS = {
  text: "green",
  number: "purple",
  boolean: "blue",
  temporal: "yellow",
  structured: "orange",
  unknown: "gray",
} as const satisfies Record<string, TagColor>

function rawTypeHead(rawType: string): string {
  return (
    rawType
      .toLowerCase()
      .trim()
      .split(/[\s([\]]/)[0] ?? ""
  )
}

export function rawTypeTagColor(rawType: string): TagColor {
  const head = rawTypeHead(rawType)

  if (TEXT_RAW_TYPES.has(head)) return RAW_TYPE_TAG_COLORS.text
  if (NUMBER_RAW_TYPES.has(head)) return RAW_TYPE_TAG_COLORS.number
  if (BOOLEAN_RAW_TYPES.has(head)) return RAW_TYPE_TAG_COLORS.boolean
  if (TEMPORAL_RAW_TYPES.has(head)) return RAW_TYPE_TAG_COLORS.temporal
  if (STRUCTURED_RAW_TYPES.has(head)) return RAW_TYPE_TAG_COLORS.structured
  return RAW_TYPE_TAG_COLORS.unknown
}

export function isGeometryColumn(rawType: string): boolean {
  if (!rawType) return false
  const head = rawTypeHead(rawType)
  return GEOMETRY_RAW_TYPES.has(head)
}

export function attributeColumns(schema: Record<string, string>): ColumnDef[] {
  return Object.entries(schema)
    .filter(([, rawType]) => !isGeometryColumn(rawType))
    .map(([name, rawType]) => ({ name, rawType }))
}

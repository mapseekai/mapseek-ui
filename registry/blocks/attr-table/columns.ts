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

const RAW_TYPE_BADGE_CLASSES = {
  text: "border-cat-1/30 bg-cat-1/10 text-cat-1",
  number: "border-cat-5/30 bg-cat-5/10 text-cat-5",
  boolean: "border-cat-2/30 bg-cat-2/10 text-cat-2",
  temporal: "border-cat-3/30 bg-cat-3/10 text-cat-3",
  structured: "border-cat-4/30 bg-cat-4/10 text-cat-4",
  unknown: "border-border bg-muted/50 text-muted-foreground",
} as const

function rawTypeHead(rawType: string): string {
  return (
    rawType
      .toLowerCase()
      .trim()
      .split(/[\s([\]]/)[0] ?? ""
  )
}

export function rawTypeBadgeClass(rawType: string): string {
  const head = rawTypeHead(rawType)

  if (TEXT_RAW_TYPES.has(head)) return RAW_TYPE_BADGE_CLASSES.text
  if (NUMBER_RAW_TYPES.has(head)) return RAW_TYPE_BADGE_CLASSES.number
  if (BOOLEAN_RAW_TYPES.has(head)) return RAW_TYPE_BADGE_CLASSES.boolean
  if (TEMPORAL_RAW_TYPES.has(head)) return RAW_TYPE_BADGE_CLASSES.temporal
  if (STRUCTURED_RAW_TYPES.has(head)) return RAW_TYPE_BADGE_CLASSES.structured
  return RAW_TYPE_BADGE_CLASSES.unknown
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

import type { AttrFieldKind } from "./types"

/**
 * Heuristically classify an attribute field from its name + sample value.
 *
 * Enum is intentionally NOT inferred here — a field only renders as a
 * Select when the caller supplies `enumOptions` in its `AttrFieldMeta`,
 * so this stays free of any domain-specific enum vocabulary.
 */
export function inferAttrFieldKind(name: string, value: unknown): AttrFieldKind {
  const lc = name.toLowerCase()
  if (/^(fid|id|_id|uuid)$/i.test(name)) return "id"
  const isDate =
    /date|time|updated|created|modified|at$/i.test(lc) ||
    (typeof value === "string" && /^\d{4}[/-]\d{1,2}[/-]\d{1,2}/.test(value))
  if (isDate) return "date"
  const isNum =
    typeof value === "number" ||
    /^(area|length|width|height|count|num|qty|price|score|.*_m2|.*_km|.*_mm)$/i.test(
      lc,
    )
  if (isNum) return "number"
  if (lc === "code") return "code"
  return "text"
}

import type { SchemaFormField } from "./types"

function isFieldValid(field: SchemaFormField, value: unknown): boolean {
  if (field.type === "multiselect") {
    if (value === undefined || value === null) {
      return !field.required && field.min === undefined
    }
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) return false
    return value.length >= (field.min ?? (field.required ? 1 : 0))
  }

  if (field.type === "number") {
    if (value === undefined || value === null || value === "") return !field.required
    if (typeof value !== "number" || !Number.isFinite(value)) return false
    if (field.min !== undefined && value < field.min) return false
    if (field.max !== undefined && value > field.max) return false
    return true
  }

  if (value === undefined || value === null || value === "") return !field.required
  return typeof value === "string"
}

/** True when every required field has a usable value. */
export function isSchemaFormValid(
  fields: SchemaFormField[],
  values: Record<string, unknown>,
): boolean {
  return fields.every((field) => isFieldValid(field, values[field.key]))
}

/** Initial values built from each field's `default` (omitted fields stay unset). */
export function seedSchemaFormValues(fields: SchemaFormField[]): Record<string, unknown> {
  const init: Record<string, unknown> = {}
  for (const f of fields) if ("default" in f && f.default !== undefined) init[f.key] = f.default
  return init
}

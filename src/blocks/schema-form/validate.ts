import type { SchemaFormField } from "./types"

function isFilled(field: SchemaFormField, value: unknown): boolean {
  if (!field.required) return true
  if (field.type === "multiselect")
    return Array.isArray(value) && value.length >= (field.min ?? 1)
  if (field.type === "number")
    return typeof value === "number" && !Number.isNaN(value)
  return value !== undefined && value !== "" && value !== null
}

/** True when every required field has a usable value. */
export function isSchemaFormValid(
  fields: SchemaFormField[],
  values: Record<string, unknown>,
): boolean {
  return fields.every((f) => isFilled(f, values[f.key]))
}

/** Initial values built from each field's `default` (omitted fields stay unset). */
export function seedSchemaFormValues(
  fields: SchemaFormField[],
): Record<string, unknown> {
  const init: Record<string, unknown> = {}
  for (const f of fields)
    if ("default" in f && f.default !== undefined) init[f.key] = f.default
  return init
}

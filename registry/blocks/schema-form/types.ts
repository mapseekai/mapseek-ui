export interface SchemaFormOption {
  value: string
  label: string
}

export interface SchemaFormLabels {
  emptyOptions: string
}

type SchemaFormFieldBase = {
  key: string
  label: string
  required?: boolean
  name?: string
}

/**
 * Presentational field kinds. Domain field types (layer refs, field refs, CRS
 * inputs) are collapsed by the caller into these four — option resolution
 * stays in the wrapper, keeping the block domain-free.
 */
export type SchemaFormField =
  | (SchemaFormFieldBase & {
      type: "number"
      min?: number
      max?: number
      default?: number
      autoComplete?: string
    })
  | (SchemaFormFieldBase & {
      type: "text"
      placeholder?: string
      default?: string
      autoComplete?: string
      spellCheck?: boolean
    })
  | (SchemaFormFieldBase & {
      type: "select"
      options: SchemaFormOption[]
      placeholder?: string
      emptyHint?: string
      default?: string
    })
  | (SchemaFormFieldBase & {
      type: "multiselect"
      options: SchemaFormOption[]
      min?: number
      /** Shown inside the box when there are no options. */
      emptyHint?: string
    })

export interface SchemaFormProps {
  fields: SchemaFormField[]
  /** Current values, keyed by field key. Owned by the caller (seed via `seedSchemaFormValues`). */
  values: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  errors?: Readonly<Record<string, string | undefined>>
  labels?: SchemaFormLabels
  /** Optional stable override for the unique per-instance generated input id prefix. */
  idPrefix?: string
  className?: string
}

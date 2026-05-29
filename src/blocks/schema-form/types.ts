export interface SchemaFormOption {
  value: string
  label: string
}

/**
 * Presentational field kinds. Domain field types (layer refs, field refs, CRS
 * inputs) are collapsed by the caller into these four — option resolution
 * stays in the wrapper, keeping the block domain-free.
 */
export type SchemaFormField =
  | {
      key: string
      label: string
      required?: boolean
      type: "number"
      min?: number
      max?: number
      default?: number
    }
  | {
      key: string
      label: string
      required?: boolean
      type: "text"
      placeholder?: string
      default?: string
    }
  | {
      key: string
      label: string
      required?: boolean
      type: "select"
      options: SchemaFormOption[]
      placeholder?: string
      default?: string
    }
  | {
      key: string
      label: string
      required?: boolean
      type: "multiselect"
      options: SchemaFormOption[]
      min?: number
      /** Shown inside the box when there are no options. */
      emptyHint?: string
    }

export interface SchemaFormProps {
  fields: SchemaFormField[]
  /** Current values, keyed by field key. Owned by the caller (seed via `seedSchemaFormValues`). */
  values: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  /** Prefix for generated input ids (default "field"). */
  idPrefix?: string
  className?: string
}

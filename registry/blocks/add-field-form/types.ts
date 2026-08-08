import type { Icon as TablerIcon } from "@tabler/icons-react"

export type AddFieldType = "text" | "integer" | "float" | "boolean" | "date"

export type AddFieldDefaultValue = string | number | boolean | null

export interface FieldTypeOption {
  id: AddFieldType
  label: string
  icon: TablerIcon
}

export interface AddFieldValue {
  name: string
  type: AddFieldType
  defaultVal: AddFieldDefaultValue
  nullable: boolean
  desc: string
}

export interface AddFieldFormLabels {
  nameLabel: string
  namePlaceholder: string
  /** @deprecated Name helper text is no longer rendered. */
  nameHint?: string
  typeLabel: string
  defaultLabel: string
  booleanTrueLabel: string
  booleanFalseLabel: string
  nullableLabel: string
  descLabel: string
  descPlaceholder: string
}

export interface AddFieldFormProps {
  value: AddFieldValue
  onChange: (next: AddFieldValue) => void
  fieldTypes: FieldTypeOption[]
  labels: AddFieldFormLabels
  className?: string
}

export const EMPTY_ADD_FIELD: AddFieldValue = {
  name: "",
  type: "text",
  defaultVal: null,
  nullable: true,
  desc: "",
}

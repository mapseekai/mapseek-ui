import type { Icon as TablerIcon } from "@tabler/icons-react"

export interface FieldTypeOption {
  id: string
  label: string
  icon: TablerIcon
  /** When selected, the form reveals the enum-values input. */
  hasOptions?: boolean
  /** Placeholder shown in the default-value input for this type. */
  defaultPlaceholder?: string
}

export interface AddFieldValue {
  name: string
  type: string
  enumValues: string
  defaultVal: string
  nullable: boolean
  desc: string
}

export interface AddFieldFormLabels {
  nameLabel: string
  nameRequiredHint: string
  namePlaceholder: string
  nameHint: string
  typeLabel: string
  enumLabel: string
  enumOptionalHint: string
  enumPlaceholder: string
  defaultLabel: string
  defaultOptionalHint: string
  nullableLabel: string
  nullableHint: string
  descLabel: string
  descOptionalHint: string
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
  enumValues: "",
  defaultVal: "",
  nullable: true,
  desc: "",
}

export type AttrInspectorMode = "read" | "edit"

/** Inferred or declared rendering kind for an attribute field. */
export type AttrFieldKind = "id" | "date" | "number" | "code" | "text"

/**
 * Per-field overrides. Anything omitted falls back to inference from the
 * field name + value (see `inferAttrFieldKind`). Enum is opt-in only:
 * a field renders as a Select iff `enumOptions` is provided.
 */
export interface AttrFieldMeta {
  name: string
  kind?: AttrFieldKind
  /** Render value as read-only even in edit mode (e.g. primary key). */
  readOnly?: boolean
  enumOptions?: string[]
  /** Unit suffix shown inside the number input (e.g. "m²"). */
  unit?: string
}

export interface AttrInspectorFeature {
  id: string | number
  layer?: string
  properties: Record<string, unknown>
}

export interface AttrInspectorLabels {
  title: string
  /** Tooltip on the read-only lock icon. */
  primaryKey: string
  close: string
  addField: string
  delete: string
  viewGeoJSON: string
  cancel: string
  confirm: string
}

export interface AttrInspectorProps {
  /**
   * The single feature to inspect. Multi-selection is intentionally out of
   * scope — a dedicated picker should live above this panel.
   */
  feature: AttrInspectorFeature
  /** "edit" (default) renders editable inputs + confirm/cancel footer. */
  mode?: AttrInspectorMode
  /** Per-field overrides; fields not listed are inferred. */
  fields?: AttrFieldMeta[]
  /** Edit-mode overrides for the active feature, merged over its properties. */
  draft?: Record<string, unknown>
  onFieldChange?: (key: string, value: unknown) => void
  error?: string | null
  labels: AttrInspectorLabels
  /** Action buttons render only when their callback is supplied. */
  onAddField?: () => void
  onDelete?: () => void
  /** Non-mutating — shown in both read and edit modes. */
  onViewGeoJSON?: () => void
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
  className?: string
}

import type { ReactNode } from "react"

export interface AppTopBarLabels {
  /** aria-label on the back button (kept short for screen readers). */
  back: string
  /** Tooltip text for the back button; falls back to `back`. */
  backTooltip?: string
  /** Save button label. */
  save: string
}

export interface AppTopBarProps {
  /** Brand cluster (logo + name), rendered right after the back button. */
  brand?: ReactNode
  /** Current document / project name. */
  projectName: string
  /**
   * Save-status cluster (dot + pill + relative time), rendered after the
   * project name. App-owned: the copy is localized and the pill styling is
   * app-specific, which keeps this block i18n- and badge-style-free.
   */
  status?: ReactNode
  onBack: () => void
  onSave: () => void | Promise<void>
  /** Actions rendered immediately before the Save button. */
  beforeSaveActions?: ReactNode
  /** Actions rendered immediately after the Save button. */
  afterSaveActions?: ReactNode
  /** Far-right action cluster (e.g. history / snapshot controls). */
  endActions?: ReactNode
  labels: AppTopBarLabels
  className?: string
}

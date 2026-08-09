import type { ReactNode } from "react"

export type AppTopBarSize = "xs" | "sm" | "default" | "lg"

export interface AppTopBarLabels {
  /** aria-label on the back button (kept short for screen readers). */
  back: string
  /** Tooltip text for the back button; falls back to `back`. */
  backTooltip?: string
  /** Save button label. */
  save: string
}

export interface AppTopBarProps {
  /**
   * Toolbar density. `default` keeps the standard 48px desktop shell around
   * a 40px toolbar row.
   */
  size?: AppTopBarSize
  /** Brand cluster (logo + name), rendered right after the back button. */
  brand?: ReactNode
  /** Current document / project name. */
  projectName: string
  /**
   * Caller-owned save-status cluster (for example, a localized Tag), rendered
   * after the project name. The block does not prescribe status copy or style.
   */
  status?: ReactNode
  onBack: () => void
  onSave?: () => void | Promise<void>
  saveDisabled?: boolean
  savePending?: boolean
  /** Actions rendered immediately before the Save button. */
  beforeSaveActions?: ReactNode
  /** Actions rendered immediately after the Save button. */
  afterSaveActions?: ReactNode
  /**
   * Center action cluster rendered between status and before-save actions.
   * It reserves a middle desktop column; in the intermediate `md` range,
   * secondary brand and status context collapses before it can overlap.
   */
  centerActions?: ReactNode
  /** Far-right action cluster (e.g. history / snapshot controls). */
  endActions?: ReactNode
  labels: AppTopBarLabels
  className?: string
}

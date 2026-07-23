import type * as React from "react"

export type LayerGeometry = "point" | "polyline" | "polygon" | "mixed" | "raster"

export interface LayerData {
  readonly id: string
  readonly name: string
  readonly visible: boolean
  readonly geometryType: LayerGeometry
  readonly kind?: "service"
  readonly featureCount?: number
  readonly group?: string
  /** Caller-supplied transient flags. Read-only from the block's side. */
  readonly flags?: {
    readonly locked?: boolean
    readonly busy?: boolean
    readonly dirty?: boolean
  }
}

/**
 * Result of a group rename attempt. The block renders `message` inline and
 * keeps the rename editor open when `ok` is false.
 */
export type LayerPanelRenameResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly message: string }

export interface LayerPanelProps {
  readonly layers: readonly LayerData[]
  readonly groups?: readonly string[]
  readonly selectedId?: string | null
  readonly onSelectChange?: (id: string) => void | PromiseLike<void>
  readonly onVisibleChange?: (id: string, visible: boolean) => void
  /** Called with the complete ordered id list. Returned promises are awaited and contained. */
  readonly onReorder?: (order: readonly string[]) => void | PromiseLike<void>
  /** Returned promises are awaited and contained. */
  readonly onRemove?: (id: string) => void | PromiseLike<void>
  readonly onLocate?: (id: string) => void | PromiseLike<void>
  readonly onOpenTable?: (id: string) => void | PromiseLike<void>
  readonly onAddGroup?: () => void
  readonly onAddLayer?: () => void
  readonly onLayerGroupChange?: (id: string, group?: string) => void
  readonly onGroupRemove?: (group: string) => void
  /** Return a failed `LayerPanelRenameResult` to reject the rename inline. */
  readonly onGroupRename?: (
    group: string,
    next: string,
  ) => void | LayerPanelRenameResult | PromiseLike<void | LayerPanelRenameResult>
  /** Controlled collapsed state. Omit for uncontrolled (defaults to `defaultCollapsed`). */
  readonly collapsed?: boolean
  /** Initial collapsed state for uncontrolled mode. */
  readonly defaultCollapsed?: boolean
  readonly onCollapsedChange?: (collapsed: boolean) => void
  readonly className?: string
  readonly children: React.ReactNode
}

/**
 * Internal context value — exposed via `useLayerPanelContext()` / `useLayerItemContext()`
 * to the compound sub-components. NOT part of the public API.
 */
export interface LayerPanelContextValue {
  readonly layers: readonly LayerData[]
  readonly groups: readonly string[]
  readonly selectedId: string | null
  readonly onSelectChange: (id: string) => void | PromiseLike<void>
  readonly onVisibleChange?: (id: string, visible: boolean) => void
  readonly onReorder?: (order: readonly string[]) => void | PromiseLike<void>
  readonly onRemove?: (id: string) => void | PromiseLike<void>
  readonly onLocate?: (id: string) => void | PromiseLike<void>
  readonly onOpenTable?: (id: string) => void | PromiseLike<void>
  readonly onAddGroup?: () => void
  readonly onAddLayer?: () => void
  readonly onLayerGroupChange?: (id: string, group?: string) => void
  readonly onGroupRemove?: (group: string) => void
  readonly onGroupRename?: (
    group: string,
    next: string,
  ) => void | LayerPanelRenameResult | PromiseLike<void | LayerPanelRenameResult>
  readonly isSectionOpen: (layerId: string, sectionId: string) => boolean
  readonly toggleSection: (layerId: string, sectionId: string) => void
  readonly registerSectionDefault: (layerId: string, sectionId: string, open: boolean) => void
  readonly collapsed: boolean
  readonly toggleCollapsed: () => void
  /** Latest async-callback failure to surface in an accessible alert; null when clear. */
  readonly callbackError: string | null
  /**
   * Runs a panel operation (sync or PromiseLike-returning) with failure
   * containment: clears any prior error at start, routes sync throws and
   * rejections to the accessible alert, and ignores stale completions that
   * settle after a newer operation started or after unmount.
   */
  readonly runCallback: (operation: () => void | PromiseLike<void>, errorMessage: string) => void
}

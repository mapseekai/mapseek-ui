import type { Icon } from "@tabler/icons-react"

export type LoomToolbarTool = {
  readonly id: string
  readonly label: string
  readonly shortcut?: string
  readonly icon: Icon
  readonly editOnly?: boolean
}

export type LoomToolbarGroup = {
  readonly label: string
  readonly tools: readonly LoomToolbarTool[]
}

export type LoomToolbarLabels = {
  readonly startEditing: string
  readonly stopEditing: string
  readonly save: string
  readonly currentLayer: (name: string) => string
  readonly enableSnapping: string
  readonly disableSnapping: string
  readonly snappingStatus: (enabled: boolean) => string
  readonly undo: string
  readonly redo: string
  readonly currentMode: string
  readonly unsaved: string
  readonly editRequired: (tool: string) => string
}

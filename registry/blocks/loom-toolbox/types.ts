import type { Icon } from "@tabler/icons-react"

export type LoomToolboxTab = "all" | "favorites" | "recent"

export type LoomTool = {
  readonly id: string
  readonly label: string
  readonly description: string
  readonly group: string
  readonly icon: Icon
  readonly parameterKind?: "distance"
}

export type LoomToolboxLabels = {
  readonly title: string
  readonly close: string
  readonly open: string
  readonly search: string
  readonly tabs: Readonly<Record<LoomToolboxTab, string>>
  readonly quickAccess: string
  readonly categories: string
  readonly toolCount: (count: number) => string
  readonly empty: string
  readonly favorite: (tool: string) => string
  readonly unfavorite: (tool: string) => string
  readonly back: string
  readonly parameters: string
  readonly inputLayer: string
  readonly distance: string
  readonly parametersValid: string
  readonly completed: string
  readonly run: (tool: string) => string
}

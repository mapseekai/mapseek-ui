export type LayerGeometry = "point" | "polyline" | "polygon" | "mixed" | "raster"

export type LayerData = {
  readonly id: string
  readonly name: string
  readonly group: string
  readonly geometry: LayerGeometry
  readonly featureCount: number
  readonly visible: boolean
}

export type LayerPanelActionLabels = {
  readonly locateLayer: string
  readonly openAttributeTable: string
  readonly moreLayerActions: string
  readonly renameGroup: string
  readonly showGroup: string
  readonly hideGroup: string
  readonly showLayer: string
  readonly hideLayer: string
}

export type LayerPanelLabels = {
  readonly title: string
  readonly search: string
  readonly all: string
  readonly visible: string
  readonly current: string
  readonly empty: string
  readonly createGroup: string
  readonly addLayer: string
  readonly collapse: string
  readonly expand: string
  /** Visible Tooltip and overflow-menu text. Keep these labels free of object names. */
  readonly actions: LayerPanelActionLabels
  readonly featureCount: (count: number) => string
  readonly geometry: Readonly<Record<LayerGeometry, string>>
  readonly selectLayer: (name: string) => string
  readonly locateLayer: (name: string) => string
  readonly openAttributeTable: (name: string) => string
  readonly moreLayerActions: (name: string) => string
  readonly renameGroup: (name: string) => string
  readonly showGroup: (name: string) => string
  readonly hideGroup: (name: string) => string
  readonly showLayer: (name: string) => string
  readonly hideLayer: (name: string) => string
}

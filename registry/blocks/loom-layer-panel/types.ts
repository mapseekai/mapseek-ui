export type LoomLayerGeometry = "polygon" | "polyline" | "point"

export type LoomLayer = {
  readonly id: string
  readonly name: string
  readonly group: string
  readonly geometry: LoomLayerGeometry
  readonly featureCount: number
  readonly visible: boolean
}

export type LoomLayerPanelLabels = {
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
  readonly featureCount: (count: number) => string
  readonly geometry: Readonly<Record<LoomLayerGeometry, string>>
  readonly selectLayer: (name: string) => string
  readonly locateLayer: (name: string) => string
  readonly openAttributeTable: (name: string) => string
  readonly moreLayerActions: (name: string) => string
  readonly renameGroup: (name: string) => string
  readonly showLayer: (name: string) => string
  readonly hideLayer: (name: string) => string
}

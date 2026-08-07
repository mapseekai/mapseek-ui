export interface LayerPanelLabels {
  readonly point: string
  readonly polyline: string
  readonly polygon: string
  readonly mixed: string
  readonly raster: string
  readonly addLayer: string
  readonly features: string
  readonly locate: string
  readonly zoomToLayer: string
  readonly attributeTable: string
  readonly delete: string
  readonly collapse: string
  readonly expand: string
  readonly showLayer: (name: string) => string
  readonly hideLayer: (name: string) => string
  readonly deleteLayer: (name: string) => string
}

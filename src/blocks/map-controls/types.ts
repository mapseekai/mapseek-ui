export interface MapControlsLabels {
  zoomIn: string
  zoomOut: string
  locate: string
  home: string
}

export interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onLocate?: () => void
  onHome?: () => void
  labels: MapControlsLabels
  className?: string
}

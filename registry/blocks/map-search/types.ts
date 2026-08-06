import type { MapSearchLabels } from "./labels"

export type PlaceSearchResult = {
  id: string
  name: string
  description?: string
  longitude: number
  latitude: number
}

export type MapCoordinates = {
  longitude: number
  latitude: number
}

export type MapSearchTab = "place" | "coordinates"

export type MapSearchProps = {
  onSearchPlace: (keyword: string, signal: AbortSignal) => Promise<PlaceSearchResult[]>
  onSelectPlace: (place: PlaceSearchResult) => void
  onLocatePlace: (keyword: string) => void | Promise<void>
  onLocateCoordinates: (coordinates: MapCoordinates) => void
  defaultTab?: MapSearchTab
  defaultCollapsed?: boolean
  searchDelay?: number
  labels?: Partial<MapSearchLabels>
  className?: string
}

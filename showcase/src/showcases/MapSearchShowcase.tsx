import {
  type MapCoordinates,
  MapSearch,
  type MapSearchLabels,
  type PlaceSearchResult,
} from "@registry/blocks/map-search"
import { useState } from "react"

import type { DemoLocale, LocalizedDemoProps } from "./types"

const places: PlaceSearchResult[] = [
  {
    id: "beijing",
    name: "北京 Beijing",
    description: "中国 · Beijing, China",
    longitude: 116.4074,
    latitude: 39.9042,
  },
  {
    id: "shanghai",
    name: "上海 Shanghai",
    description: "中国 · Shanghai, China",
    longitude: 121.4737,
    latitude: 31.2304,
  },
  {
    id: "hangzhou",
    name: "杭州 Hangzhou",
    description: "浙江 · Zhejiang, China",
    longitude: 120.1551,
    latitude: 30.2741,
  },
  {
    id: "guangzhou",
    name: "广州 Guangzhou",
    description: "广东 · Guangdong, China",
    longitude: 113.2644,
    latitude: 23.1291,
  },
]

const englishLabels = {
  placeTab: "Place",
  coordinatesTab: "Coordinates",
  collapse: "Collapse search",
  expand: "Expand search",
  placeInputLabel: "Place",
  placePlaceholder: "Search for a place",
  locatePlace: "Locate place",
  clearPlace: "Clear place",
  searchLoading: "Searching…",
  noResults: "No matching places",
  searchFailed: "Place search failed. Try again.",
  locateFailed: "Location failed. Try again.",
  resultsLabel: "Place search results",
  longitudeLabel: "Longitude",
  longitudePlaceholder: "-180 to 180",
  latitudeLabel: "Latitude",
  latitudePlaceholder: "-90 to 90",
  locateCoordinates: "Locate coordinates",
  clearCoordinates: "Clear coordinates",
  coordinateRequired: "Enter a coordinate",
  coordinateInvalid: "Enter a valid number",
  longitudeRange: "Longitude must be between -180 and 180",
  latitudeRange: "Latitude must be between -90 and 90",
} satisfies MapSearchLabels

const demoCopy = {
  "zh-CN": {
    intro: "地名与经纬度搜索共享一个可收起的地图浮层，地图动作由外部回调处理。",
    idle: "等待定位",
    selected: (place: PlaceSearchResult) => `飞行至：${place.name}`,
    placeLocated: (keyword: string) => `按关键词定位：${keyword}`,
    coordinatesLocated: ({ longitude, latitude }: MapCoordinates) =>
      `定位坐标：${longitude}, ${latitude}`,
    labels: undefined,
  },
  en: {
    intro:
      "Place and coordinate search share a collapsible map panel while callbacks own map actions.",
    idle: "Waiting to locate",
    selected: (place: PlaceSearchResult) => `Fly to: ${place.name}`,
    placeLocated: (keyword: string) => `Locate keyword: ${keyword}`,
    coordinatesLocated: ({ longitude, latitude }: MapCoordinates) =>
      `Locate coordinates: ${longitude}, ${latitude}`,
    labels: englishLabels,
  },
} satisfies Record<DemoLocale, object>

function waitForSearch(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      signal.removeEventListener("abort", abort)
      resolve()
    }, 120)
    const abort = () => {
      window.clearTimeout(timeout)
      reject(new DOMException("Search aborted", "AbortError"))
    }
    signal.addEventListener("abort", abort, { once: true })
  })
}

export function MapSearchDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const copy = demoCopy[locale]
  const [status, setStatus] = useState(copy.idle)

  async function searchPlace(keyword: string, signal: AbortSignal) {
    await waitForSearch(signal)
    if (keyword.toLowerCase() === "error") throw new Error("Simulated search failure")
    const normalized = keyword.toLowerCase()
    return places.filter((place) =>
      `${place.name} ${place.description ?? ""}`.toLowerCase().includes(normalized),
    )
  }

  return (
    <div data-demo-content="map-search" className="flex w-full max-w-md flex-col gap-3">
      <p className="m-0 text-xs text-muted-foreground">{copy.intro}</p>
      <MapSearch
        labels={copy.labels}
        onSearchPlace={searchPlace}
        onSelectPlace={(place) => setStatus(copy.selected(place))}
        onLocatePlace={(keyword) => setStatus(copy.placeLocated(keyword))}
        onLocateCoordinates={(coordinates) => setStatus(copy.coordinatesLocated(coordinates))}
      />
      <output
        data-demo-status="map-search"
        className="border border-border bg-muted/30 p-2 font-mono text-xs"
      >
        {status}
      </output>
    </div>
  )
}

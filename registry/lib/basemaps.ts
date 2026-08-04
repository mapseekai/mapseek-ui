export type BasemapId = "streets" | "satellite" | "blank"

type BasemapPreset = {
  id: BasemapId
  labelKey: string
  tiles: string[] | null
  attribution: string
  maxzoom: number
}

export const BASEMAPS: BasemapPreset[] = [
  {
    id: "streets",
    labelKey: "preview.basemap_streets",
    tiles: [
      "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    ],
    attribution: "© OpenStreetMap © CARTO",
    maxzoom: 19,
  },
  {
    id: "satellite",
    labelKey: "preview.basemap_satellite",
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    attribution: "© Esri",
    maxzoom: 19,
  },
  {
    id: "blank",
    labelKey: "preview.basemap_blank",
    tiles: null,
    attribution: "",
    maxzoom: 22,
  },
]

export function findBasemap(id: BasemapId): BasemapPreset {
  const fallback = BASEMAPS[0]
  if (fallback === undefined) {
    throw new Error("No basemaps configured")
  }
  return BASEMAPS.find((b) => b.id === id) ?? fallback
}

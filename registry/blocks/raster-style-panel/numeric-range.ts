import type { RasterDataRange } from "./types"

export function normalizeDataRange(range?: RasterDataRange): RasterDataRange | undefined {
  if (!range) return undefined
  const [min, max] = range
  return Number.isFinite(min) && Number.isFinite(max) && min < max ? range : undefined
}

export function isInDataRange(value: number, range?: RasterDataRange) {
  return Number.isFinite(value) && (!range || (value >= range[0] && value <= range[1]))
}

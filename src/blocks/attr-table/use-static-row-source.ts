import { useMemo } from "react"
import type { RowSource } from "./types"

export function useStaticRowSource<T>(
  items: T[],
  opts?: {
    query?: string
    match?: (item: T, q: string) => boolean
    /** Explicit identity for the items array. When omitted, the block
     *  derives it from items.length — sufficient when items only grow/
     *  shrink. Pass an explicit key when items are recreated each
     *  render but represent the same logical dataset. */
    itemsKey?: string
  },
): RowSource<T> {
  const query = opts?.query ?? ""
  const match = opts?.match
  const filtered = useMemo(() => {
    if (!query || !match) return items
    const q = query.toLowerCase()
    return items.filter((i) => match(i, q))
  }, [items, query, match])
  const itemsKey = opts?.itemsKey ?? String(items.length)
  return {
    totalCount: filtered.length,
    getRow: (i) => filtered[i],
    scrollKey: `${itemsKey}|${query}`,
    isInitialLoading: false,
    error: null,
    refetch: () => {},
  }
}

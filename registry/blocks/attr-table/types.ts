export type ColumnDef = {
  name: string
  rawType: string
}

export type RowSource<T> = {
  /** Total row count. null = unknown (block draws skeleton). */
  totalCount: number | null
  /** Get a single row. undefined = page not loaded yet → skeleton cell. */
  getRow: (index: number) => T | undefined
  /** Change of value resets scrollTop to 0. */
  scrollKey: string
  /** Optional — block calls when the visible row range stabilizes. */
  onVisibleRangeChange?: (visibleStart: number, visibleEnd: number) => void
  /** Initial-load skeleton flag. */
  isInitialLoading: boolean
  /** Non-null → block renders error state + Retry button. */
  error: Error | null
  /** Retry callback wired to the error button. */
  refetch: () => void
}

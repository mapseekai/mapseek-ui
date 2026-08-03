import { useCallback, useEffect, useRef, useState } from "react"

const MIN_HEIGHT = 120
const FULLSCREEN_BAND_DENOMINATOR = 4 // top 1/4 triggers auto-fullscreen

function maxHeightFor(viewportHeight: number) {
  return Math.max(MIN_HEIGHT, viewportHeight - 100)
}

function defaultHeight(viewportHeight: number) {
  return Math.max(
    MIN_HEIGHT,
    Math.min(maxHeightFor(viewportHeight), Math.floor(viewportHeight * 0.4)),
  )
}

/**
 * Interaction state for a resizable bottom sheet: drag-to-resize height +
 * fullscreen. Domain concerns (open/close visibility, content mode) belong
 * to the consumer — this hook is intentionally domain-free so it can back
 * any attr-table sheet.
 */
export type TableSheetState = {
  /** Effective height in px; equals the viewport height while fullscreen. */
  height: number
  fullscreen: boolean
  /** Pre-fullscreen height, restored on exit. */
  prevHeight: number
  setHeight: (px: number) => void
  beginDrag: () => void
  endDrag: () => void
  enterFullscreen: () => void
  exitFullscreen: () => void
  toggleFullscreen: () => void
}

/**
 * State for an attribute-table bottom sheet's resize/fullscreen behavior.
 *
 * Auto-fullscreen rule: while dragging, if the sheet's top edge crosses
 * `viewportHeight / 4`, the sheet promotes to fullscreen and stashes the
 * pre-promotion height in `prevHeight`. Exiting fullscreen restores it.
 */
export function useTableSheetState(): TableSheetState {
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === "undefined" ? 800 : window.innerHeight,
  )
  const [height, setHeightState] = useState(() => defaultHeight(viewportHeight))
  const [prevHeight, setPrevHeight] = useState(() => defaultHeight(viewportHeight))
  const [fullscreen, setFullscreen] = useState(false)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const onResize = () => setViewportHeight(window.innerHeight)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Clamp height when viewport shrinks below current height.
  useEffect(() => {
    if (fullscreen) return
    const max = maxHeightFor(viewportHeight)
    setHeightState((h) => Math.min(h, max))
  }, [viewportHeight, fullscreen])

  const enterFullscreen = useCallback(() => {
    if (fullscreen) return
    setPrevHeight(height)
    setFullscreen(true)
  }, [fullscreen, height])

  const exitFullscreen = useCallback(() => {
    setFullscreen(false)
    const max = maxHeightFor(viewportHeight)
    const restore = prevHeight || defaultHeight(viewportHeight)
    setHeightState(Math.max(MIN_HEIGHT, Math.min(max, restore)))
  }, [prevHeight, viewportHeight])

  const toggleFullscreen = useCallback(() => {
    if (fullscreen) exitFullscreen()
    else enterFullscreen()
  }, [fullscreen, enterFullscreen, exitFullscreen])

  const setHeight = useCallback(
    (px: number) => {
      const max = maxHeightFor(viewportHeight)
      const clamped = Math.max(MIN_HEIGHT, Math.min(max, px))
      // Auto-fullscreen rule: only fires while a drag is active so that
      // programmatic setHeight calls don't suddenly snap to fullscreen.
      const sheetTop = viewportHeight - clamped
      const fullscreenLine = viewportHeight / FULLSCREEN_BAND_DENOMINATOR
      if (draggingRef.current && sheetTop < fullscreenLine && !fullscreen) {
        setPrevHeight(height)
        setFullscreen(true)
        return
      }
      // Drag back below the line restores from fullscreen.
      if (draggingRef.current && fullscreen && sheetTop > fullscreenLine + 40) {
        setFullscreen(false)
      }
      setHeightState(clamped)
    },
    [viewportHeight, fullscreen, height],
  )

  const beginDrag = useCallback(() => {
    draggingRef.current = true
  }, [])

  const endDrag = useCallback(() => {
    draggingRef.current = false
  }, [])

  return {
    height: fullscreen ? viewportHeight : height,
    fullscreen,
    prevHeight,
    setHeight,
    beginDrag,
    endDrag,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  }
}

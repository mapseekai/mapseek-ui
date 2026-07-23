import { useCallback, useState } from "react"
import { IconArrowsMaximize, IconArrowsMinimize, IconX } from "@tabler/icons-react"
import { IconButton } from "../../components/icon-button"
import { cn } from "../../lib/utils"
import { useTableSheetState, type TableSheetState } from "./use-table-sheet-state"

export type AttrTableSheetProps = {
  /**
   * Drag/fullscreen state. Omit to let the sheet manage its own
   * (uncontrolled) — pass the result of `useTableSheetState()` to control
   * it externally (e.g. when the consumer also reads `fullscreen`).
   */
  state?: TableSheetState
  /** Header left slot: title, metadata, badges. */
  left?: React.ReactNode
  /** Header center slot: centered regardless of left/right content. */
  center?: React.ReactNode
  /** Header right slot: custom actions, placed before the built-in buttons. */
  actions?: React.ReactNode
  /** Called when the built-in close button is clicked. */
  onClose?: () => void
  /** Built-in fullscreen toggle button. Defaults on. */
  showFullscreen?: boolean
  /** Built-in close button. Defaults on. */
  showClose?: boolean
  fullscreenLabel?: string
  closeLabel?: string
  ariaLabel?: string
  className?: string
  children: React.ReactNode
}

/**
 * Resizable bottom-sheet shell for attribute tables. Flush full-width,
 * anchored to the bottom of the nearest positioned ancestor, with a
 * drag-up handle (auto-fullscreen past the 1/4 line — see
 * use-table-sheet-state) plus built-in fullscreen + close buttons.
 */
export function AttrTableSheet({
  state,
  left,
  center,
  actions,
  onClose,
  showFullscreen = true,
  showClose = true,
  fullscreenLabel,
  closeLabel,
  ariaLabel = "Attribute table",
  className,
  children,
}: AttrTableSheetProps) {
  // Internal state is always created (hooks rule) and used only when the
  // sheet is uncontrolled.
  const internal = useTableSheetState()
  const s = state ?? internal
  const [isDragging, setIsDragging] = useState(false)

  // Drag handle. Two performance details:
  // - Coalesce pointermove updates to one per animation frame so we
  //   don't burn React renders on every mouse tick.
  // - Suppress the height CSS transition while dragging — otherwise
  //   each setHeight starts a 180ms ease and the visible top edge
  //   visibly lags the cursor.
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      ;(e.target as Element).setPointerCapture(e.pointerId)
      s.beginDrag()
      setIsDragging(true)

      let frameId: number | null = null
      let pending: number | null = null

      const flush = () => {
        frameId = null
        if (pending !== null) {
          s.setHeight(pending)
          pending = null
        }
      }

      const onMove = (ev: PointerEvent) => {
        pending = window.innerHeight - ev.clientY
        if (frameId === null) frameId = requestAnimationFrame(flush)
      }
      const onUp = () => {
        if (frameId !== null) {
          cancelAnimationFrame(frameId)
          flush()
        }
        s.endDrag()
        setIsDragging(false)
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
        window.removeEventListener("pointercancel", onUp)
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
      window.addEventListener("pointercancel", onUp)
    },
    [s],
  )

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      style={{ height: s.height }}
      className={cn(
        "pointer-events-auto absolute right-0 bottom-0 left-0 z-30 flex flex-col border-t border-border bg-card shadow-[var(--shadow-lg)]",
        // Only animate height for programmatic transitions (open/close,
        // fullscreen toggle) — never during a drag, otherwise the
        // cursor races ahead of the easing curve.
        !isDragging && "transition-[height] duration-[180ms] ease-[var(--ease-out)]",
        className,
        s.fullscreen && "fixed inset-0",
      )}
    >
      {/* Drag handle */}
      <div
        onPointerDown={handlePointerDown}
        className={cn(
          "group flex h-1.5 shrink-0 cursor-ns-resize items-center justify-center bg-border/40 hover:bg-primary/40",
          s.fullscreen && "pointer-events-none opacity-0",
        )}
        aria-label="Resize attribute table"
        role="separator"
      >
        <span className="h-0.5 w-10 rounded-full bg-foreground/20 group-hover:bg-foreground/40" />
      </div>

      {/* Header — 3-column grid keeps the center slot horizontally centered
          regardless of the asymmetric content on either side. */}
      <div className="grid h-10 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-1 border-b border-border px-2 sm:gap-3 sm:px-3">
        <div className="flex min-w-0 items-center gap-2">{left}</div>

        <div className="flex items-center justify-center">{center}</div>

        <div className="flex shrink-0 items-center justify-end gap-0.5">
          {actions}
          {showFullscreen && (
            <IconButton size="sm" onClick={s.toggleFullscreen} title={fullscreenLabel}>
              {s.fullscreen ? (
                <IconArrowsMinimize size={12} stroke={1.5} />
              ) : (
                <IconArrowsMaximize size={12} stroke={1.5} />
              )}
            </IconButton>
          )}
          {showClose && (
            <IconButton size="sm" onClick={onClose} title={closeLabel}>
              <IconX size={12} stroke={1.5} />
            </IconButton>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}

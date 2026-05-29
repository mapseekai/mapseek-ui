import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "@workspace/ui/lib/utils"

type TooltipSide = "top" | "bottom" | "left" | "right"

type TooltipProps = {
  content: React.ReactNode
  side?: TooltipSide
  /** Skip rendering the tooltip entirely (useful to conditionally
   * enable only when the caller's container is collapsed). */
  disabled?: boolean
  /** Wrapper className applied to the Tooltip.Trigger <span>. */
  className?: string
  /** Override the tooltip popup className — e.g. to relax the default
   * `whitespace-nowrap` and widen the tooltip for multi-line content. */
  popupClassName?: string
  /** When true, children must be a single ReactElement and Tooltip will
   *  compose into it via base-ui's `render` prop instead of wrapping it
   *  in a <span>. Use this to chain triggers (e.g. wrap a PopoverTrigger
   *  so both Tooltip and Popover anchor to the same underlying button). */
  asChild?: boolean
  children: React.ReactNode
}

/**
 * Portaled tooltip built on base-ui. Replaces the old CSS-pseudo
 * implementation so the tooltip escapes its parent's stacking context
 * / overflow clipping — it now renders at the top of the DOM via a
 * portal and sits on a high z-index (z-50), which fixes the
 * "tooltip gets covered by table rows / dropdowns" issue.
 */
function Tooltip({
  content,
  side = "top",
  disabled = false,
  className,
  popupClassName,
  asChild = false,
  children,
}: TooltipProps) {
  if (disabled) return <>{children}</>

  const triggerRender =
    asChild && React.isValidElement(children)
      ? (children as React.ReactElement)
      : <span className={cn("inline-flex", className)}>{children}</span>

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={triggerRender} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={6}>
          <TooltipPrimitive.Popup
            className={cn(
              // Match the rest of the floating chrome (popover / select / dropdown):
              // 1px hairline on a popover surface, square corners, subtle float
              // shadow. Drops the inverted bg-foreground / text-background pair
              // that read as a harsh black block in light mode.
              "z-50 rounded-none border border-border bg-popover px-2 py-1 text-[11px] font-medium leading-none whitespace-nowrap text-popover-foreground shadow-[var(--shadow-map-float)]",
              "transition-opacity duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
              popupClassName
            )}
          >
            {content}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

/**
 * Mount once near the app root. Coordinates hover delay across every
 * Tooltip instance: once the first one opens, neighbours appear
 * instantly for a short window — feels more responsive.
 */
const TooltipProvider = TooltipPrimitive.Provider

export { Tooltip, TooltipProvider }

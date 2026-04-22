import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui-components/react/tooltip"
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
  children,
}: TooltipProps) {
  if (disabled) return <>{children}</>

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger
        render={
          <span className={cn("inline-flex", className)}>{children}</span>
        }
      />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={6}>
          <TooltipPrimitive.Popup
            className={cn(
              "z-50 whitespace-nowrap rounded-none border border-border bg-foreground px-2 py-1 text-[11px] font-medium leading-none text-background shadow-[var(--shadow-sm)]"
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

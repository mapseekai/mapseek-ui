"use client"

import { Toaster as SonnerToaster, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

/**
 * App-wide toast surface. Mount once near the root.
 *
 * Styled to match the rest of the app:
 *   - top-center position, 16px from top, compact stack
 *   - square corners (rounded-none) + subtle shadow
 *   - semi-opaque card background + mono text, mirroring badges /
 *     tooltips / dropdowns
 *   - success / error / warning / info variants reuse Badge tones so
 *     a "copied" toast feels like a "ready" badge — not a generic
 *     Material toast.
 */
function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      className="toaster group"
      position="top-center"
      offset={16}
      gap={6}
      toastOptions={{
        classNames: {
          toast: [
            "group toast",
            "flex items-center gap-2 w-[fit-content] min-w-[240px] max-w-[420px]",
            "border border-border bg-card/95 backdrop-blur",
            "text-card-foreground font-mono text-[12px] font-medium leading-none",
            "px-3 py-2 rounded-none shadow-[var(--shadow-sm)]",
          ].join(" "),
          title: "text-[12px] font-medium tracking-[0.01em]",
          description: "text-[11px] text-muted-foreground",
          actionButton:
            "ml-auto bg-primary text-primary-foreground px-2 py-1 text-[11px] font-medium rounded-none",
          cancelButton:
            "bg-muted text-muted-foreground px-2 py-1 text-[11px] font-medium rounded-none",
          closeButton:
            "border border-border bg-card rounded-none text-muted-foreground",
          success: "border-primary/25 bg-primary/8 text-primary",
          error: "border-destructive/25 bg-destructive/8 text-destructive",
          warning: "border-warning/25 bg-warning/8 text-warning",
          info: "border-info/25 bg-info/8 text-info",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

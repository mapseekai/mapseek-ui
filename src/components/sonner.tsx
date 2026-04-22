"use client"

import { Toaster as SonnerToaster, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

/**
 * App-wide toast surface. Mount once near the root (app shell).
 * Styling hooks into CSS variables so the toast inherits the same
 * muted/foreground/border palette the rest of the UI uses.
 */
function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast border border-border bg-card text-card-foreground font-mono text-xs shadow-[var(--shadow-md)] rounded-none",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

"use client"

import { Toaster as SonnerToaster, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

/**
 * App-wide toast surface. Mount once near the root.
 *
 * Styled to match the app's flat / border-first aesthetic:
 *   - top-center position, 16px from the top
 *   - square corners (the whole app has `--radius: 0`)
 *   - Geist Mono body, bg-card, 1px border
 *   - primary (green) accent on the left edge so it matches the
 *     status badges used across dataset / tileset / mapset pages
 *   - `unstyled` on toasts so Sonner's default rounded-md + shadow
 *     stop applying — our classNames alone decide the look
 */
function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      className="toaster group"
      position="top-center"
      offset={16}
      gap={6}
      toastOptions={{
        // Drop Sonner's defaults entirely so only our classes render;
        // otherwise their rounded-md / shadow / color vars keep
        // fighting our overrides.
        unstyled: true,
        classNames: {
          // Base (default + loading toasts). Primary-tinted left border
          // is the visual echo of the "READY" status badge.
          toast: [
            "group toast pointer-events-auto",
            "flex items-center gap-2.5 w-[fit-content] min-w-[260px] max-w-[420px]",
            "rounded-none border border-border border-l-[3px] border-l-primary",
            "bg-card text-card-foreground shadow-[var(--shadow-md)]",
            "font-mono text-[12px] font-medium leading-none tracking-[0.01em]",
            "px-3 py-2.5",
          ].join(" "),
          title: "text-[12px] font-medium text-foreground",
          description: "text-[11px] text-muted-foreground",
          icon: "text-primary shrink-0 [&_svg]:size-3.5",
          actionButton:
            "ml-auto bg-primary text-primary-foreground px-2 py-1 text-[11px] font-medium rounded-none",
          cancelButton:
            "bg-muted text-muted-foreground px-2 py-1 text-[11px] font-medium rounded-none",
          closeButton:
            "border border-border bg-card rounded-none text-muted-foreground",
          // Variant accent stripes — same palette as Badge so a
          // "copied" toast visually rhymes with a "READY" badge.
          success: "border-l-primary [&_[data-icon]]:text-primary",
          error:
            "border-l-destructive [&_[data-icon]]:text-destructive",
          warning: "border-l-warning [&_[data-icon]]:text-warning",
          info: "border-l-info [&_[data-icon]]:text-info",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

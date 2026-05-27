"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconAlertOctagon,
  IconLoader,
} from "@tabler/icons-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  // Mapseek toast design (see design/mapseek/DESIGN.md):
  //   - Sharp corners (border-radius: 0)
  //   - Hairline border carries the type signal; bg stays popover (no fills)
  //   - Tabler 14px icons, colored to match the type
  //   - Geist UI font inherits from <html>; description uses font-mono for
  //     codes / IDs is the caller's responsibility (toast.success(msg, { description }))
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IconCircleCheck className="size-3.5 text-primary" stroke={1.75} />,
        info: <IconInfoCircle className="size-3.5 text-[var(--cat-2)]" stroke={1.75} />,
        warning: <IconAlertTriangle className="size-3.5 text-warning" stroke={1.75} />,
        error: <IconAlertOctagon className="size-3.5 text-destructive" stroke={1.75} />,
        loading: <IconLoader className="size-3.5 animate-spin text-muted-foreground" stroke={1.75} />,
      }}
      style={
        {
          // Square corners — non-negotiable per design system.
          "--border-radius": "0px",
          // Default surface = popover + 1px hairline.
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // Per-type: keep bg/text the same as default, push the signal into
          // the border + icon so toasts stay calm and on-brand.
          "--success-bg": "var(--popover)",
          "--success-text": "var(--popover-foreground)",
          "--success-border": "color-mix(in oklch, var(--primary) 60%, var(--border))",
          "--error-bg": "var(--popover)",
          "--error-text": "var(--popover-foreground)",
          "--error-border": "color-mix(in oklch, var(--destructive) 60%, var(--border))",
          "--warning-bg": "var(--popover)",
          "--warning-text": "var(--popover-foreground)",
          "--warning-border": "color-mix(in oklch, var(--warning) 60%, var(--border))",
          "--info-bg": "var(--popover)",
          "--info-text": "var(--popover-foreground)",
          "--info-border": "color-mix(in oklch, var(--cat-2) 60%, var(--border))",
          // Subtle float shadow — toasts overlay live map chrome.
          "--shadow": "var(--shadow-map-float, 0 4px 14px -4px oklch(0 0 0 / 0.10))",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!rounded-none !border !font-sans !text-xs !shadow-[var(--shadow-map-float,0_4px_14px_-4px_oklch(0_0_0_/_0.10))]",
          title: "!text-[13px] !font-medium !leading-tight",
          description: "!text-[11px] !leading-snug !text-muted-foreground",
          actionButton:
            "!rounded-none !bg-primary !px-2 !py-1 !text-[11px] !font-medium !text-primary-foreground hover:!bg-primary/90",
          cancelButton:
            "!rounded-none !border !border-border !bg-background !px-2 !py-1 !text-[11px] !font-medium !text-foreground hover:!bg-muted",
          closeButton:
            "!rounded-none !border !border-border !bg-background hover:!bg-muted",
          icon: "!mt-px",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

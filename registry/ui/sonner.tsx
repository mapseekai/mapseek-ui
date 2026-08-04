"use client"

import {
  IconAlertOctagonFilled,
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
  IconLoader,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  // Mapseek toast design (see design/mapseek/DESIGN.md):
  //   - Sharp corners (border-radius: 0)
  //   - Borderless popover surface with a subtle floating shadow
  //   - Filled Tabler 16px icons, colored to match the type
  //   - Geist UI font inherits from <html>; description uses font-mono for
  //     codes / IDs is the caller's responsibility (toast.success(msg, { description }))
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      icons={{
        success: <IconCircleCheckFilled className="size-4 text-primary" />,
        info: <IconInfoCircleFilled className="size-4 text-(--cat-2)" />,
        warning: <IconAlertTriangleFilled className="size-4 text-warning" />,
        error: <IconAlertOctagonFilled className="size-4 text-destructive" />,
        loading: (
          <IconLoader className="size-3.5 animate-spin text-muted-foreground" stroke={1.75} />
        ),
      }}
      style={
        {
          // Square corners — non-negotiable per design system.
          "--border-radius": "0px",
          // Borderless popover surface; elevation comes from the shadow.
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          // Per-type: keep surfaces calm and carry the signal with the icon.
          "--success-bg": "var(--popover)",
          "--success-text": "var(--popover-foreground)",
          "--error-bg": "var(--popover)",
          "--error-text": "var(--popover-foreground)",
          "--warning-bg": "var(--popover)",
          "--warning-text": "var(--popover-foreground)",
          "--info-bg": "var(--popover)",
          "--info-text": "var(--popover-foreground)",
          // Subtle float shadow — toasts overlay live map chrome.
          "--shadow": "var(--shadow-map-float, 0 4px 14px -4px oklch(0 0 0 / 0.10))",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!h-auto !min-h-0 !w-fit !min-w-0 !max-w-[calc(100vw-2rem)] !rounded-none !border-0 !px-3 !py-2.5 !font-sans !text-xs !shadow-[var(--shadow-map-float,0_4px_14px_-4px_oklch(0_0_0_/_0.10))] data-[x-position=center]:inset-x-0! data-[x-position=center]:mx-auto!",
          title: "!text-[13px] !font-medium !leading-tight",
          description: "!text-[11px] !leading-snug !text-muted-foreground",
          actionButton:
            "!rounded-none !bg-primary !px-2 !py-1 !text-[11px] !font-medium !text-primary-foreground hover:!bg-primary/90",
          cancelButton:
            "!rounded-none !border !border-border !bg-background !px-2 !py-1 !text-[11px] !font-medium !text-foreground hover:!bg-muted",
          closeButton: "!rounded-none !border !border-border !bg-background hover:!bg-muted",
          icon: "!mt-px",
        },
      }}
      {...props}
    />
  )
}

export { toast } from "sonner"
export { Toaster }

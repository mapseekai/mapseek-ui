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
  //   - Fine bordered, shadowless popover surface
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
        info: <IconInfoCircleFilled className="size-4 text-info" />,
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
          // Calm popover surface; data-type classes supply the semantic border.
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
          "--shadow": "none",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group/toast !h-auto !min-h-0 !w-fit !min-w-0 !max-w-[calc(100vw-2rem)] !rounded-none !border !border-border !px-3 !py-2.5 !font-sans !text-body-md !shadow-none data-[type=success]:!border-primary data-[type=error]:!border-destructive data-[type=warning]:!border-warning data-[type=info]:!border-info data-[x-position=center]:inset-x-0! data-[x-position=center]:mx-auto!",
          title:
            "!text-body-lg-medium !leading-tight group-data-[type=success]/toast:!text-primary group-data-[type=error]/toast:!text-destructive group-data-[type=warning]/toast:!text-warning group-data-[type=info]/toast:!text-info",
          description:
            "!text-body-sm !leading-snug !text-muted-foreground group-data-[type=success]/toast:!text-primary group-data-[type=error]/toast:!text-destructive group-data-[type=warning]/toast:!text-warning group-data-[type=info]/toast:!text-info",
          actionButton:
            "!rounded-none !bg-primary !px-2 !py-1 !text-body-sm-medium !text-primary-foreground hover:!bg-primary/90",
          cancelButton:
            "!rounded-none !border !border-border !bg-background !px-2 !py-1 !text-body-sm-medium !text-foreground hover:!bg-accent/50",
          closeButton: "!rounded-none !border !border-border !bg-background hover:!bg-accent/50",
          icon: "!mt-px",
        },
      }}
      {...props}
    />
  )
}

export { toast } from "sonner"
export { Toaster }

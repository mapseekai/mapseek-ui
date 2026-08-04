import type * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type {
  StyleEditorModalActionsProps,
  StyleEditorModalAlertProps,
  StyleEditorModalProps,
  StyleEditorModalSectionProps,
  StyleEditorModalSourceCardProps,
  StyleEditorModalTileProps,
} from "./types"

export function StyleEditorModal({
  open,
  title,
  onOpenChange,
  children,
  disablePointerDismissal,
  className,
  dataWdKey,
}: StyleEditorModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal={disablePointerDismissal}
    >
      <DialogContent
        hideClose
        className={cn(
          "flex max-h-[90vh] max-w-2xl flex-col overflow-hidden border bg-background p-0 shadow-lg",
          className,
        )}
        data-wd-key={dataWdKey}
      >
        <DialogHeader className="shrink-0 px-6 py-4">
          <DialogTitle
            className="text-lg leading-none font-bold tracking-tight"
            data-wd-key={dataWdKey ? `${dataWdKey}.title` : undefined}
          >
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <div
            className="flex flex-col"
            data-wd-key={dataWdKey ? `${dataWdKey}.content` : undefined}
          >
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function StyleEditorModalSection({
  title,
  description,
  children,
  className,
}: StyleEditorModalSectionProps) {
  return (
    <section className={cn("flex flex-col gap-4 not-last:mb-8", className)}>
      {title ? (
        <h1 className="m-0 border-b border-border pb-1 text-lg font-bold">{title}</h1>
      ) : null}
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {children}
    </section>
  )
}

export function StyleEditorModalAlert({
  children,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
}: StyleEditorModalAlertProps) {
  return (
    <div
      className={cn(
        "mb-4 flex items-center gap-3 bg-destructive/10 p-3 text-destructive",
        className,
      )}
    >
      <span className="min-w-0 flex-1 text-sm">{children}</span>
      {onDismiss ? (
        <Button
          variant="ghost"
          size="icon-xs"
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center text-xl leading-none hover:bg-destructive/10"
        >
          ×
        </Button>
      ) : null}
    </div>
  )
}

export function StyleEditorModalActions({ children, className }: StyleEditorModalActionsProps) {
  return <div className={cn("flex flex-wrap justify-end gap-2 pt-4", className)}>{children}</div>
}

export function StyleEditorModalTile({
  title,
  imageUrl,
  onClick,
  action,
  className,
}: StyleEditorModalTileProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      className={cn(
        "group flex w-full cursor-pointer flex-col overflow-hidden border border-border bg-background text-left transition-colors hover:border-primary hover:bg-muted/50",
        className,
      )}
      aria-label={typeof title === "string" ? title : undefined}
      onClick={onClick}
    >
      <span className="flex w-full items-center border-b border-border px-3 py-2">
        <span className="min-w-0 flex-1 truncate text-sm font-bold">{title}</span>
        {action ? (
          <span className="shrink-0 text-muted-foreground group-hover:text-primary">{action}</span>
        ) : null}
      </span>
      <span
        className="aspect-video w-full bg-muted bg-cover bg-center"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
    </Button>
  )
}

export function StyleEditorModalSourceCard({
  title,
  action,
  children,
  className,
}: StyleEditorModalSourceCardProps) {
  return (
    <section className={cn("mb-4 overflow-hidden border border-border", className)}>
      <header className="flex items-center border-b border-border bg-muted/50 px-4 py-2">
        <span className="min-w-0 flex-1 truncate font-mono text-sm">{title}</span>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

export function StyleEditorModalKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn("bg-muted px-2 py-0.5 font-mono text-xs whitespace-nowrap", className)}
      {...props}
    />
  )
}

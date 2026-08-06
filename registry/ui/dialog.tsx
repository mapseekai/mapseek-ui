import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { IconX } from "@tabler/icons-react"
import type * as React from "react"
import { cn } from "@/registry/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-[1060] bg-black/40 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  )
}

type DialogContentProps = Omit<React.ComponentProps<typeof DialogPrimitive.Popup>, "title"> & {
  width?: number | string
  title?: React.ReactNode
  description?: React.ReactNode
  hideClose?: boolean
}

function DialogContent({
  className,
  width = 480,
  title,
  description,
  hideClose,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-layout={title ? "legacy" : "compound"}
        className={cn(
          "fixed top-1/2 left-1/2 z-[1060] grid max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 border border-border bg-card shadow-lg outline-none",
          "transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
          title ? "gap-0 p-0" : "gap-4 p-4",
          className,
        )}
        style={{ width }}
        {...props}
      >
        {(title || !hideClose) && (
          <div className="flex min-h-9 items-center justify-between border-b border-border px-4 py-2">
            {title ? (
              <DialogPrimitive.Title className="m-0 inline-flex items-center text-sm leading-none font-semibold tracking-[-0.01em]">
                {title}
              </DialogPrimitive.Title>
            ) : (
              <span />
            )}
            {!hideClose && (
              <DialogPrimitive.Close
                className="grid h-8 w-8 cursor-pointer place-items-center text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="关闭"
              >
                <IconX size={14} />
              </DialogPrimitive.Close>
            )}
          </div>
        )}
        {description && (
          <DialogPrimitive.Description className="px-4 pt-3 text-xs text-muted-foreground">
            {description}
          </DialogPrimitive.Description>
        )}
        {children}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("in-data-[layout=legacy]:p-4", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        "in-data-[layout=legacy]:border-t in-data-[layout=legacy]:border-border in-data-[layout=legacy]:bg-muted/40 in-data-[layout=legacy]:px-4 in-data-[layout=legacy]:py-2",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Compound parts follow the shadcn DialogContent → DialogHeader / body /
 * DialogFooter structure. The legacy `title=` API keeps its own compact
 * header strip until consumers migrate to the compound form.
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1 text-start", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-sm font-semibold tracking-[-0.01em]", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBackdrop,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { IconX } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"

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
        className={cn(
          "fixed top-1/2 left-1/2 z-[1060] -translate-x-1/2 -translate-y-1/2 border border-border bg-card shadow-lg outline-none",
          "transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
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
  return <div className={cn("p-4", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-9 items-center justify-end gap-2 border-t border-border bg-muted/40 px-4 py-2",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Compound parts for callers that prefer the shadcn-style header
 * pattern over DialogContent's `title=` / `description=` props.
 *
 * Use them inside `<DialogContent hideClose>` so the wrapper does NOT
 * also render its built-in header strip — otherwise you'll get two
 * stacked titles.
 *
 *   <DialogContent hideClose>
 *     <DialogHeader>
 *       <DialogTitle>X</DialogTitle>
 *       <DialogDescription>Y</DialogDescription>
 *     </DialogHeader>
 *     <DialogBody>…</DialogBody>
 *     <DialogFooter>…</DialogFooter>
 *   </DialogContent>
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1 border-b border-border px-4 py-3", className)}
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
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogBackdrop,
  DialogContent,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}

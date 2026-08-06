import { IconAlertTriangle, IconTrash } from "@tabler/icons-react"
import * as React from "react"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/registry/ui/dialog"

export interface ConfirmOptions {
  title: React.ReactNode
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

type PendingConfirm = {
  options: ConfirmOptions
  resolve: (value: boolean) => void
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = React.createContext<ConfirmFn | null>(null)

function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = React.useState<PendingConfirm | null>(null)
  const pendingRef = React.useRef<PendingConfirm | null>(null)

  // Mirror state into a ref in an effect (not during render) so the
  // concurrency guard in `confirm` and the late-open handler in `close`
  // can read the latest pending value without forcing the callbacks to
  // depend on it.
  React.useEffect(() => {
    pendingRef.current = pending
  }, [pending])

  const confirm = React.useCallback<ConfirmFn>((options) => {
    // Concurrency guard: if another confirm is still open, resolve it false
    // first so the previous awaiter does not leak.
    const prev = pendingRef.current
    if (prev) {
      prev.resolve(false)
    }
    return new Promise<boolean>((resolve) => {
      setPending({ options, resolve })
    })
  }, [])

  const close = React.useCallback((value: boolean) => {
    const current = pendingRef.current
    if (!current) return
    current.resolve(value)
    setPending(null)
  }, [])

  const options = pending?.options
  const isDestructive = options?.variant === "destructive"

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) close(false)
        }}
      >
        {options && (
          <DialogContent
            width={420}
            title={
              <span className="inline-flex items-center gap-2 leading-none">
                {isDestructive && (
                  <IconAlertTriangle size={16} stroke={1.8} className="shrink-0 text-destructive" />
                )}
                <span className="leading-none">{options.title}</span>
              </span>
            }
          >
            {options.description && (
              <DialogBody className={cn("text-body-md text-muted-foreground")}>
                {options.description}
              </DialogBody>
            )}
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => close(false)}>
                {options.cancelText ?? "取消"}
              </Button>
              <Button
                variant={isDestructive ? "destructive" : "default"}
                size="sm"
                onClick={() => close(true)}
              >
                {isDestructive && <IconTrash size={14} stroke={1.8} className="-ml-0.5 shrink-0" />}
                {options.confirmText ?? (isDestructive ? "删除" : "确认")}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </ConfirmContext.Provider>
  )
}

function useConfirm(): ConfirmFn {
  const ctx = React.useContext(ConfirmContext)
  if (!ctx) {
    throw new Error("useConfirm must be used within <ConfirmProvider>")
  }
  return ctx
}

export { ConfirmProvider, useConfirm }

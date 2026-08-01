import { Button } from "@registry/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@registry/ui/dialog"
import { useState } from "react"

export type DialogConfirmationDemoLabels = {
  readonly trigger: string
  readonly title: string
  readonly description: string
  readonly cancel: string
  readonly discard: string
  readonly save: string
  readonly statusLabel: string
  readonly idleStatus: string
  readonly canceledStatus: string
  readonly discardedStatus: string
  readonly savedStatus: string
}

export type DialogConfirmationDemoProps = {
  readonly labels: DialogConfirmationDemoLabels
}

export function DialogConfirmationDemo({ labels }: DialogConfirmationDemoProps) {
  const [status, setStatus] = useState(labels.idleStatus)

  return (
    <div data-demo="dialog-confirmation" className="flex flex-col gap-3">
      <Dialog>
        <DialogTrigger
          render={
            <Button data-demo="dialog-confirmation-trigger" variant="outline">
              {labels.trigger}
            </Button>
          }
        />
        <DialogContent title={labels.title} width={440}>
          <DialogDescription>{labels.description}</DialogDescription>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  data-demo="dialog-confirmation-cancel"
                  variant="ghost"
                  onClick={() => setStatus(labels.canceledStatus)}
                >
                  {labels.cancel}
                </Button>
              }
            />
            <DialogClose
              render={
                <Button
                  data-demo="dialog-confirmation-discard"
                  variant="outline"
                  onClick={() => setStatus(labels.discardedStatus)}
                >
                  {labels.discard}
                </Button>
              }
            />
            <DialogClose
              render={
                <Button
                  data-demo="dialog-confirmation-save"
                  onClick={() => setStatus(labels.savedStatus)}
                >
                  {labels.save}
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p data-demo="dialog-confirmation-status" className="text-xs text-muted-foreground">
        {labels.statusLabel}: {status}
      </p>
    </div>
  )
}

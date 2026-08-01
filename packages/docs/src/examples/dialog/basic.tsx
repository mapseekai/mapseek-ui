import { Button } from "@registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@registry/ui/dialog"
import { useState } from "react"

export type DialogBasicDemoLabels = {
  readonly uncontrolledTrigger: string
  readonly uncontrolledTitle: string
  readonly uncontrolledDescription: string
  readonly uncontrolledBody: string
  readonly cancel: string
  readonly confirm: string
  readonly controlledTrigger: string
  readonly controlledTitle: string
  readonly controlledBody: string
  readonly controlledClose: string
  readonly controlledStateLabel: string
  readonly controlledStateOpen: string
  readonly controlledStateClosed: string
}

export type DialogBasicDemoProps = {
  readonly labels: DialogBasicDemoLabels
}

export function DialogBasicDemo({ labels }: DialogBasicDemoProps) {
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <div data-demo="dialog-basic" className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger
            render={
              <Button data-demo="dialog-basic-uncontrolled-trigger" variant="outline">
                {labels.uncontrolledTrigger}
              </Button>
            }
          />
          <DialogContent
            title={labels.uncontrolledTitle}
            description={labels.uncontrolledDescription}
          >
            <DialogBody>
              <p className="text-sm text-muted-foreground">{labels.uncontrolledBody}</p>
            </DialogBody>
            <DialogFooter>
              <DialogClose
                render={
                  <Button data-demo="dialog-basic-cancel" variant="outline" size="sm">
                    {labels.cancel}
                  </Button>
                }
              />
              <Button data-demo="dialog-basic-confirm" size="sm">
                {labels.confirm}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={controlledOpen} onOpenChange={setControlledOpen}>
          <DialogTrigger
            render={
              <Button data-demo="dialog-basic-controlled-trigger" variant="outline">
                {labels.controlledTrigger}
              </Button>
            }
          />
          <DialogContent title={labels.controlledTitle}>
            <DialogBody>
              <p className="text-sm text-muted-foreground">{labels.controlledBody}</p>
            </DialogBody>
            <DialogFooter>
              <Button
                data-demo="dialog-basic-controlled-close"
                size="sm"
                onClick={() => setControlledOpen(false)}
              >
                {labels.controlledClose}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p data-demo="dialog-basic-controlled-state" className="text-xs text-muted-foreground">
        {labels.controlledStateLabel}:{" "}
        {controlledOpen ? labels.controlledStateOpen : labels.controlledStateClosed}
      </p>
    </div>
  )
}

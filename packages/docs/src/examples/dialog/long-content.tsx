import { Button } from "@registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@registry/ui/dialog"
import { Input } from "@registry/ui/input"
import { Label } from "@registry/ui/label"
import { Textarea } from "@registry/ui/textarea"
import { IconBraces } from "@tabler/icons-react"

export type DialogLongContentSection = {
  readonly title: string
  readonly body: string
}

export type DialogLongContentDemoLabels = {
  readonly trigger: string
  readonly title: string
  readonly description: string
  readonly badge: string
  readonly targetFieldLabel: string
  readonly targetFieldValue: string
  readonly expressionLabel: string
  readonly expressionValue: string
  readonly noteLabel: string
  readonly noteValue: string
  readonly sections: readonly DialogLongContentSection[]
  readonly footerStatus: string
  readonly cancel: string
  readonly apply: string
}

export type DialogLongContentDemoProps = {
  readonly labels: DialogLongContentDemoLabels
}

export function DialogLongContentDemo({ labels }: DialogLongContentDemoProps) {
  return (
    <div data-demo="dialog-long-content" className="flex flex-wrap gap-3">
      <Dialog>
        <DialogTrigger
          render={
            <Button data-demo="dialog-long-content-trigger" variant="outline">
              {labels.trigger}
            </Button>
          }
        />
        <DialogContent
          width={640}
          className="max-h-[calc(100vh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto]"
        >
          <DialogHeader>
            <DialogTitle>
              <span className="inline-flex items-center gap-2">
                <IconBraces className="text-primary" />
                <span>{labels.title}</span>
                <span className="font-mono text-[10px] font-normal text-muted-foreground">
                  {labels.badge}
                </span>
              </span>
            </DialogTitle>
            <DialogDescription>{labels.description}</DialogDescription>
          </DialogHeader>
          <DialogBody className="min-h-0 overflow-y-auto pe-1">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="docs-dialog-target-field">{labels.targetFieldLabel}</Label>
                <Input id="docs-dialog-target-field" value={labels.targetFieldValue} readOnly />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="docs-dialog-expression">{labels.expressionLabel}</Label>
                <Input id="docs-dialog-expression" value={labels.expressionValue} readOnly />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <Label htmlFor="docs-dialog-note">{labels.noteLabel}</Label>
              <Textarea id="docs-dialog-note" rows={3} value={labels.noteValue} readOnly />
            </div>
            <div className="mt-4 grid gap-3">
              {labels.sections.map((section) => (
                <section key={section.title} className="border border-border p-3">
                  <h4 className="m-0 font-mono text-xs font-medium">{section.title}</h4>
                  <p className="mt-1 mb-0 text-xs text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
          </DialogBody>
          <DialogFooter className="sm:items-center">
            <span className="font-mono text-[10px] text-muted-foreground sm:me-auto">
              {labels.footerStatus}
            </span>
            <DialogClose
              render={
                <Button data-demo="dialog-long-content-cancel" variant="outline">
                  {labels.cancel}
                </Button>
              }
            />
            <DialogClose
              render={<Button data-demo="dialog-long-content-apply">{labels.apply}</Button>}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

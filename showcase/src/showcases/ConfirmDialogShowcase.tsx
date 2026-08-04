import { Button } from "@registry/ui/button"
import { ConfirmProvider, useConfirm } from "@registry/ui/confirm-dialog"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

function ConfirmDialogActions() {
  const confirm = useConfirm()
  const [lastResult, setLastResult] = useState("No confirmation yet")

  async function confirmDelete(): Promise<void> {
    const confirmed = await confirm({
      title: "Delete layer",
      description: "This permanently removes the Administrative Boundaries layer and its features.",
      variant: "destructive",
      confirmText: "Delete",
      cancelText: "Cancel",
    })
    setLastResult(confirmed ? "Delete confirmed" : "Delete canceled")
  }

  async function confirmSave(): Promise<void> {
    const confirmed = await confirm({
      title: "Save changes",
      description: "Save the current style edits to the project file.",
      confirmText: "Save",
      cancelText: "Discard",
    })
    setLastResult(confirmed ? "Changes saved" : "Changes discarded")
  }

  async function confirmExport(): Promise<void> {
    const confirmed = await confirm({
      title: "Export dataset",
      description: "Export the active layer as GeoJSON in EPSG:4326. Estimated size: 2.4 MB.",
      confirmText: "Export",
    })
    setLastResult(confirmed ? "Dataset exported" : "Export canceled")
  }

  return (
    <div className="grid gap-8">
      <section className="space-y-3" data-demo="confirm-dialog-destructive">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Destructive confirmation
        </h4>
        <Button
          data-demo="confirm-dialog-delete-trigger"
          variant="destructive"
          onClick={confirmDelete}
        >
          Delete layer
        </Button>
      </section>

      <section className="space-y-3" data-demo="confirm-dialog-default">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Default confirmations
        </h4>
        <div className="flex flex-wrap gap-3">
          <Button data-demo="confirm-dialog-save-trigger" onClick={confirmSave}>
            Save changes
          </Button>
          <Button
            data-demo="confirm-dialog-export-trigger"
            variant="outline"
            onClick={confirmExport}
          >
            Export dataset
          </Button>
        </div>
      </section>

      <section className="space-y-2" data-demo="confirm-dialog-result">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          Result
        </h4>
        <p className="font-mono text-xs text-foreground" data-demo="confirm-dialog-status">
          {lastResult}
        </p>
      </section>
    </div>
  )
}

export function ConfirmDialogOverviewDemo(_props: LocalizedDemoProps) {
  return (
    <ConfirmProvider>
      <ConfirmDialogActions />
    </ConfirmProvider>
  )
}

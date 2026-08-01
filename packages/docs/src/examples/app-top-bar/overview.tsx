import { AppTopBar, type AppTopBarLabels } from "@registry/blocks/app-top-bar"
import { ProductLogo } from "@registry/blocks/product-logo"
import { Button } from "@registry/ui/button"
import { IconHistory } from "@tabler/icons-react"
import { useState } from "react"

export type AppTopBarDemoLabels = {
  readonly brandAlt: string
  readonly projectName: string
  readonly saved: string
  readonly dirty: string
  readonly saveAs: string
  readonly snapshot: string
  readonly statusReady: string
  readonly statusDirty: string
  readonly labels: AppTopBarLabels
}

export const zhAppTopBarLabels = {
  brandAlt: "Mapseek Loom",
  projectName: "珠江三角洲用地规划",
  saved: "已保存",
  dirty: "未保存的更改",
  saveAs: "另存为",
  snapshot: "快照",
  statusReady: "状态已保存",
  statusDirty: "状态已标脏",
  labels: { back: "返回", save: "保存" },
} satisfies AppTopBarDemoLabels

export const enAppTopBarLabels = {
  brandAlt: "Mapseek Loom",
  projectName: "Pearl River Delta land-use plan",
  saved: "Saved",
  dirty: "Unsaved changes",
  saveAs: "Save as",
  snapshot: "Snapshot",
  statusReady: "Status saved",
  statusDirty: "Status marked dirty",
  labels: { back: "Back", save: "Save" },
} satisfies AppTopBarDemoLabels

function StatusPill({
  dirty,
  labels,
}: {
  readonly dirty: boolean
  readonly labels: AppTopBarDemoLabels
}) {
  return (
    <span
      className={[
        "ml-1 inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[9px] leading-none font-medium uppercase",
        dirty
          ? "border-warning/25 bg-warning/10 text-warning"
          : "border-primary/25 bg-primary/10 text-primary",
      ].join(" ")}
    >
      <span className={`size-[5px] rounded-full ${dirty ? "bg-warning" : "bg-primary"}`} />
      {dirty ? labels.dirty : labels.saved}
    </span>
  )
}

export function AppTopBarDemo({ labels }: { readonly labels: AppTopBarDemoLabels }) {
  const [dirty, setDirty] = useState(true)
  const [status, setStatus] = useState(labels.statusDirty)

  const brand = (
    <span className="inline-flex items-center gap-1.5 text-foreground">
      <ProductLogo src="/img/mapseek.svg" alt={labels.brandAlt} size={28} />
    </span>
  )

  return (
    <div data-demo="app-top-bar" className="flex w-full flex-col gap-3">
      <div className="border-x border-t border-border">
        <AppTopBar
          brand={brand}
          projectName={labels.projectName}
          status={<StatusPill dirty={dirty} labels={labels} />}
          labels={labels.labels}
          onBack={() => setStatus(labels.labels.back)}
          onSave={() => {
            setDirty(false)
            setStatus(labels.statusReady)
          }}
          afterSaveActions={
            <Button
              type="button"
              data-demo-action="app-top-bar-save-as"
              variant="outline"
              className="h-[26px] rounded-none border-border bg-background px-2.5 text-[11px]"
              onClick={() => {
                setDirty(true)
                setStatus(labels.statusDirty)
              }}
            >
              {labels.saveAs}
            </Button>
          }
          endActions={
            <Button
              type="button"
              data-demo-action="app-top-bar-snapshot"
              variant="outline"
              className="h-[26px] gap-1.5 rounded-none border-border bg-background px-2.5 text-[11px]"
              onClick={() => setStatus(labels.snapshot)}
            >
              <IconHistory size={12} className="text-primary" />
              {labels.snapshot}
            </Button>
          }
        />
      </div>
      <span data-demo-status="app-top-bar" className="font-mono text-xs text-muted-foreground">
        {status}
      </span>
    </div>
  )
}

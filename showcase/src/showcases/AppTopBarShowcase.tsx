import { AppTopBar } from "@registry/blocks/app-top-bar"
import { ProductLogo } from "@registry/blocks/product-logo"
import { Button } from "@registry/ui/button"
import { IconHistory } from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    brandAlt: "Mapseek Loom",
    projectName: "珠江三角洲用地规划",
    saved: "已保存",
    dirty: "未保存的更改",
    saveAs: "另存为",
    snapshot: "快照",
    statusReady: "状态已保存",
    statusDirty: "状态已标脏",
    labels: { back: "返回", save: "保存" },
  },
  en: {
    brandAlt: "Mapseek Loom",
    projectName: "Pearl River Delta land-use plan",
    saved: "Saved",
    dirty: "Unsaved changes",
    saveAs: "Save as",
    snapshot: "Snapshot",
    statusReady: "Status saved",
    statusDirty: "Status marked dirty",
    labels: { back: "Back", save: "Save" },
  },
}

type AppTopBarDemoLabels = (typeof labels)["zh-CN"]

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
        "ml-1 inline-flex items-center gap-1 whitespace-nowrap border px-1.5 py-0.5 font-mono text-[9px] leading-none font-medium uppercase",
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

export function AppTopBarDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [dirty, setDirty] = useState(true)
  const [status, setStatus] = useState(demoLabels.statusDirty)

  const brand = (
    <span className="inline-flex items-center gap-1.5 text-foreground">
      <ProductLogo src="/img/mapseek.png" alt={demoLabels.brandAlt} size={28} />
    </span>
  )

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="border-x border-t border-border">
        <AppTopBar
          brand={brand}
          projectName={demoLabels.projectName}
          status={<StatusPill dirty={dirty} labels={demoLabels} />}
          labels={demoLabels.labels}
          onBack={() => setStatus(demoLabels.labels.back)}
          onSave={() => {
            setDirty(false)
            setStatus(demoLabels.statusReady)
          }}
          afterSaveActions={
            <Button
              type="button"
              data-demo-action="app-top-bar-save-as"
              variant="outline"
              className="h-[26px] rounded-none border-border bg-background px-2.5 text-[11px]"
              onClick={() => {
                setDirty(true)
                setStatus(demoLabels.statusDirty)
              }}
            >
              {demoLabels.saveAs}
            </Button>
          }
          endActions={
            <Button
              type="button"
              data-demo-action="app-top-bar-snapshot"
              variant="outline"
              className="h-[26px] gap-1.5 rounded-none border-border bg-background px-2.5 text-[11px]"
              onClick={() => setStatus(demoLabels.snapshot)}
            >
              <IconHistory size={12} className="text-primary" />
              {demoLabels.snapshot}
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

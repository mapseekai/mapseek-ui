import { StorageMeter, type StorageMeterData } from "@registry/blocks/storage-meter"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const gb = 1024 ** 3

const samples: Record<string, StorageMeterData> = {
  normal: {
    usage: 1.2 * gb,
    quota: 10 * gb,
    available: 8.8 * gb,
    ratio: 0.12,
    details: { fileSystem: 0.9 * gb, indexedDB: 0.3 * gb },
    unsupported: false,
  },
  full: {
    usage: 9.6 * gb,
    quota: 10 * gb,
    available: 0.4 * gb,
    ratio: 0.96,
    details: { fileSystem: 8.4 * gb, indexedDB: 1.0 * gb, caches: 0.2 * gb },
    unsupported: false,
  },
  unsupported: {
    usage: 0,
    quota: 0,
    available: 0,
    ratio: 0,
    details: {},
    unsupported: true,
  },
}

const labels = {
  "zh-CN": {
    unsupported: "不支持",
    unsupportedHint: "navigator.storage.estimate() 不受支持",
    title: "本地存储",
    refresh: "刷新",
    details: "存储详情",
    used: "已用",
    available: "剩余",
    quota: "总配额",
    usageRate: "使用率",
    normal: "正常",
    full: "接近上限",
    unsupportedMode: "不支持",
    refreshed: "已刷新",
    errorText: "配额读取失败",
    footerTitle: "OPFS",
    footerDescription: "源私有文件系统说明通过 footer 插槽注入。",
  },
  en: {
    unsupported: "Unsupported",
    unsupportedHint: "navigator.storage.estimate() unsupported",
    title: "Local storage",
    refresh: "Refresh",
    details: "Storage details",
    used: "Used",
    available: "Available",
    quota: "Quota",
    usageRate: "Usage",
    normal: "Normal",
    full: "Near limit",
    unsupportedMode: "Unsupported",
    refreshed: "Refreshed",
    errorText: "Quota read failed",
    footerTitle: "OPFS",
    footerDescription: "Origin-private storage notes are injected through the footer slot.",
  },
}

export function StorageMeterDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [mode, setMode] = useState<keyof typeof samples>("normal")
  const [status, setStatus] = useState(demoLabels.normal)
  const [error, setError] = useState<string | null>(null)

  function selectMode(nextMode: keyof typeof samples, label: string) {
    setMode(nextMode)
    setStatus(label)
    setError(nextMode === "full" ? "QuotaHighWatermark" : null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={mode === "normal" ? "default" : "outline"}
          size="sm"
          data-demo-action="storage-meter-normal"
          onClick={() => selectMode("normal", demoLabels.normal)}
        >
          {demoLabels.normal}
        </Button>
        <Button
          type="button"
          variant={mode === "full" ? "default" : "outline"}
          size="sm"
          data-demo-action="storage-meter-full"
          onClick={() => selectMode("full", demoLabels.full)}
        >
          {demoLabels.full}
        </Button>
        <Button
          type="button"
          variant={mode === "unsupported" ? "default" : "outline"}
          size="sm"
          data-demo-action="storage-meter-unsupported"
          onClick={() => selectMode("unsupported", demoLabels.unsupportedMode)}
        >
          {demoLabels.unsupportedMode}
        </Button>
        <span
          data-demo-status="storage-meter"
          className="self-center font-mono text-xs text-muted-foreground"
        >
          {status}
        </span>
      </div>
      <div className="flex h-[260px] items-start justify-end border border-border bg-muted/20 p-3">
        <StorageMeter
          data={samples[mode]}
          labels={demoLabels}
          error={error}
          errorLabel={() => demoLabels.errorText}
          onRefresh={() => setStatus(demoLabels.refreshed)}
          footer={
            <div className="border-t border-border pt-2">
              <strong className="mb-1 block text-[10px] font-semibold text-muted-foreground uppercase">
                {demoLabels.footerTitle}
              </strong>
              <p className="m-0 text-[11px] leading-relaxed text-muted-foreground">
                {demoLabels.footerDescription}
              </p>
            </div>
          }
        />
      </div>
    </div>
  )
}

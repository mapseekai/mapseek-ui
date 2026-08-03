import { type PixelField, PixelProbe, type PixelProbeLabels } from "@registry/blocks/pixel-probe"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    reopen: "重新打开",
    copied: "已复制 JSON",
    closed: "已关闭",
    empty: "暂无选中像元",
    clearSelection: "清除选中",
    statusPrefix: "像元",
    fields: [
      { key: "波段", type: "INT", value: "1 / 1", locked: true },
      { key: "数值", type: "FLOAT", value: "128.46", unit: "m" },
      { key: "数据类型", type: "TEXT", value: "Float32" },
      { key: "行 · 列", type: "INDEX", value: "4,128 · 6,572" },
      { key: "经度 · 纬度", type: "COORD", value: "121.4737deg · 31.2304deg" },
      { key: "色带", type: "ENUM", value: "viridis" },
      { key: "更新时间", type: "DATE", value: "2026-04-14" },
    ] satisfies PixelField[],
    labels: {
      title: "像元探测",
      copy: "复制 JSON",
      close: "关闭",
      prev: "上一个像元",
      next: "下一个像元",
      pointPrefix: "PT",
    },
  },
  en: {
    reopen: "Reopen",
    copied: "Copied JSON",
    closed: "Closed",
    empty: "No selected pixel",
    clearSelection: "Clear selection",
    statusPrefix: "Pixel",
    fields: [
      { key: "band", type: "INT", value: "1 / 1", locked: true },
      { key: "value", type: "FLOAT", value: "128.46", unit: "m" },
      { key: "dtype", type: "TEXT", value: "Float32" },
      { key: "row · col", type: "INDEX", value: "4,128 · 6,572" },
      { key: "lon · lat", type: "COORD", value: "121.4737deg · 31.2304deg" },
      { key: "colormap", type: "ENUM", value: "viridis" },
      { key: "updated", type: "DATE", value: "2026-04-14" },
    ] satisfies PixelField[],
    labels: {
      title: "Pixel probe",
      copy: "Copy JSON",
      close: "Close",
      prev: "Previous pixel",
      next: "Next pixel",
      pointPrefix: "PT",
    },
  },
}

export function PixelProbeDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [point, setPoint] = useState(1)
  const [closed, setClosed] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [status, setStatus] = useState(`${demoLabels.statusPrefix} 1`)

  if (closed) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="w-fit border border-border bg-primary px-3 py-1 font-mono text-xs text-primary-foreground hover:opacity-90"
          onClick={() => {
            setClosed(false)
            setEmpty(false)
            setStatus(`${demoLabels.statusPrefix} ${point}`)
          }}
        >
          {demoLabels.reopen}
        </button>
        <span data-demo-status="pixel-probe" className="font-mono text-xs text-muted-foreground">
          {status}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        data-demo-action="pixel-probe-clear-selection"
        className="w-fit border border-border bg-card px-3 py-1 font-mono text-xs text-foreground hover:bg-muted"
        onClick={() => {
          setEmpty(true)
          setStatus(demoLabels.empty)
        }}
      >
        {demoLabels.clearSelection}
      </button>
      <div className="relative h-[560px] w-full border border-border bg-muted/20">
        {empty ? (
          <div
            data-demo-empty="pixel-probe"
            className="absolute top-4 right-4 w-[340px] border border-border bg-card p-3 font-mono text-xs text-muted-foreground shadow-[var(--shadow-map-float)]"
          >
            {demoLabels.empty}
          </div>
        ) : (
          <PixelProbe
            className="absolute top-4 right-4 max-h-[calc(100%-32px)] w-[340px] shadow-[var(--shadow-map-float)]"
            fields={demoLabels.fields.map((field) => ({ ...field }))}
            count={1}
            index={point}
            labels={demoLabels.labels}
            onCopy={() => setStatus(demoLabels.copied)}
            onClose={() => {
              setClosed(true)
              setStatus(demoLabels.closed)
            }}
            onPrev={() =>
              setPoint((current) => {
                const nextPoint = Math.max(1, current - 1)
                setStatus(`${demoLabels.statusPrefix} ${nextPoint}`)
                return nextPoint
              })
            }
            onNext={() =>
              setPoint((current) => {
                const nextPoint = current + 1
                setStatus(`${demoLabels.statusPrefix} ${nextPoint}`)
                return nextPoint
              })
            }
          />
        )}
      </div>
      <span data-demo-status="pixel-probe" className="font-mono text-xs text-muted-foreground">
        {status}
      </span>
    </div>
  )
}

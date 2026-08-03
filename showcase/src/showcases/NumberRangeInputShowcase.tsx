import { NumberRangeInput } from "@registry/blocks/number-range-input"
import type { ReactNode } from "react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

function Row({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <div className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-3">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

const labels = {
  "zh-CN": {
    intro: "数字输入和单滑块组合。支持直接输入、键盘步进、min/max 限制和小数 step。",
    reset: "清空",
  },
  en: {
    intro:
      "Number input paired with a single slider. Supports typing, keyboard steps, min/max, and decimal steps.",
    reset: "Clear",
  },
}

export function NumberRangeInputDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [percent, setPercent] = useState<number | undefined>(48)
  const [zoom, setZoom] = useState<number | undefined>(12)
  const [opacity, setOpacity] = useState<number | undefined>(0.625)

  return (
    <div className="flex w-full max-w-[560px] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs text-muted-foreground">{demoLabels.intro}</p>
        <button
          type="button"
          data-demo-action="clear-ranges"
          className="border border-border bg-background px-2 py-1 font-mono text-xs hover:bg-muted"
          onClick={() => {
            setPercent(undefined)
            setZoom(undefined)
            setOpacity(undefined)
          }}
        >
          {demoLabels.reset}
        </button>
      </div>
      <div className="flex flex-col gap-3 border border-border p-3">
        <Row label="0 - 100 / step 1">
          <NumberRangeInput
            aria-label="percent"
            value={percent}
            min={0}
            max={100}
            step={1}
            onChange={setPercent}
          />
        </Row>
        <Row label="0 - 24 / step 0.5">
          <NumberRangeInput
            aria-label="zoom"
            value={zoom}
            min={0}
            max={24}
            step={0.5}
            onChange={setZoom}
          />
        </Row>
        <Row label="0 - 1 / step 0.001">
          <NumberRangeInput
            aria-label="opacity"
            value={opacity}
            min={0}
            max={1}
            step={0.001}
            onChange={setOpacity}
          />
        </Row>
      </div>
      <pre className="overflow-auto border border-border bg-muted/30 p-2 font-mono text-[11px]">
        {JSON.stringify({ percent, zoom, opacity }, null, 2)}
      </pre>
    </div>
  )
}

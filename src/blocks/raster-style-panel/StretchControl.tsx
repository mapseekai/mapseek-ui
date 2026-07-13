import { useEffect, useState } from "react"
import { Input } from "../../components/input"
import { cn } from "../../lib/utils"
import { Segmented } from "./Segmented"
import type { RasterStretch, StretchMode } from "./types"

const MODES: Array<Exclude<StretchMode, "custom">> = ["minmax", "percent", "stddev"]
export interface StretchControlLabels {
  modes: Record<StretchMode, string>
  minmaxHint: string
  percentHint: string
  sigmaHint: string
  sigmaSuffix: string
  auto: string
}
export interface StretchControlProps {
  value: RasterStretch
  onChange: (next: RasterStretch) => void
  labels: StretchControlLabels
  autoRange?: [number, number]
  className?: string
  resetKey?: string | number
  reportDraft?: (key: string, valid: boolean | null) => void
}

function NumberDraft({
  id,
  label,
  value,
  resetKey,
  report,
  onValid,
}: {
  id: string
  label: string
  value: number
  resetKey?: string | number
  report?: (key: string, valid: boolean | null) => void
  onValid: (value: number) => void
}) {
  const [raw, setRaw] = useState(String(value))
  useEffect(() => {
    setRaw(String(value))
    report?.(id, true)
    return () => report?.(id, null)
  }, [id, resetKey])
  return (
    <Input
      aria-label={label}
      value={raw}
      onChange={(event) => {
        const next = event.target.value
        setRaw(next)
        const valid = next.trim() !== "" && Number.isFinite(Number(next))
        report?.(id, valid)
        if (valid) onValid(Number(next))
      }}
    />
  )
}

export function StretchControl({
  value,
  onChange,
  labels,
  className,
  resetKey,
  reportDraft,
}: StretchControlProps) {
  const mode = value.mode === "custom" ? "minmax" : value.mode
  const percent = value.percent ?? [2, 98]
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Segmented
        options={MODES.map((item) => ({ value: item, label: labels.modes[item] }))}
        value={mode}
        onChange={(next) =>
          onChange(
            next === "percent"
              ? { mode: next, percent: [2, 98] }
              : next === "stddev"
                ? { mode: next, sigma: 2 }
                : { mode: next },
          )
        }
      />
      {mode === "minmax" ? <span>{labels.minmaxHint}</span> : null}
      {mode === "percent" ? (
        <div className="grid grid-cols-2 gap-1">
          <NumberDraft
            id="stretch-percent-low"
            label="Stretch percentile low"
            value={percent[0]}
            resetKey={resetKey}
            report={reportDraft}
            onValid={(low) => onChange({ ...value, mode: "percent", percent: [low, percent[1]] })}
          />
          <NumberDraft
            id="stretch-percent-high"
            label="Stretch percentile high"
            value={percent[1]}
            resetKey={resetKey}
            report={reportDraft}
            onValid={(high) => onChange({ ...value, mode: "percent", percent: [percent[0], high] })}
          />
        </div>
      ) : null}
      {mode === "stddev" ? (
        <NumberDraft
          id="stretch-sigma"
          label="Stretch standard deviation"
          value={value.sigma ?? 2}
          resetKey={resetKey}
          report={reportDraft}
          onValid={(sigma) => onChange({ ...value, mode: "stddev", sigma })}
        />
      ) : null}
    </div>
  )
}

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
  validate = (next) => Number.isFinite(next),
}: {
  id: string
  label: string
  value: number
  resetKey?: string | number
  report?: (key: string, valid: boolean | null) => void
  onValid: (value: number) => void
  validate?: (value: number) => boolean
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
        const valid = next.trim() !== "" && Number.isFinite(Number(next)) && validate(Number(next))
        report?.(id, valid)
        if (valid) onValid(Number(next))
      }}
    />
  )
}

function PercentDraft({
  value,
  resetKey,
  report,
  onValid,
}: {
  value: [number, number]
  resetKey?: string | number
  report?: StretchControlProps["reportDraft"]
  onValid: (value: [number, number]) => void
}) {
  const [raw, setRaw] = useState<[string, string]>([String(value[0]), String(value[1])])
  const validate = (pair: [string, string]) =>
    pair.every((item) => item.trim() !== "" && Number.isFinite(Number(item))) &&
    Number(pair[0]) >= 0 &&
    Number(pair[0]) < Number(pair[1]) &&
    Number(pair[1]) <= 100
  useEffect(() => {
    const next: [string, string] = [String(value[0]), String(value[1])]
    setRaw(next)
    report?.("stretch-percent", validate(next))
    return () => report?.("stretch-percent", null)
  }, [resetKey])
  const update = (position: 0 | 1, next: string) => {
    const pair: [string, string] = [...raw]
    pair[position] = next
    setRaw(pair)
    const valid = validate(pair)
    report?.("stretch-percent", valid)
    if (valid) onValid([Number(pair[0]), Number(pair[1])])
  }
  return (
    <div className="grid grid-cols-2 gap-1">
      <Input
        aria-label="Stretch percentile low"
        value={raw[0]}
        onChange={(event) => update(0, event.target.value)}
      />
      <Input
        aria-label="Stretch percentile high"
        value={raw[1]}
        onChange={(event) => update(1, event.target.value)}
      />
    </div>
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
        <PercentDraft
          value={percent}
          resetKey={resetKey}
          report={reportDraft}
          onValid={(next) => onChange({ ...value, mode: "percent", percent: next })}
        />
      ) : null}
      {mode === "stddev" ? (
        <NumberDraft
          id="stretch-sigma"
          label="Stretch standard deviation"
          value={value.sigma ?? 2}
          resetKey={resetKey}
          report={reportDraft}
          validate={(sigma) => sigma > 0}
          onValid={(sigma) => onChange({ ...value, mode: "stddev", sigma })}
        />
      ) : null}
    </div>
  )
}

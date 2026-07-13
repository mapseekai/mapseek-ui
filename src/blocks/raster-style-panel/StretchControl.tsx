import { useEffect, useRef, useState } from "react"
import { Input } from "../../components/input"
import { cn } from "../../lib/utils"
import { Segmented } from "./Segmented"
import type { RasterStretch, StretchMode } from "./types"

const MODES: StretchMode[] = ["minmax", "percent", "stddev", "custom"]
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
  outputCount?: number
  className?: string
  resetKey?: string | number
  reportDraft?: (key: string, valid: boolean | null) => void
}

function CustomRangesDraft({
  value,
  outputCount,
  resetKey,
  report,
  onValid,
}: {
  value: [number, number][]
  outputCount: number
  resetKey?: string | number
  report?: StretchControlProps["reportDraft"]
  onValid: (value: [number, number][]) => void
}) {
  const strings = () => value.map(([min, max]) => [String(min), String(max)] as [string, string])
  const [raw, setRaw] = useState(strings)
  const rawRef = useRef(raw)
  const validate = (ranges: [string, string][]) =>
    ranges.every(
      ([min, max]) =>
        min.trim() !== "" &&
        max.trim() !== "" &&
        Number.isFinite(Number(min)) &&
        Number.isFinite(Number(max)) &&
        Number(min) < Number(max),
    )
  useEffect(() => {
    const next = strings()
    rawRef.current = next
    setRaw(next)
    report?.("stretch-custom", validate(next))
    return () => report?.("stretch-custom", null)
  }, [resetKey])
  useEffect(() => {
    const previous = rawRef.current
    const next = previous.slice(0, outputCount)
    while (next.length < outputCount) next.push(["", ""])
    rawRef.current = next
    setRaw(next)
    const valid = validate(next)
    report?.("stretch-custom", valid)
    if (outputCount < previous.length && valid) {
      onValid(next.map(([min, max]) => [Number(min), Number(max)]))
    }
  }, [outputCount])
  const update = (index: number, position: 0 | 1, next: string) => {
    const ranges = rawRef.current.map((range) => [...range] as [string, string])
    ranges[index][position] = next
    rawRef.current = ranges
    setRaw(ranges)
    const valid = validate(ranges)
    report?.("stretch-custom", valid)
    if (valid) onValid(ranges.map(([min, max]) => [Number(min), Number(max)]))
  }
  return (
    <div className="flex flex-col gap-1">
      {raw.map((range, index) => (
        <div key={index} className="grid grid-cols-2 gap-1">
          <Input
            aria-label={`Custom stretch ${index + 1} minimum`}
            value={range[0]}
            onChange={(event) => update(index, 0, event.target.value)}
          />
          <Input
            aria-label={`Custom stretch ${index + 1} maximum`}
            value={range[1]}
            onChange={(event) => update(index, 1, event.target.value)}
          />
        </div>
      ))}
    </div>
  )
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
  autoRange,
  outputCount = 1,
}: StretchControlProps) {
  const mode = value.mode
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
                : next === "custom"
                  ? {
                      mode: next,
                      ranges: Array.from({ length: outputCount }, () => autoRange ?? [0, 1]),
                    }
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
      {mode === "custom" ? (
        <CustomRangesDraft
          value={value.ranges ?? Array.from({ length: outputCount }, () => autoRange ?? [0, 1])}
          outputCount={outputCount}
          resetKey={resetKey}
          report={reportDraft}
          onValid={(ranges) => onChange({ mode: "custom", ranges })}
        />
      ) : null}
    </div>
  )
}

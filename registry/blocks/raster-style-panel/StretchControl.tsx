import { useEffect, useId, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Segmented } from "./Segmented"
import type { RasterStretch, StretchMode } from "./types"

const MODES: StretchMode[] = ["minmax", "percent", "stddev", "custom"]

const toRangeStrings = (ranges: [number, number][]) =>
  ranges.map(([min, max]) => [String(min), String(max)] as [string, string])

const validateRangeStrings = (ranges: [string, string][]) =>
  ranges.every(
    ([min, max]) =>
      min.trim() !== "" &&
      max.trim() !== "" &&
      Number.isFinite(Number(min)) &&
      Number.isFinite(Number(max)) &&
      Number(min) < Number(max),
  )

const validatePercentStrings = (pair: [string, string]) =>
  pair.every((item) => item.trim() !== "" && Number.isFinite(Number(item))) &&
  Number(pair[0]) >= 0 &&
  Number(pair[0]) < Number(pair[1]) &&
  Number(pair[1]) <= 100

function useStableIds(count: number, prefix: string) {
  const scope = useId()
  return Array.from({ length: count }, (_, index) => `${scope}-${prefix}-${index}`)
}

export interface StretchControlLabels {
  modes: Record<StretchMode, string>
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
  report,
  onValid,
}: {
  value: [number, number][]
  outputCount: number
  report?: StretchControlProps["reportDraft"]
  onValid: (value: [number, number][]) => void
}) {
  const [raw, setRaw] = useState(() => toRangeStrings(value))
  const rawRef = useRef(raw)
  const reportRef = useRef(report)
  const onValidRef = useRef(onValid)
  const rangeIds = useStableIds(raw.length, "stretch-range")
  useEffect(() => {
    reportRef.current = report
    onValidRef.current = onValid
  })
  useEffect(() => {
    const next = toRangeStrings(value)
    rawRef.current = next
    setRaw(next)
    reportRef.current?.("stretch-custom", validateRangeStrings(next))
    return () => reportRef.current?.("stretch-custom", null)
  }, [value])
  useEffect(() => {
    const previous = rawRef.current
    const next = previous.slice(0, outputCount)
    while (next.length < outputCount) next.push(["", ""])
    rawRef.current = next
    setRaw(next)
    const valid = validateRangeStrings(next)
    reportRef.current?.("stretch-custom", valid)
    if (outputCount < previous.length && valid) {
      onValidRef.current(next.map(([min, max]) => [Number(min), Number(max)]))
    }
  }, [outputCount])
  const update = (index: number, position: 0 | 1, next: string) => {
    const ranges = rawRef.current.map((range) => [...range] as [string, string])
    ranges[index][position] = next
    rawRef.current = ranges
    setRaw(ranges)
    const valid = validateRangeStrings(ranges)
    report?.("stretch-custom", valid)
    if (valid) onValid(ranges.map(([min, max]) => [Number(min), Number(max)]))
  }
  return (
    <div className="flex flex-col gap-1">
      {raw.map((range, index) => (
        <div key={rangeIds[index]} className="grid grid-cols-2 gap-1">
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
  report,
  onValid,
  validate = (next) => Number.isFinite(next),
}: {
  id: string
  label: string
  value: number
  report?: (key: string, valid: boolean | null) => void
  onValid: (value: number) => void
  validate?: (value: number) => boolean
}) {
  const [raw, setRaw] = useState(String(value))
  const reportRef = useRef(report)
  const validateRef = useRef(validate)
  useEffect(() => {
    reportRef.current = report
    validateRef.current = validate
  })
  useEffect(() => {
    setRaw(String(value))
    reportRef.current?.(id, true)
    return () => reportRef.current?.(id, null)
  }, [id, value])
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
  report,
  onValid,
}: {
  value: [number, number]
  report?: StretchControlProps["reportDraft"]
  onValid: (value: [number, number]) => void
}) {
  const [low, high] = value
  const [raw, setRaw] = useState<[string, string]>([String(value[0]), String(value[1])])
  const reportRef = useRef(report)
  useEffect(() => {
    reportRef.current = report
  })
  useEffect(() => {
    const next: [string, string] = [String(low), String(high)]
    setRaw(next)
    reportRef.current?.("stretch-percent", validatePercentStrings(next))
    return () => reportRef.current?.("stretch-percent", null)
  }, [high, low])
  const update = (position: 0 | 1, next: string) => {
    const pair: [string, string] = [...raw]
    pair[position] = next
    setRaw(pair)
    const valid = validatePercentStrings(pair)
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
        columns={2}
        options={MODES.map((item) => ({
          value: item,
          label: labels.modes[item],
        }))}
        value={mode}
        buttonClassName="whitespace-nowrap"
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
      {mode === "percent" ? (
        <PercentDraft
          key={`percent-${resetKey ?? "initial"}`}
          value={percent}
          report={reportDraft}
          onValid={(next) => onChange({ ...value, mode: "percent", percent: next })}
        />
      ) : null}
      {mode === "stddev" ? (
        <NumberDraft
          id="stretch-sigma"
          key={`sigma-${resetKey ?? "initial"}`}
          label="Stretch standard deviation"
          value={value.sigma ?? 2}
          report={reportDraft}
          validate={(sigma) => sigma > 0}
          onValid={(sigma) => onChange({ ...value, mode: "stddev", sigma })}
        />
      ) : null}
      {mode === "custom" ? (
        <CustomRangesDraft
          key={`custom-${resetKey ?? "initial"}`}
          value={value.ranges ?? Array.from({ length: outputCount }, () => autoRange ?? [0, 1])}
          outputCount={outputCount}
          report={reportDraft}
          onValid={(ranges) => onChange({ mode: "custom", ranges })}
        />
      ) : null}
    </div>
  )
}

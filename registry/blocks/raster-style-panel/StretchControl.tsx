import { useEffect, useId, useRef, useState } from "react"
import { ButtonRadioGroup, ButtonRadioGroupItem } from "@/components/ui/button-radio-group"
import { InputNumber } from "@/components/ui/input-number"
import { cn } from "@/lib/utils"
import { NumberDraftInput, RASTER_INPUT_NUMBER_CLASS } from "./NumberDraftInput"
import { isInDataRange, normalizeDataRange } from "./numeric-range"
import type { RasterDataRange, RasterStretch, StretchMode } from "./types"

const MODES: StretchMode[] = ["minmax", "percent", "stddev", "custom"]

type DraftPair = [number | null, number | null]

const toRangeValues = (ranges: [number, number][]): DraftPair[] =>
  ranges.map(([min, max]) => [min, max])

const isFinitePair = (pair: DraftPair): pair is [number, number] =>
  pair[0] !== null && pair[1] !== null && Number.isFinite(pair[0]) && Number.isFinite(pair[1])

const validateRangeValues = (ranges: DraftPair[], dataRange?: RasterDataRange) =>
  ranges.every(
    (pair) =>
      isFinitePair(pair) &&
      pair[0] < pair[1] &&
      isInDataRange(pair[0], dataRange) &&
      isInDataRange(pair[1], dataRange),
  )

const validatePercentValues = (pair: DraftPair) =>
  isFinitePair(pair) && pair[0] >= 0 && pair[0] < pair[1] && pair[1] <= 100

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
  dataRange?: RasterDataRange
  outputCount?: number
  className?: string
  ariaLabel?: string
  resetKey?: string | number
  reportDraft?: (key: string, valid: boolean | null) => void
}

function CustomRangesDraft({
  value,
  outputCount,
  dataRange,
  report,
  onValid,
}: {
  value: [number, number][]
  outputCount: number
  dataRange?: RasterDataRange
  report?: StretchControlProps["reportDraft"]
  onValid: (value: [number, number][]) => void
}) {
  const [raw, setRaw] = useState(() => toRangeValues(value))
  const rawRef = useRef(raw)
  const reportRef = useRef(report)
  const onValidRef = useRef(onValid)
  const rangeIds = useStableIds(raw.length, "stretch-range")
  useEffect(() => {
    reportRef.current = report
    onValidRef.current = onValid
  })
  useEffect(() => {
    const next = toRangeValues(value)
    rawRef.current = next
    setRaw(next)
    reportRef.current?.("stretch-custom", validateRangeValues(next, dataRange))
    return () => reportRef.current?.("stretch-custom", null)
  }, [dataRange, value])
  useEffect(() => {
    const previous = rawRef.current
    const next = previous.slice(0, outputCount)
    while (next.length < outputCount) next.push([null, null])
    rawRef.current = next
    setRaw(next)
    const valid = validateRangeValues(next, dataRange)
    reportRef.current?.("stretch-custom", valid)
    if (outputCount < previous.length && valid) {
      onValidRef.current(next.filter(isFinitePair))
    }
  }, [dataRange, outputCount])
  const update = (index: number, position: 0 | 1, next: number | null) => {
    const ranges = rawRef.current.map((range) => [...range] as DraftPair)
    ranges[index][position] = next
    rawRef.current = ranges
    setRaw(ranges)
    const valid = validateRangeValues(ranges, dataRange)
    report?.("stretch-custom", valid)
    if (valid) onValid(ranges.filter(isFinitePair))
  }
  return (
    <div className="flex flex-col gap-1">
      {raw.map((range, index) => (
        <div key={rangeIds[index]} className="grid grid-cols-2 gap-1">
          <InputNumber
            allowOutOfRange
            min={dataRange?.[0]}
            max={dataRange?.[1]}
            aria-label={`Custom stretch ${index + 1} minimum`}
            className={RASTER_INPUT_NUMBER_CLASS}
            value={range[0]}
            step="any"
            onValueChange={(next) => update(index, 0, next)}
          />
          <InputNumber
            allowOutOfRange
            min={dataRange?.[0]}
            max={dataRange?.[1]}
            aria-label={`Custom stretch ${index + 1} maximum`}
            className={RASTER_INPUT_NUMBER_CLASS}
            value={range[1]}
            step="any"
            onValueChange={(next) => update(index, 1, next)}
          />
        </div>
      ))}
    </div>
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
  const [raw, setRaw] = useState<DraftPair>([value[0], value[1]])
  const rawRef = useRef(raw)
  const reportRef = useRef(report)
  useEffect(() => {
    reportRef.current = report
  })
  useEffect(() => {
    const next: DraftPair = [low, high]
    rawRef.current = next
    setRaw(next)
    reportRef.current?.("stretch-percent", validatePercentValues(next))
    return () => reportRef.current?.("stretch-percent", null)
  }, [high, low])
  const update = (position: 0 | 1, next: number | null) => {
    const pair: DraftPair = [...rawRef.current]
    pair[position] = next
    rawRef.current = pair
    setRaw(pair)
    const valid = validatePercentValues(pair)
    report?.("stretch-percent", valid)
    if (valid && isFinitePair(pair)) onValid(pair)
  }
  return (
    <div className="grid grid-cols-2 gap-1">
      <InputNumber
        allowOutOfRange
        min={0}
        max={100}
        aria-label="Stretch percentile low"
        className={RASTER_INPUT_NUMBER_CLASS}
        value={raw[0]}
        step="any"
        onValueChange={(next) => update(0, next)}
      />
      <InputNumber
        allowOutOfRange
        min={0}
        max={100}
        aria-label="Stretch percentile high"
        className={RASTER_INPUT_NUMBER_CLASS}
        value={raw[1]}
        step="any"
        onValueChange={(next) => update(1, next)}
      />
    </div>
  )
}

export function StretchControl({
  value,
  onChange,
  labels,
  className,
  ariaLabel,
  resetKey,
  reportDraft,
  autoRange,
  dataRange,
  outputCount = 1,
}: StretchControlProps) {
  const mode = value.mode
  const percent = value.percent ?? [2, 98]
  const normalizedDataRange = normalizeDataRange(dataRange)
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <ButtonRadioGroup
        aria-label={ariaLabel}
        className="grid grid-cols-2"
        size="xs"
        variant="soft"
        value={mode}
        onValueChange={(raw) => {
          const next = raw as StretchMode
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
        }}
      >
        {MODES.map((item) => (
          <ButtonRadioGroupItem key={item} value={item} className="min-w-0">
            {labels.modes[item]}
          </ButtonRadioGroupItem>
        ))}
      </ButtonRadioGroup>
      {mode === "percent" ? (
        <PercentDraft
          key={`percent-${resetKey ?? "initial"}`}
          value={percent}
          report={reportDraft}
          onValid={(next) => onChange({ ...value, mode: "percent", percent: next })}
        />
      ) : null}
      {mode === "stddev" ? (
        <NumberDraftInput
          id="stretch-sigma"
          key={`sigma-${resetKey ?? "initial"}`}
          label="Stretch standard deviation"
          value={value.sigma ?? 2}
          report={reportDraft}
          validate={(sigma) => sigma > 0}
          min={0}
          onValid={(sigma) => onChange({ ...value, mode: "stddev", sigma })}
        />
      ) : null}
      {mode === "custom" ? (
        <CustomRangesDraft
          key={`custom-${resetKey ?? "initial"}`}
          value={value.ranges ?? Array.from({ length: outputCount }, () => autoRange ?? [0, 1])}
          outputCount={outputCount}
          dataRange={normalizedDataRange}
          report={reportDraft}
          onValid={(ranges) => onChange({ mode: "custom", ranges })}
        />
      ) : null}
    </div>
  )
}

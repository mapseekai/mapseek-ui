import { useEffect, useRef, useState } from "react"
import { InputNumber } from "@/components/ui/input-number"

export type NumberDraftReporter = (key: string, valid: boolean | null) => void

export const RASTER_INPUT_NUMBER_CLASS =
  "[&_[data-slot=input-number-group]]:pe-14 [&_[data-slot=input-number-controls]]:absolute [&_[data-slot=input-number-controls]]:end-0 [&_[data-slot=input-number-controls]]:top-0"

export interface NumberDraftInputProps {
  id: string
  label: string
  value: number
  report?: NumberDraftReporter
  onValid: (value: number) => void
  validate?: (value: number) => boolean
  min?: number
  max?: number
}

export function NumberDraftInput({
  id,
  label,
  value,
  report,
  onValid,
  validate = (next) => Number.isFinite(next),
  min,
  max,
}: NumberDraftInputProps) {
  const [draft, setDraft] = useState<number | null>(value)
  const reportRef = useRef(report)
  const validateRef = useRef(validate)
  const onValidRef = useRef(onValid)

  useEffect(() => {
    reportRef.current = report
    validateRef.current = validate
    onValidRef.current = onValid
  })

  useEffect(() => {
    setDraft(value)
    reportRef.current?.(id, validateRef.current(value))
    return () => reportRef.current?.(id, null)
  }, [id, value])

  return (
    <InputNumber
      allowOutOfRange
      aria-label={label}
      className={RASTER_INPUT_NUMBER_CLASS}
      max={max}
      min={min}
      step="any"
      value={draft}
      onValueChange={(next) => {
        setDraft(next)
        const valid = next !== null && Number.isFinite(next) && validateRef.current(next)
        reportRef.current?.(id, valid)
        if (valid) onValidRef.current(next)
      }}
    />
  )
}

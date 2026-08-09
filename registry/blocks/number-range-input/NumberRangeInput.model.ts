export type NumberRangeDraft = number | string | undefined

export type ParsedNumberRangeDraft =
  | { valid: true; value: number | undefined }
  | { valid: false }

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function decimalPlaces(value: number): number {
  const text = String(value)
  if (text.includes("e")) {
    const [mantissa, exponent] = text.split("e")
    const [, fraction = ""] = mantissa.split(".")
    return Math.max(0, fraction.length - (Number(exponent) || 0))
  }
  const [, fraction = ""] = text.split(".")
  return fraction.length
}

function roundToStepPrecision(value: number, step: number): number {
  const precision = Math.min(Math.max(decimalPlaces(step), 0), 8)
  return Number(value.toFixed(precision))
}

export function getCommittedNumberRangeValue(
  controlled: boolean,
  controlledValue: number | undefined,
  uncontrolledValue: number | undefined,
): number | undefined {
  return controlled ? controlledValue : uncontrolledValue
}

export function updateUncontrolledNumberRangeValue(
  controlled: boolean,
  current: number | undefined,
  next: number | undefined,
): number | undefined {
  return controlled ? current : next
}

export function resetNumberRangeDraft(
  committedValue: number | undefined,
): NumberRangeDraft {
  return committedValue
}

export function parseNumberRangeDraft(
  draft: NumberRangeDraft,
  min: number,
  max: number,
  step: number,
): ParsedNumberRangeDraft {
  if (draft === undefined || draft === "") return { valid: true, value: undefined }
  const value = Number(draft)
  if (!Number.isFinite(value) || value < min || value > max) return { valid: false }
  return { valid: true, value: roundToStepPrecision(value, step) }
}

export function snapNumberRangeValue(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  if (!step) return clamp(value, min, max)
  const snapped = Math.round((value - min) / step) * step + min
  return clamp(roundToStepPrecision(snapped, step), min, max)
}

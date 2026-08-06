export type CoordinateError = "required" | "invalid" | "range"

export type CoordinateValidationResult =
  | { value: number; error: null }
  | { value: null; error: CoordinateError }

export function parseCoordinate(raw: string, min: number, max: number): CoordinateValidationResult {
  const normalized = raw.trim()
  if (!normalized) {
    return { value: null, error: "required" }
  }

  const value = Number(normalized)
  if (!Number.isFinite(value)) {
    return { value: null, error: "invalid" }
  }
  if (value < min || value > max) {
    return { value: null, error: "range" }
  }

  return { value, error: null }
}

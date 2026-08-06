import { describe, expect, it } from "vitest"

import { parseCoordinate } from "./coordinates"

describe("parseCoordinate", () => {
  it.each([
    ["-180", -180, 180, -180],
    ["180", -180, 180, 180],
    ["-90", -90, 90, -90],
    ["90", -90, 90, 90],
    ["120.123", -180, 180, 120.123],
  ])("accepts %s inside inclusive bounds", (raw, min, max, value) => {
    expect(parseCoordinate(raw, min, max)).toEqual({ value, error: null })
  })

  it.each([
    ["", -180, 180, "required"],
    ["   ", -180, 180, "required"],
    ["abc", -180, 180, "invalid"],
    ["181", -180, 180, "range"],
    ["-91", -90, 90, "range"],
  ] as const)("rejects %s with %s", (raw, min, max, error) => {
    expect(parseCoordinate(raw, min, max)).toEqual({ value: null, error })
  })
})

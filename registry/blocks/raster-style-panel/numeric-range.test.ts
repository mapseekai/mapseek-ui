import { describe, expect, it } from "vitest"
import { isInDataRange, normalizeDataRange } from "./numeric-range"

describe("numeric ranges", () => {
  it("normalizes only finite ascending bounds", () => {
    expect(normalizeDataRange([-18.4, 3842])).toEqual([-18.4, 3842])
    expect(normalizeDataRange([10, 10])).toBeUndefined()
    expect(normalizeDataRange([Number.NaN, 10])).toBeUndefined()
  })

  it("uses inclusive endpoints when bounds are available", () => {
    const range = normalizeDataRange([-18.4, 3842])

    expect(isInDataRange(-18.4, range)).toBe(true)
    expect(isInDataRange(3842, range)).toBe(true)
    expect(isInDataRange(-18.5, range)).toBe(false)
    expect(isInDataRange(5000, range)).toBe(false)
    expect(isInDataRange(5000, undefined)).toBe(true)
  })
})

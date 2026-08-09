import { describe, expect, it } from "vitest"

import {
  getCommittedNumberRangeValue,
  parseNumberRangeDraft,
  resetNumberRangeDraft,
  snapNumberRangeValue,
  updateUncontrolledNumberRangeValue,
} from "./NumberRangeInput.model"

describe("NumberRangeInput model", () => {
  it("uses defaultValue and stores valid updates only when uncontrolled", () => {
    const initial = getCommittedNumberRangeValue(false, undefined, 48)
    expect(initial).toBe(48)
    expect(updateUncontrolledNumberRangeValue(false, initial, 52)).toBe(52)
    expect(updateUncontrolledNumberRangeValue(true, initial, 52)).toBe(48)
  })

  it("treats an explicitly present undefined controlled value as cleared", () => {
    expect(getCommittedNumberRangeValue(true, undefined, 48)).toBeUndefined()
  })

  it("marks out-of-range drafts invalid and restores the committed value on blur", () => {
    expect(parseNumberRangeDraft("101", 0, 100, 1)).toEqual({ valid: false })
    const committed = getCommittedNumberRangeValue(true, 48, undefined)
    expect(resetNumberRangeDraft(committed)).toBe(48)
  })

  it("keeps zero distinct from an empty value", () => {
    expect(parseNumberRangeDraft("0", 0, 100, 1)).toEqual({ valid: true, value: 0 })
    expect(parseNumberRangeDraft("", 0, 100, 1)).toEqual({
      valid: true,
      value: undefined,
    })
  })

  it("snaps integer and decimal slider values without floating-point tails", () => {
    expect(snapNumberRangeValue(4.6, 0, 10, 1)).toBe(5)
    expect(snapNumberRangeValue(0.6246, 0, 1, 0.001)).toBe(0.625)
  })
})

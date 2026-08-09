import { describe, expect, it } from "vitest"

import type { SchemaFormField } from "./types"
import { isSchemaFormValid, seedSchemaFormValues } from "./validate"

describe("isSchemaFormValid", () => {
  it("accepts omitted optional fields", () => {
    const fields: SchemaFormField[] = [
      { key: "title", label: "Title", type: "text" },
      { key: "distance", label: "Distance", type: "number", min: 0, max: 10 },
      { key: "method", label: "Method", type: "select", options: [] },
      { key: "layers", label: "Layers", type: "multiselect", options: [] },
    ]

    expect(isSchemaFormValid(fields, {})).toBe(true)
  })

  it("rejects missing required text select number and multiselect values", () => {
    const fields: SchemaFormField[] = [
      { key: "title", label: "Title", required: true, type: "text" },
      { key: "distance", label: "Distance", required: true, type: "number" },
      { key: "method", label: "Method", required: true, type: "select", options: [] },
      { key: "layers", label: "Layers", required: true, type: "multiselect", options: [] },
    ]

    expect(isSchemaFormValid(fields, {})).toBe(false)
    expect(
      isSchemaFormValid(fields, { title: "Name", distance: 1, method: "dp", layers: ["roads"] }),
    ).toBe(true)
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1, 11])(
    "rejects an invalid bounded number value %s",
    (distance) => {
      const fields: SchemaFormField[] = [
        { key: "distance", label: "Distance", type: "number", min: 0, max: 10 },
      ]

      expect(isSchemaFormValid(fields, { distance })).toBe(false)
    },
  )

  it("enforces an explicit multiselect minimum even without required", () => {
    const fields: SchemaFormField[] = [
      { key: "layers", label: "Layers", type: "multiselect", min: 2, options: [] },
    ]

    expect(isSchemaFormValid(fields, { layers: [] })).toBe(false)
    expect(isSchemaFormValid(fields, { layers: ["roads"] })).toBe(false)
    expect(isSchemaFormValid(fields, { layers: ["roads", "rivers"] })).toBe(true)
  })
})

describe("seedSchemaFormValues", () => {
  it("continues to seed only declared defaults", () => {
    const fields: SchemaFormField[] = [
      { key: "distance", label: "Distance", type: "number", default: 5 },
      { key: "method", label: "Method", type: "select", options: [], default: "dp" },
      { key: "title", label: "Title", type: "text" },
    ]

    expect(seedSchemaFormValues(fields)).toEqual({ distance: 5, method: "dp" })
  })
})

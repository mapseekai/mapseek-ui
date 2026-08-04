import { describe, expect, it, vi } from "vitest"

import { defineCategory } from "../../showcase/src/showcases/types"

describe("showcase component selection", () => {
  it("prefers the overview demo and ignores legacy Showcase exports", async () => {
    const OverviewDemo = vi.fn(() => null)
    const Demo = vi.fn(() => null)
    const LegacyShowcase = vi.fn(() => null)
    const entry = defineCategory("block")("sample-item", "Sample", async () => ({
      SampleItemOverviewDemo: OverviewDemo,
      SampleItemDemo: Demo,
      SampleItemShowcase: LegacyShowcase,
    }))

    await expect(entry.load()).resolves.toEqual({ default: OverviewDemo })
  })

  it("rejects modules that only expose an arbitrary or legacy component", async () => {
    const entry = defineCategory("block")("sample-item", "Sample", async () => ({
      SampleItemShowcase: () => null,
    }))

    await expect(entry.load()).rejects.toThrow(
      "must export SampleItemOverviewDemo or SampleItemDemo",
    )
  })
})

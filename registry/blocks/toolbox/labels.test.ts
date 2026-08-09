import { expect, it } from "vitest"
import { TOOLBOX_LABELS_EN, TOOLBOX_LABELS_ZH_CN } from "./labels"

it("ends toolbox search placeholders with an ellipsis", () => {
  expect(TOOLBOX_LABELS_ZH_CN.search.endsWith("…")).toBe(true)
  expect(TOOLBOX_LABELS_EN.search.endsWith("…")).toBe(true)
})

it("injects required-distance validation copy", () => {
  expect(TOOLBOX_LABELS_ZH_CN.distanceRequired).toBe("请输入缓冲距离")
  expect(TOOLBOX_LABELS_EN.distanceRequired).toBe("Enter a buffer distance")
})

import { expect, it } from "vitest"
import { TOOLBOX_LABELS_EN, TOOLBOX_LABELS_ZH_CN } from "./labels"

it("ends toolbox search placeholders with an ellipsis", () => {
  expect(TOOLBOX_LABELS_ZH_CN.search.endsWith("…")).toBe(true)
  expect(TOOLBOX_LABELS_EN.search.endsWith("…")).toBe(true)
})

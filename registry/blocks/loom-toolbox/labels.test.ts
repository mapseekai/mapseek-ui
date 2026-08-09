import { expect, it } from "vitest"
import { LOOM_TOOLBOX_LABELS_EN, LOOM_TOOLBOX_LABELS_ZH_CN } from "./labels"

it("ends toolbox search placeholders with an ellipsis", () => {
  expect(LOOM_TOOLBOX_LABELS_ZH_CN.search.endsWith("…")).toBe(true)
  expect(LOOM_TOOLBOX_LABELS_EN.search.endsWith("…")).toBe(true)
})

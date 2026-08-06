import { blockShowcases } from "./block-catalog"
import { primitiveShowcases } from "./primitive-catalog"
import type { ShowcaseEntry } from "./types"

const hiddenStandaloneShowcaseIds = new Set(["style-editor-modal"])

export const showcaseEntries = [
  ...primitiveShowcases,
  ...blockShowcases,
] satisfies readonly ShowcaseEntry[]

export const standaloneShowcaseEntries = showcaseEntries.filter(
  (entry) => !hiddenStandaloneShowcaseIds.has(entry.id),
)

export type { DemoLocale, LocalizedDemoProps, ShowcaseCategory, ShowcaseEntry } from "./types"
export { titleFromName } from "./types"

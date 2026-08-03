import { blockShowcases } from "./block-catalog"
import { primitiveShowcases } from "./primitive-catalog"
import type { ShowcaseEntry } from "./types"

export const showcaseEntries = [
  ...primitiveShowcases,
  ...blockShowcases,
] satisfies readonly ShowcaseEntry[]

export type { DemoLocale, LocalizedDemoProps, ShowcaseCategory, ShowcaseEntry } from "./types"
export { titleFromName } from "./types"

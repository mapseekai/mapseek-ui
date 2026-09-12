import { type ShowcaseDemoProps, ShowcasePreview } from "./ShowcasePreview"
import { showcaseSources } from "./source-catalog"

export type { ShowcaseDemoProps } from "./ShowcasePreview"

export function ShowcaseDemo(props: ShowcaseDemoProps) {
  const source = showcaseSources[props.registryName]
  if (!source) throw new Error(`Missing Showcase source for registry item: ${props.registryName}`)

  return <ShowcasePreview {...props} source={source} />
}

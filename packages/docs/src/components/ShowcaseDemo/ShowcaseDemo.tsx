"use client"

import { useParams } from "next/navigation"
import { lazy, Suspense, useMemo } from "react"
import {
  type DemoLocale,
  showcaseEntries,
  titleFromName,
} from "../../../../../showcase/src/showcases/catalog"
import { ComponentDemo } from "../ComponentDemo"
import { showcaseSources } from "./source-catalog.generated"

export type ShowcaseDemoProps = {
  readonly registryName: string
  readonly demo?: string
  readonly title: string
  readonly description?: string
  readonly minHeight?: number
}

export function ShowcaseDemo({
  registryName,
  demo,
  title,
  description,
  minHeight,
}: ShowcaseDemoProps) {
  const params = useParams()
  const segs = (params.slug as string[] | undefined) ?? []
  const locale = (segs[0] === "en" ? "en" : "zh-CN") satisfies DemoLocale
  const entry = showcaseEntries.find((candidate) => candidate.registryName === registryName)
  const exportName = `${titleFromName(registryName)}${demo ? titleFromName(demo) : ""}Demo`
  const demoId = demo ? `${registryName}-${demo}` : registryName
  const ActiveDemo = useMemo(() => {
    if (!entry) return null
    return lazy(async () => {
      const module = await entry.loadModule()
      const named = module[exportName]
      if (named) return { default: named }
      const demoExports = Object.entries(module).filter(
        (pair): pair is [string, NonNullable<(typeof pair)[1]>] =>
          pair[0].endsWith("Demo") && pair[1] !== undefined,
      )
      if (demoExports.length === 1) return { default: demoExports[0][1] }
      throw new Error(`Showcase "${registryName}" does not export ${exportName}.`)
    })
  }, [entry, exportName, registryName])
  const source = showcaseSources[registryName]

  if (!(entry && ActiveDemo && source)) {
    throw new Error(`Missing Showcase source for registry item: ${registryName}`)
  }

  return (
    <ComponentDemo title={title} description={description} source={source} minHeight={minHeight}>
      <Suspense fallback={<p className="m-0 text-xs text-muted-foreground">Loading…</p>}>
        <div data-demo={demoId}>
          <ActiveDemo locale={locale} />
        </div>
      </Suspense>
    </ComponentDemo>
  )
}

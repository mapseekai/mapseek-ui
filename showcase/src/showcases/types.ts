import type { ComponentType } from "react"

export type ShowcaseCategory = "primitive" | "block"

export type DemoLocale = "zh-CN" | "en"

export type LocalizedDemoProps = {
  readonly locale?: DemoLocale
}

export type ShowcaseModule = {
  readonly [exportName: string]: ComponentType<LocalizedDemoProps> | undefined
}

export type ShowcaseEntry = {
  readonly id: string
  readonly name: string
  readonly category: ShowcaseCategory
  readonly registryName?: string
  readonly load: () => Promise<{ readonly default: ComponentType<LocalizedDemoProps> }>
  readonly loadModule: () => Promise<ShowcaseModule>
}

export function titleFromName(name: string): string {
  return name
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("")
}

function pickAppShowcase(
  module: ShowcaseModule,
  registryName: string,
): ComponentType<LocalizedDemoProps> {
  const title = titleFromName(registryName)
  const component = module[`${title}OverviewDemo`] ?? module[`${title}Demo`]
  if (!component) {
    throw new Error(
      `Showcase module for "${registryName}" must export ${title}OverviewDemo or ${title}Demo.`,
    )
  }
  return component
}

export function defineCategory(category: ShowcaseCategory) {
  return (
    registryName: string,
    name: string,
    loadModule: () => Promise<ShowcaseModule>,
  ): ShowcaseEntry => ({
    id: registryName,
    registryName,
    name,
    category,
    loadModule,
    load: async () => ({ default: pickAppShowcase(await loadModule(), registryName) }),
  })
}

export function defineCustom(
  id: string,
  name: string,
  category: ShowcaseCategory,
  loadModule: () => Promise<ShowcaseModule>,
): ShowcaseEntry {
  return {
    id,
    name,
    category,
    loadModule,
    load: async () => ({ default: pickAppShowcase(await loadModule(), id) }),
  }
}

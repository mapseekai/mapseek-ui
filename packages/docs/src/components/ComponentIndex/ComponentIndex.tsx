import Link from "@docusaurus/Link"
import useGlobalData from "@docusaurus/useGlobalData"
import { useState } from "react"
import { getRegistryDocItems, type RegistryDocItem } from "../RegistryItem/registry-data"
import styles from "./styles.module.css"

export type ComponentIndexProps = {
  readonly category: RegistryDocItem["category"]
  readonly searchLabel: string
  readonly emptyLabel: string
}

type DocsGlobalData = {
  readonly versions?: readonly {
    readonly name: string
    readonly docs?: readonly {
      readonly path: string
    }[]
  }[]
}

type GlobalData = {
  readonly "docusaurus-plugin-content-docs"?: {
    readonly default?: DocsGlobalData
  }
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("en").replace(/[^a-z0-9]/gu, "")
}

function matchesQuery(item: RegistryDocItem, query: string): boolean {
  if (!query) return true
  return [item.title, item.name, item.description].some((value) => normalize(value).includes(query))
}

function routePatternForCategory(category: RegistryDocItem["category"]): RegExp {
  return category === "block"
    ? /^\/(?:en\/)?blocks\/([^/]+)$/u
    : /^\/(?:en\/)?components\/([^/]+)$/u
}

function getRoutableRegistryNames(globalData: GlobalData, category: RegistryDocItem["category"]) {
  const docsData = globalData["docusaurus-plugin-content-docs"]?.default
  const current =
    docsData?.versions?.find((version) => version.name === "current") ?? docsData?.versions?.[0]
  const routePattern = routePatternForCategory(category)

  return new Map(
    (current?.docs ?? [])
      .map((doc) => {
        const match = routePattern.exec(doc.path)
        return match ? [match[1], doc.path] : undefined
      })
      .filter((entry): entry is [string, string] => entry !== undefined),
  )
}

export function ComponentIndex({ category, searchLabel, emptyLabel }: ComponentIndexProps) {
  const globalData = useGlobalData() as GlobalData
  const [query, setQuery] = useState("")
  const routableNames = getRoutableRegistryNames(globalData, category)
  const normalizedQuery = normalize(query)
  const items = getRegistryDocItems(category).filter(
    (item) => routableNames.has(item.name) && matchesQuery(item, normalizedQuery),
  )

  return (
    <section className={styles.index} data-component-index={category}>
      <label className={styles.searchLabel}>
        <span>{searchLabel}</span>
        <input
          className={styles.searchInput}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </label>

      {items.length > 0 ? (
        <ul className={styles.grid}>
          {items.map((item) => (
            <li className={styles.item} key={item.name}>
              <Link
                className={styles.card}
                data-component-card={item.name}
                to={routableNames.get(item.name) ?? "#"}
              >
                <span className={styles.title}>{item.title}</span>
                <span className={styles.description}>{item.description}</span>
                <code className={styles.command}>@mapseek/{item.name}</code>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{emptyLabel}</p>
      )}
    </section>
  )
}

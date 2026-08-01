import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import { useMemo, useState } from "react"
import { getRegistryDocItems, type RegistryDocItem } from "../RegistryItem/registry-data"
import styles from "./styles.module.css"

export type ComponentIndexProps = {
  readonly category: RegistryDocItem["category"]
  readonly searchLabel: string
  readonly emptyLabel: string
  readonly documentedNames?: readonly string[]
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("en").replace(/[^a-z0-9]/gu, "")
}

function matchesQuery(item: RegistryDocItem, query: string): boolean {
  if (!query) return true
  return [item.title, item.name, item.description].some((value) => normalize(value).includes(query))
}

export function ComponentIndex({
  category,
  searchLabel,
  emptyLabel,
  documentedNames,
}: ComponentIndexProps) {
  const { i18n } = useDocusaurusContext()
  const [query, setQuery] = useState("")
  const routeBase = category === "block" ? "blocks" : "components"
  const localePrefix = i18n.currentLocale === "en" ? "/en" : ""
  const documented = useMemo(
    () => (documentedNames ? new Set(documentedNames) : null),
    [documentedNames],
  )
  const normalizedQuery = normalize(query)
  const items = getRegistryDocItems(category).filter(
    (item) => (!documented || documented.has(item.name)) && matchesQuery(item, normalizedQuery),
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
                to={`${localePrefix}/${routeBase}/${item.name}`}
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

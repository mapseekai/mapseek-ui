"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { getRegistryDocItems, type RegistryDocItem } from "../RegistryItem/registry-data"
import styles from "./styles.module.css"

export type ComponentIndexProps = {
  readonly category: RegistryDocItem["category"]
  readonly searchLabel: string
  readonly emptyLabel: string
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("en").replace(/[^a-z0-9]/gu, "")
}

function matchesQuery(item: RegistryDocItem, query: string): boolean {
  if (!query) return true
  return [item.title, item.name, item.description].some((value) => normalize(value).includes(query))
}

function hrefForItem(category: RegistryDocItem["category"], name: string, locale: "en" | "zh-CN") {
  const prefix = locale === "en" ? "/en" : ""
  const section = category === "block" ? "blocks" : "components"
  return `${prefix}/${section}/${name}`
}

export function ComponentIndex({ category, searchLabel, emptyLabel }: ComponentIndexProps) {
  const params = useParams()
  const segs = (params.slug as string[] | undefined) ?? []
  const locale = segs[0] === "en" ? "en" : "zh-CN"
  const [query, setQuery] = useState("")
  const normalizedQuery = normalize(query)
  const items = getRegistryDocItems(category).filter((item) => matchesQuery(item, normalizedQuery))

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
                href={hrefForItem(category, item.name, locale)}
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

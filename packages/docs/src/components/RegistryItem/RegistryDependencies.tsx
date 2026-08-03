"use client"

import { getRegistryDocItem } from "./registry-data"
import styles from "./styles.module.css"
import { useLocaleLabels } from "./use-locale-labels"

export type RegistryDependenciesLabels = {
  readonly registryDependencies: string
  readonly packageDependencies: string
  readonly none: string
}

export const zhRegistryDependenciesLabels = {
  registryDependencies: "Registry 依赖",
  packageDependencies: "包依赖",
  none: "无",
} satisfies RegistryDependenciesLabels

export const enRegistryDependenciesLabels = {
  registryDependencies: "Registry dependencies",
  packageDependencies: "Package dependencies",
  none: "None",
} satisfies RegistryDependenciesLabels

export type RegistryDependenciesProps = {
  readonly registryName: string
  readonly labels?: RegistryDependenciesLabels
}

function DependencyList({
  values,
  noneLabel,
}: {
  readonly values: readonly string[]
  readonly noneLabel: string
}) {
  if (values.length === 0) {
    return <p>{noneLabel}</p>
  }

  return (
    <ul>
      {values.map((value) => (
        <li key={value}>
          <code>{value}</code>
        </li>
      ))}
    </ul>
  )
}

export function RegistryDependencies({ registryName, labels }: RegistryDependenciesProps) {
  const localizedLabels = useLocaleLabels({
    zh: zhRegistryDependenciesLabels,
    en: enRegistryDependenciesLabels,
  })
  const dependencyLabels = labels ?? localizedLabels
  const item = getRegistryDocItem(registryName)

  return (
    <div className={styles.dependencies}>
      <section className={styles.dependencyGroup}>
        <h3>{dependencyLabels.registryDependencies}</h3>
        <DependencyList values={item.registryDependencies} noneLabel={dependencyLabels.none} />
      </section>
      <section className={styles.dependencyGroup}>
        <h3>{dependencyLabels.packageDependencies}</h3>
        <DependencyList values={item.dependencies} noneLabel={dependencyLabels.none} />
      </section>
    </div>
  )
}

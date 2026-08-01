import { getRegistryDocItem } from "./registry-data"

export type RegistryDependenciesProps = {
  readonly registryName: string
}

function DependencyList({ values }: { readonly values: readonly string[] }) {
  if (values.length === 0) {
    return <p>None</p>
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

export function RegistryDependencies({ registryName }: RegistryDependenciesProps) {
  const item = getRegistryDocItem(registryName)

  return (
    <div>
      <h3>Registry dependencies</h3>
      <DependencyList values={item.registryDependencies} />
      <h3>Package dependencies</h3>
      <DependencyList values={item.dependencies} />
    </div>
  )
}

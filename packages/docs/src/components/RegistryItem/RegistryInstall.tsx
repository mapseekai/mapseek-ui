import { useState } from "react"
import { useLocaleLabels } from "../../examples/use-locale-labels"
import { getRegistryDocItem } from "./registry-data"

export type RegistryInstallLabels = {
  readonly copyInstallCommand: string
  readonly commandCopied: string
}

export const zhRegistryInstallLabels = {
  copyInstallCommand: "复制安装命令",
  commandCopied: "命令已复制",
} satisfies RegistryInstallLabels

export const enRegistryInstallLabels = {
  copyInstallCommand: "Copy install command",
  commandCopied: "Command copied",
} satisfies RegistryInstallLabels

export type RegistryInstallProps = {
  readonly registryName: string
  readonly labels?: RegistryInstallLabels
}

export function RegistryInstall({ registryName, labels }: RegistryInstallProps) {
  const [copied, setCopied] = useState(false)
  const localizedLabels = useLocaleLabels({
    zh: zhRegistryInstallLabels,
    en: enRegistryInstallLabels,
  })
  const installLabels = labels ?? localizedLabels
  const item = getRegistryDocItem(registryName)
  const command = `bunx shadcn@4.8.0 add @mapseek/${item.name}`

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
  }

  return (
    <div>
      <pre>
        <code>{command}</code>
      </pre>
      <button type="button" onClick={copyCommand}>
        {installLabels.copyInstallCommand}
      </button>
      <span aria-live="polite">{copied ? installLabels.commandCopied : null}</span>
    </div>
  )
}

"use client"

import { CopyButton } from "@registry/ui/copy-button"
import { useEffect, useState } from "react"
import { getRegistryDocItem } from "./registry-data"
import styles from "./styles.module.css"
import { useLocaleLabels } from "./use-locale-labels"

export type RegistryInstallLabels = {
  readonly packageManager: string
  readonly copyInstallCommand: string
  readonly commandCopied: string
}

export const zhRegistryInstallLabels = {
  packageManager: "包管理器",
  copyInstallCommand: "复制安装命令",
  commandCopied: "命令已复制",
} satisfies RegistryInstallLabels

export const enRegistryInstallLabels = {
  packageManager: "Package manager",
  copyInstallCommand: "Copy install command",
  commandCopied: "Command copied",
} satisfies RegistryInstallLabels

export type RegistryInstallProps = {
  readonly registryName: string
  readonly labels?: RegistryInstallLabels
}

type PackageManager = "npm" | "pnpm" | "bun"

const PACKAGE_MANAGERS: readonly PackageManager[] = ["npm", "pnpm", "bun"]
const STORAGE_KEY = "mapseek:package-manager"

function installCommand(manager: PackageManager, name: string): string {
  const target = `@mapseek/${name}`
  switch (manager) {
    case "pnpm":
      return `pnpm dlx shadcn@4.8.0 add ${target}`
    case "bun":
      return `bunx shadcn@4.8.0 add ${target}`
    default:
      return `npx shadcn@4.8.0 add ${target}`
  }
}

export function RegistryInstall({ registryName, labels }: RegistryInstallProps) {
  const [manager, setManager] = useState<PackageManager>("npm")
  const localizedLabels = useLocaleLabels({
    zh: zhRegistryInstallLabels,
    en: enRegistryInstallLabels,
  })
  const installLabels = labels ?? localizedLabels
  const item = getRegistryDocItem(registryName)
  const command = installCommand(manager, item.name)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "npm" || stored === "pnpm" || stored === "bun") setManager(stored)
  }, [])

  const selectManager = (next: PackageManager) => {
    setManager(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <div className={styles.install} data-install-widget>
      <div aria-label={installLabels.packageManager} className={styles.managerTabs} role="tablist">
        {PACKAGE_MANAGERS.map((id) => (
          <button
            aria-selected={manager === id}
            className={styles.managerTab}
            data-active={manager === id || undefined}
            key={id}
            onClick={() => selectManager(id)}
            role="tab"
            type="button"
          >
            {id}
          </button>
        ))}
      </div>
      <div className={styles.commandRow}>
        <code>{command}</code>
        <CopyButton
          content={command}
          copiedLabel={installLabels.commandCopied}
          duration={1500}
          label={installLabels.copyInstallCommand}
        />
      </div>
    </div>
  )
}

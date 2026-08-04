"use client"

import { CopyButton } from "@registry/ui/copy-button"
import { ToggleGroup, ToggleGroupItem } from "@registry/ui/toggle-group"
import { useEffect, useState } from "react"
import { SHADCN_PACKAGE } from "../../../../../shared/shadcn"
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
      return `pnpm dlx ${SHADCN_PACKAGE} add ${target}`
    case "bun":
      return `bunx ${SHADCN_PACKAGE} add ${target}`
    default:
      return `npx ${SHADCN_PACKAGE} add ${target}`
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
      <ToggleGroup
        aria-label={installLabels.packageManager}
        className={styles.managerTabs}
        spacing={0}
        value={[manager]}
        onValueChange={([next]) => {
          if (next === "npm" || next === "pnpm" || next === "bun") selectManager(next)
        }}
      >
        {PACKAGE_MANAGERS.map((id) => (
          <ToggleGroupItem
            className={styles.managerTab}
            data-active={manager === id || undefined}
            key={id}
            value={id}
          >
            {id}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className={styles.commandRow}>
        <code>{command}</code>
        <CopyButton
          className={styles.copyButton}
          content={command}
          copiedLabel={installLabels.commandCopied}
          duration={1500}
          label={installLabels.copyInstallCommand}
        />
      </div>
    </div>
  )
}
